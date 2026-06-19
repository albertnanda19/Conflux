import { describe, it, expect, beforeEach } from "vitest"
import { resetDb, apiRequest, token, seedUser, seedAssistant, seedKbDocument } from "@/test/helpers"
import { db } from "@/lib/db"
import { kbDocuments } from "@/lib/schema"
import { eq } from "drizzle-orm"

beforeEach(resetDb)

async function userToken() {
  const u = await seedUser({ role: "agent" })
  return token({ sub: u.id, email: u.email, role: "agent" })
}

describe("Knowledge Base handlers (integration)", () => {
  it("401 tanpa token", async () => {
    const res = await apiRequest("GET", "/knowledge-base")
    expect(res.status).toBe(401)
  })

  it("list hanya parent docs (chunk dikecualikan) + filter category/status/scope", async () => {
    const t = await userToken()
    const a = await seedAssistant({ name: "A" })
    const parent = await seedKbDocument({ title: "Harga", category: "Harga", processingStatus: "completed", fileType: "pdf" })
    await seedKbDocument({ title: "Harga", category: "Harga", sourceDocumentId: parent.id, chunkIndex: 0, content: "isi" })
    await seedKbDocument({ title: "Jadwal", category: "Jadwal", processingStatus: "pending", fileType: "txt" })
    await seedKbDocument({ title: "Promo Khusus", category: "Harga", aiAssistantId: a.id, processingStatus: "completed", fileType: "pdf" })

    const all = await apiRequest("GET", "/knowledge-base", { token: t })
    expect((all.body!.data as { data: unknown[] }).data.length).toBe(3)

    const harga = await apiRequest("GET", "/knowledge-base?category=Harga", { token: t })
    expect((harga.body!.data as { data: unknown[] }).data.length).toBe(2)

    const global = await apiRequest("GET", "/knowledge-base?scope=global", { token: t })
    expect((global.body!.data as { data: unknown[] }).data.length).toBe(2)

    const perAssistant = await apiRequest("GET", `/knowledge-base?aiAssistantId=${a.id}`, { token: t })
    expect((perAssistant.body!.data as { data: unknown[] }).data.length).toBe(1)

    const pending = await apiRequest("GET", "/knowledge-base?status=pending", { token: t })
    expect((pending.body!.data as { data: unknown[] }).data.length).toBe(1)
  })

  it("patch memperbarui title/isActive + propagasi isActive ke chunk", async () => {
    const t = await userToken()
    const parent = await seedKbDocument({ title: "Lama", processingStatus: "completed", isActive: true })
    await seedKbDocument({ title: "Lama", sourceDocumentId: parent.id, chunkIndex: 0, isActive: true })

    const res = await apiRequest("PATCH", `/knowledge-base/${parent.id}`, { token: t, body: { title: "Baru", isActive: false } })
    expect((res.body!.data as { title: string }).title).toBe("Baru")

    const chunks = await db.select().from(kbDocuments).where(eq(kbDocuments.sourceDocumentId, parent.id))
    expect(chunks.every((c) => c.isActive === false)).toBe(true)
  })

  it("delete menghapus parent + chunk (cascade)", async () => {
    const t = await userToken()
    const parent = await seedKbDocument({ title: "Doc", processingStatus: "completed" })
    await seedKbDocument({ title: "Doc", sourceDocumentId: parent.id, chunkIndex: 0 })

    const res = await apiRequest("DELETE", `/knowledge-base/${parent.id}`, { token: t })
    expect(res.status).toBe(200)
    const remaining = await db.select().from(kbDocuments)
    expect(remaining.length).toBe(0)
  })

  it("404 untuk dokumen tidak ada", async () => {
    const t = await userToken()
    const res = await apiRequest("GET", "/knowledge-base/00000000-0000-0000-0000-000000000000", { token: t })
    expect(res.status).toBe(404)
  })
})
