import { generateText, embed, embedMany, type LanguageModelV1 } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { createOpenAI } from "@ai-sdk/openai"
import { createOpenAICompatible } from "@ai-sdk/openai-compatible"
import { asc, eq } from "drizzle-orm"
import { db } from "./db"
import { aiProviders } from "./schema"

const FALLBACK_RESPONSE =
  "Maaf, saat ini sistem sedang sibuk. Tim kami akan segera menghubungi Anda."

const EMBEDDING_MODEL = process.env.AI_EMBEDDING_MODEL || "gemini-embedding-001"
const EMBEDDING_DIMENSIONS = 768
const REQUEST_TIMEOUT_MS = Number(process.env.AI_REQUEST_TIMEOUT_MS) || 12000

type ProviderRow = {
  name: string
  model: string
  maxTokens: number
  temperature: number
  envKeyName: string
}

function buildModel(row: ProviderRow): LanguageModelV1 | null {
  const apiKey = process.env[row.envKeyName]
  if (!apiKey) return null
  switch (row.envKeyName) {
    case "GEMINI_API_KEY":
      return createGoogleGenerativeAI({ apiKey })(row.model)
    case "OPENROUTER_API_KEY":
      return createOpenAICompatible({
        name: "openrouter",
        baseURL: "https://openrouter.ai/api/v1",
        apiKey,
      })(row.model)
    case "OPENAI_API_KEY":
      return createOpenAI({ apiKey })(row.model)
    default:
      return null
  }
}

async function loadProviderChain(): Promise<ProviderRow[]> {
  return db
    .select({
      name: aiProviders.name,
      model: aiProviders.model,
      maxTokens: aiProviders.maxTokens,
      temperature: aiProviders.temperature,
      envKeyName: aiProviders.envKeyName,
    })
    .from(aiProviders)
    .where(eq(aiProviders.isEnabled, true))
    .orderBy(asc(aiProviders.priority))
}

export type AiGenerateParams = {
  systemPrompt: string
  messages: { role: "user" | "assistant"; content: string }[]
  maxTokens?: number
  temperature?: number
}

export async function generateWithFallback(params: AiGenerateParams): Promise<string> {
  const chain = await loadProviderChain()
  for (const row of chain) {
    const model = buildModel(row)
    if (!model) continue
    try {
      const { text } = await generateText({
        model,
        system: params.systemPrompt,
        messages: params.messages,
        maxTokens: params.maxTokens ?? row.maxTokens,
        temperature: params.temperature ?? row.temperature,
        abortSignal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      })
      return text
    } catch (error) {
      console.warn(
        `[AI] Provider ${row.name} gagal:`,
        error instanceof Error ? error.message : "Kesalahan tidak diketahui",
      )
      continue
    }
  }
  console.error("[AI] Semua provider gagal. Menggunakan fallback message manual.")
  return FALLBACK_RESPONSE
}

function embeddingModel() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error("GEMINI_API_KEY tidak dikonfigurasi untuk embedding.")
  return createGoogleGenerativeAI({ apiKey }).textEmbeddingModel(EMBEDDING_MODEL, {
    outputDimensionality: EMBEDDING_DIMENSIONS,
  })
}

export async function generateEmbedding(value: string): Promise<number[]> {
  const { embedding } = await embed({ model: embeddingModel(), value })
  return embedding
}

export async function embedTexts(values: string[]): Promise<number[][]> {
  if (values.length === 0) return []
  const { embeddings } = await embedMany({ model: embeddingModel(), values })
  return embeddings
}
