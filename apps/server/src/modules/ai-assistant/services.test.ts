import { describe, it, expect, vi, beforeEach } from "vitest"
import * as service from "./services"
import { detectHandoff } from "./services"
import * as q from "./queries"
import * as kbQ from "@/modules/knowledge-base/queries"
import * as ai from "@/lib/ai"
import { NotFoundError, BadRequestError } from "@/lib/errors"

vi.mock("./queries")
vi.mock("@/modules/knowledge-base/queries")
vi.mock("@/lib/ai")

const baseAssistant = {
  id: "a1", name: "Bot", status: "active", personaTone: "casual", personaLanguage: "Bahasa Indonesia",
  personaName: "Bot", systemPrompt: "prompt", kbScope: "global", customKbDocumentIds: [],
  handoffConfig: { triggerKeywords: ["daftar", "bayar"] },
}

beforeEach(() => vi.clearAllMocks())

describe("detectHandoff", () => {
  it("true pada trigger keyword", () => {
    expect(detectHandoff("saya mau daftar", { triggerKeywords: ["daftar"] })).toBe(true)
  })
  it("true pada signal behavior aktif (rekening)", () => {
    expect(detectHandoff("kirim nomor rekening dong", { triggerKeywords: [], conversionSignals: [{ type: "behavior", enabled: true }] })).toBe(true)
  })
  it("false bila signal dinonaktifkan", () => {
    expect(detectHandoff("berapa budget yang dibutuhkan", { triggerKeywords: [], conversionSignals: [{ type: "sentiment", enabled: false }] })).toBe(false)
  })
  it("false bila tak ada match", () => {
    expect(detectHandoff("halo apa kabar", { triggerKeywords: ["daftar"], conversionSignals: [] })).toBe(false)
  })
})

describe("getAssistant", () => {
  it("melempar NotFoundError bila tidak ada", async () => {
    vi.mocked(q.findAssistantById).mockResolvedValue(null as never)
    await expect(service.getAssistant("x")).rejects.toThrow(NotFoundError)
  })
})

describe("cycleStatus", () => {
  it("active → paused", async () => {
    vi.mocked(q.findAssistantById).mockResolvedValue({ ...baseAssistant, status: "active" } as never)
    vi.mocked(q.updateAssistant).mockResolvedValue({} as never)
    await service.cycleStatus("a1")
    expect(q.updateAssistant).toHaveBeenCalledWith("a1", { status: "paused" })
  })
})

describe("assignAgent", () => {
  it("menolak super_admin", async () => {
    vi.mocked(q.findAssistantById).mockResolvedValue(baseAssistant as never)
    vi.mocked(q.findAgentById).mockResolvedValue({ id: "u1", role: "super_admin" } as never)
    await expect(service.assignAgent("a1", "u1")).rejects.toThrow(BadRequestError)
  })

  it("melempar NotFoundError bila agen tidak ada", async () => {
    vi.mocked(q.findAssistantById).mockResolvedValue(baseAssistant as never)
    vi.mocked(q.findAgentById).mockResolvedValue(null as never)
    await expect(service.assignAgent("a1", "u1")).rejects.toThrow(NotFoundError)
  })

  it("unassign (null) tanpa cek agen", async () => {
    vi.mocked(q.findAssistantById).mockResolvedValue(baseAssistant as never)
    vi.mocked(q.assignAgent).mockResolvedValue({} as never)
    await service.assignAgent("a1", null)
    expect(q.assignAgent).toHaveBeenCalledWith("a1", null)
    expect(q.findAgentById).not.toHaveBeenCalled()
  })
})

