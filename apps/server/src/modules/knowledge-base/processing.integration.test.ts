import { describe, it, expect, beforeEach, vi } from "vitest"
import { resetDb, seedKbDocument } from "@/test/helpers"
import { db } from "@/lib/db"
import { kbDocuments } from "@/lib/schema"
import { eq, isNotNull } from "drizzle-orm"

vi.mock("@/lib/storage", () => ({ downloadFile: vi.fn().mockResolvedValue(Buffer.from("dummy")) }))
vi.mock("@/lib/extract", () => ({ extractText: vi.fn() }))
vi.mock("@/lib/ai", () => ({ embedTexts: vi.fn() }))

import { processDocument } from "./processing"
import { extractText } from "@/lib/extract"
import { embedTexts } from "@/lib/ai"

beforeEach(resetDb)

describe("processDocument (integration)", () => {
  it("extract → chunk → embed → simpan chunk + status completed", async () => {
    vi.mocked(extractText).mockResolvedValue("kalimat. ".repeat(800))
    vi.mocked(embedTexts).mockImplementation(async (texts) => texts.map(() => Array(768).fill(0.1)))

    const parent = await seedKbDocument({ title: "Doc", fileType: "txt", processingStatus: "pending" })
    await processDocument(parent.id, "kb/x/doc.txt")

    const [updated] = await db.select().from(kbDocuments).where(eq(kbDocuments.id, parent.id))
    expect(updated!.processingStatus).toBe("completed")
    expect(updated!.chunkCount).toBeGreaterThan(0)

    const chunks = await db.select().from(kbDocuments).where(isNotNull(kbDocuments.sourceDocumentId))
    expect(chunks.length).toBe(updated!.chunkCount)
    expect(chunks[0]!.embedding).not.toBeNull()
  })

  it("status failed bila ekstraksi melempar", async () => {
    vi.mocked(extractText).mockRejectedValue(new Error("rusak"))
    const parent = await seedKbDocument({ title: "Bad", fileType: "pdf", processingStatus: "pending" })

    await expect(processDocument(parent.id, "kb/x/bad.pdf")).rejects.toThrow()
    const [updated] = await db.select().from(kbDocuments).where(eq(kbDocuments.id, parent.id))
    expect(updated!.processingStatus).toBe("failed")
  })

  it("status failed bila dokumen kosong (tanpa teks)", async () => {
    vi.mocked(extractText).mockResolvedValue("   ")
    const parent = await seedKbDocument({ title: "Empty", fileType: "txt", processingStatus: "pending" })

    await expect(processDocument(parent.id, "kb/x/empty.txt")).rejects.toThrow()
    const [updated] = await db.select().from(kbDocuments).where(eq(kbDocuments.id, parent.id))
    expect(updated!.processingStatus).toBe("failed")
  })
})
