import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

const generateTextMock = vi.fn()
const embedMock = vi.fn()
const embedManyMock = vi.fn()

vi.mock("ai", () => ({
  generateText: (...args: unknown[]) => generateTextMock(...args),
  embed: (...args: unknown[]) => embedMock(...args),
  embedMany: (...args: unknown[]) => embedManyMock(...args),
}))
vi.mock("@ai-sdk/google", () => ({
  createGoogleGenerativeAI: () => Object.assign((m: string) => ({ id: m }), { textEmbeddingModel: (m: string) => ({ id: m }) }),
}))
vi.mock("@ai-sdk/openai", () => ({ createOpenAI: () => (m: string) => ({ id: m }) }))
vi.mock("@ai-sdk/openai-compatible", () => ({ createOpenAICompatible: () => (m: string) => ({ id: m }) }))

const selectChain = { from: vi.fn().mockReturnThis(), where: vi.fn().mockReturnThis(), orderBy: vi.fn() }
const providerRows: unknown[] = []
vi.mock("./db", () => ({
  db: { select: () => selectChain },
}))

import { generateWithFallback, generateEmbedding, embedTexts } from "./ai"

beforeEach(() => {
  vi.clearAllMocks()
  providerRows.length = 0
  selectChain.from.mockReturnThis()
  selectChain.where.mockReturnThis()
  selectChain.orderBy.mockImplementation(() => Promise.resolve(providerRows))
})

const ENV = { ...process.env }
afterEach(() => { process.env = { ...ENV } })

describe("generateWithFallback", () => {
  it("skip provider tanpa env key, pakai berikutnya", async () => {
    delete process.env.GEMINI_API_KEY
    process.env.OPENAI_API_KEY = "sk-test"
    providerRows.push(
      { name: "Gemini", model: "g", maxTokens: 100, temperature: 0.5, envKeyName: "GEMINI_API_KEY" },
      { name: "OpenAI", model: "o", maxTokens: 100, temperature: 0.5, envKeyName: "OPENAI_API_KEY" },
    )
    generateTextMock.mockResolvedValue({ text: "dari openai" })

    const result = await generateWithFallback({ systemPrompt: "s", messages: [{ role: "user", content: "hi" }] })
    expect(result).toBe("dari openai")
    expect(generateTextMock).toHaveBeenCalledTimes(1)
  })

  it("fallback ke provider berikutnya saat provider gagal", async () => {
    process.env.GEMINI_API_KEY = "k1"
    process.env.OPENAI_API_KEY = "k2"
    providerRows.push(
      { name: "Gemini", model: "g", maxTokens: 100, temperature: 0.5, envKeyName: "GEMINI_API_KEY" },
      { name: "OpenAI", model: "o", maxTokens: 100, temperature: 0.5, envKeyName: "OPENAI_API_KEY" },
    )
    generateTextMock.mockRejectedValueOnce(new Error("down")).mockResolvedValueOnce({ text: "ok2" })

    const result = await generateWithFallback({ systemPrompt: "s", messages: [{ role: "user", content: "hi" }] })
    expect(result).toBe("ok2")
    expect(generateTextMock).toHaveBeenCalledTimes(2)
  })

  it("mengembalikan fallback message bila semua gagal", async () => {
    process.env.GEMINI_API_KEY = "k1"
    providerRows.push({ name: "Gemini", model: "g", maxTokens: 100, temperature: 0.5, envKeyName: "GEMINI_API_KEY" })
    generateTextMock.mockRejectedValue(new Error("down"))

    const result = await generateWithFallback({ systemPrompt: "s", messages: [{ role: "user", content: "hi" }] })
    expect(result).toContain("Maaf")
  })
})

describe("embeddings", () => {
  it("generateEmbedding mengembalikan vektor", async () => {
    process.env.GEMINI_API_KEY = "k"
    embedMock.mockResolvedValue({ embedding: [0.1, 0.2, 0.3] })
    expect(await generateEmbedding("teks")).toEqual([0.1, 0.2, 0.3])
  })

  it("embedTexts kosong → array kosong tanpa panggil SDK", async () => {
    process.env.GEMINI_API_KEY = "k"
    expect(await embedTexts([])).toEqual([])
    expect(embedManyMock).not.toHaveBeenCalled()
  })

  it("generateEmbedding melempar bila tanpa GEMINI key", async () => {
    delete process.env.GEMINI_API_KEY
    await expect(generateEmbedding("x")).rejects.toThrow()
  })
})
