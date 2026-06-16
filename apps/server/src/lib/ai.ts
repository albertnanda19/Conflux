import { generateText, type LanguageModelV1 } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { createOpenAI } from "@ai-sdk/openai"

type AiProviderConfig = {
  name: string
  model: string
  createProvider: () => (modelId: string) => LanguageModelV1
}

function buildFallbackChain(): AiProviderConfig[] {
  return [
    {
      name: "Google Gemini",
      model: "gemini-1.5-flash",
      createProvider: () =>
        createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY || "" }),
    },
    {
      name: "OpenAI",
      model: "gpt-4o-mini",
      createProvider: () =>
        createOpenAI({ apiKey: process.env.OPENAI_API_KEY || "" }),
    },
  ]
}

const FALLBACK_CHAIN = buildFallbackChain()

const FALLBACK_RESPONSE =
  "Maaf, saat ini sistem sedang sibuk. Tim kami akan segera menghubungi Anda."

export type AiGenerateParams = {
  systemPrompt: string
  messages: { role: "user" | "assistant"; content: string }[]
  maxTokens?: number
  temperature?: number
}

export async function generateWithFallback(params: AiGenerateParams): Promise<string> {
  for (const providerConfig of FALLBACK_CHAIN) {
    try {
      const provider = providerConfig.createProvider()
      const { text } = await generateText({
        model: provider(providerConfig.model),
        system: params.systemPrompt,
        messages: params.messages,
        maxTokens: params.maxTokens ?? 1024,
        temperature: params.temperature ?? 0.7,
      })
      return text
    } catch (error) {
      console.warn(
        `[AI] Provider ${providerConfig.name} gagal:`,
        error instanceof Error ? error.message : "Kesalahan tidak diketahui",
      )
      continue
    }
  }

  console.error("[AI] Semua provider gagal. Menggunakan fallback message manual.")
  return FALLBACK_RESPONSE
}