describe("generateRagReply", () => {
  it("menyuntikkan profil kontak ke system prompt", async () => {
    vi.mocked(ai.generateEmbedding).mockResolvedValue([0.1])
    vi.mocked(kbQ.searchChunks).mockResolvedValue([])
    vi.mocked(ai.generateWithFallback).mockResolvedValue("ok")

    await service.generateRagReply(baseAssistant as never, [{ role: "user", content: "halo" }], {
      fullName: "Budi", pipelineStatus: "qualified", source: "whatsapp", notes: "minat Data Science",
    })

    const arg = vi.mocked(ai.generateWithFallback).mock.calls[0]![0]
    expect(arg.systemPrompt).toContain("Profil kontak")
    expect(arg.systemPrompt).toContain("Budi")
    expect(arg.systemPrompt).toContain("minat Data Science")
  })

  it("query expansion: embed gabungan giliran user terakhir", async () => {
    vi.mocked(ai.generateEmbedding).mockResolvedValue([0.2])
    vi.mocked(kbQ.searchChunks).mockResolvedValue([])
    vi.mocked(ai.generateWithFallback).mockResolvedValue("ok")

    await service.generateRagReply(baseAssistant as never, [
      { role: "user", content: "data science" },
      { role: "assistant", content: "tentang DS..." },
      { role: "user", content: "berapa harganya?" },
    ])

    expect(ai.generateEmbedding).toHaveBeenCalledWith("data science\nberapa harganya?")
  })
})

describe("testChat", () => {
  it("ambil konteks KB + generate + deteksi handoff true pada keyword", async () => {
    vi.mocked(q.findAssistantById).mockResolvedValue(baseAssistant as never)
    vi.mocked(ai.generateEmbedding).mockResolvedValue([0.1, 0.2])
    vi.mocked(kbQ.searchChunks).mockResolvedValue([{ title: "Harga", content: "Rp 1jt" }])
    vi.mocked(ai.generateWithFallback).mockResolvedValue("Silakan daftar di sini.")

    const result = await service.testChat("a1", { messages: [{ role: "user", content: "cara daftar bayar?" }] })
    expect(result.response).toBe("Silakan daftar di sini.")
    expect(result.handoffDetected).toBe(true)
    expect(kbQ.searchChunks).toHaveBeenCalledWith([0.1, 0.2], { mode: "global", documentIds: [] }, 5)
  })

  it("handoff false bila tak ada keyword", async () => {
    vi.mocked(q.findAssistantById).mockResolvedValue(baseAssistant as never)
    vi.mocked(ai.generateEmbedding).mockResolvedValue([0.1])
    vi.mocked(kbQ.searchChunks).mockResolvedValue([])
    vi.mocked(ai.generateWithFallback).mockResolvedValue("Halo!")

    const result = await service.testChat("a1", { messages: [{ role: "user", content: "halo apa kabar" }] })
    expect(result.handoffDetected).toBe(false)
  })

  it("tetap menjawab walau retrieval KB gagal", async () => {
    vi.mocked(q.findAssistantById).mockResolvedValue(baseAssistant as never)
    vi.mocked(ai.generateEmbedding).mockRejectedValue(new Error("embed gagal"))
    vi.mocked(ai.generateWithFallback).mockResolvedValue("Maaf, coba lagi.")

    const result = await service.testChat("a1", { messages: [{ role: "user", content: "halo" }] })
    expect(result.response).toBe("Maaf, coba lagi.")
  })

  it("custom scope mengirim documentIds ke searchChunks", async () => {
    vi.mocked(q.findAssistantById).mockResolvedValue({ ...baseAssistant, kbScope: "custom", customKbDocumentIds: ["d1", "d2"] } as never)
    vi.mocked(ai.generateEmbedding).mockResolvedValue([0.5])
    vi.mocked(kbQ.searchChunks).mockResolvedValue([])
    vi.mocked(ai.generateWithFallback).mockResolvedValue("ok")

    await service.testChat("a1", { messages: [{ role: "user", content: "tanya" }] })
    expect(kbQ.searchChunks).toHaveBeenCalledWith([0.5], { mode: "custom", documentIds: ["d1", "d2"] }, 5)
  })
})
