import * as q from "./queries"
import { searchChunks } from "@/modules/knowledge-base/queries"
import { generateEmbedding, generateWithFallback } from "@/lib/ai"
import { NotFoundError, BadRequestError } from "@/lib/errors"
import type { CreateAssistantInput, UpdateAssistantInput, ListAssistantsQuery, TestChatInput } from "./types"

const STATUS_CYCLE: Record<string, string> = { active: "paused", paused: "draft", draft: "active" }

export async function listAssistants(query: ListAssistantsQuery) {
  return q.listAssistants(query)
}

export async function getAssistant(id: string) {
  const row = await q.findAssistantById(id)
  if (!row) throw new NotFoundError("AI Assistant")
  return row
}

export async function createAssistant(input: CreateAssistantInput, createdBy: string) {
  return q.createAssistant({ ...input, createdBy })
}

export async function updateAssistant(id: string, input: UpdateAssistantInput) {
  await getAssistant(id)
  return q.updateAssistant(id, input)
}

export async function deleteAssistant(id: string) {
  await getAssistant(id)
  await q.deleteAssistant(id)
}

export async function cycleStatus(id: string) {
  const current = await getAssistant(id)
  return q.updateAssistant(id, { status: STATUS_CYCLE[current.status] as CreateAssistantInput["status"] })
}

export async function assignAgent(assistantId: string, agentId: string | null) {
  await getAssistant(assistantId)
  if (agentId) {
    const agent = await q.findAgentById(agentId)
    if (!agent) throw new NotFoundError("Agen")
    if (agent.role === "super_admin") throw new BadRequestError("Super admin tidak dapat ditugaskan AI Assistant.")
  }
  return q.assignAgent(assistantId, agentId)
}

type AssistantRow = typeof import("@/lib/schema").aiAssistants.$inferSelect

export type ContactProfile = {
  fullName: string | null
  pipelineStatus: string | null
  source: string | null
  notes: string | null
}

const MAX_CONTEXT_CHARS = 6000

function buildSystemPrompt(assistant: AssistantRow, context: string, contact?: ContactProfile): string {
  const base = assistant.systemPrompt?.trim() ||
    `Anda adalah ${assistant.personaName || assistant.name}, asisten virtual yang membantu calon pelanggan.`
  const tone = `Gaya bahasa: ${assistant.personaTone}. Bahasa: ${assistant.personaLanguage || "Bahasa Indonesia"}.`
  const today = new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
  const profile = contact
    ? `\nProfil kontak — nama: ${contact.fullName ?? "tidak diketahui"}; status pipeline: ${contact.pipelineStatus ?? "-"}; sumber: ${contact.source ?? "-"}.` +
      (contact.notes ? ` Catatan internal: ${contact.notes}` : "")
    : ""
  const style = "Jawab ringkas dan langsung untuk percakapan chat. Jangan mengarang informasi yang tidak ada di konteks."
  const guard = context
    ? `Jawab HANYA berdasarkan konteks berikut. Jika informasi tidak ada di konteks, katakan Anda belum memiliki informasinya dan akan menghubungkan ke tim.\n\nKONTEKS:\n${context}`
    : "Jika Anda tidak memiliki informasi yang diminta, katakan dengan jujur dan tawarkan untuk menghubungkan ke tim."
  return `${base}\n${tone}\nHari ini: ${today}.${profile}\n${style}\n\n${guard}`
}

const SIGNAL_PATTERNS: Record<string, string[]> = {
  keyword: ["daftar", "bayar", "mau beli", "beli", "checkout"],
  behavior: ["rekening", "transfer", "nomor rekening", "link pembayaran", "klik link", "invoice"],
  sentiment: ["budget", "anggaran", "jadwal demo", "konsultasi", "siap daftar", "jadi ikut", "deal"],
}

export function detectHandoff(lastUserMessage: string, handoffConfig: unknown): boolean {
  const cfg = handoffConfig as
    | { triggerKeywords?: string[]; conversionSignals?: { type: string; enabled: boolean }[] }
    | null
  const text = lastUserMessage.toLowerCase()

  const keywords = cfg?.triggerKeywords ?? []
  if (keywords.some((k) => text.includes(k.toLowerCase()))) return true

  for (const signal of cfg?.conversionSignals ?? []) {
    if (!signal.enabled) continue
    const patterns = SIGNAL_PATTERNS[signal.type] ?? []
    if (patterns.some((p) => text.includes(p))) return true
  }
  return false
}

export async function generateRagReply(
  assistant: AssistantRow,
  messages: { role: "user" | "assistant"; content: string }[],
  contact?: ContactProfile,
): Promise<string> {
  const recentUserTurns = messages.filter((m) => m.role === "user").slice(-3).map((m) => m.content)
  let context = ""
  if (recentUserTurns.length > 0) {
    try {
      const embedding = await generateEmbedding(recentUserTurns.join("\n"))
      const scope = assistant.kbScope === "custom"
        ? { mode: "custom" as const, documentIds: (assistant.customKbDocumentIds as string[]) ?? [] }
        : { mode: "global" as const, documentIds: [] }
      const chunks = await searchChunks(embedding, scope, 5)
      context = chunks.map((c) => `[${c.title}]\n${c.content}`).join("\n\n").slice(0, MAX_CONTEXT_CHARS)
    } catch (error) {
      console.warn("[AI] Gagal mengambil konteks KB:", error instanceof Error ? error.message : error)
    }
  }
  return generateWithFallback({ systemPrompt: buildSystemPrompt(assistant, context, contact), messages })
}

export async function testChat(id: string, input: TestChatInput) {
  const assistant = await getAssistant(id)
  const lastUser = [...input.messages].reverse().find((m) => m.role === "user")
  const response = await generateRagReply(assistant, input.messages)
  return {
    response,
    handoffDetected: lastUser ? detectHandoff(lastUser.content, assistant.handoffConfig) : false,
  }
}
