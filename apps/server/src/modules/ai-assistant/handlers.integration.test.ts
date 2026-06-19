import { describe, it, expect, beforeEach, vi } from "vitest"
import { resetDb, apiRequest, token, seedUser, seedAssistant } from "@/test/helpers"

vi.mock("@/lib/ai", () => ({
  generateWithFallback: vi.fn().mockResolvedValue("Jawaban AI uji."),
  generateEmbedding: vi.fn().mockResolvedValue([0.1, 0.2, 0.3]),
  embedTexts: vi.fn().mockResolvedValue([]),
}))

beforeEach(resetDb)

async function adminToken() {
  const admin = await seedUser({ role: "super_admin", email: `admin${Math.random()}@test.com` })
  return token({ sub: admin.id, email: admin.email, role: "super_admin" })
}

describe("AI Assistant handlers (integration)", () => {
  it("401 tanpa token", async () => {
    const res = await apiRequest("GET", "/ai-assistants")
    expect(res.status).toBe(401)
  })

  it("CRUD penuh + filter", async () => {
    const t = await adminToken()
    const create = await apiRequest("POST", "/ai-assistants", { token: t, body: { name: "Bot Sales", personaTone: "casual", status: "active" } })
    expect(create.status).toBe(200)
    const id = (create.body!.data as { id: string }).id

    const list = await apiRequest("GET", "/ai-assistants?search=Sales&status=active", { token: t })
    const data = (list.body!.data as { data: unknown[] }).data
    expect(data.length).toBe(1)

    const update = await apiRequest("PUT", `/ai-assistants/${id}`, { token: t, body: { personaName: "Sari" } })
    expect((update.body!.data as { personaName: string }).personaName).toBe("Sari")

    const status = await apiRequest("PATCH", `/ai-assistants/${id}/status`, { token: t })
    expect((status.body!.data as { status: string }).status).toBe("paused")

    const del = await apiRequest("DELETE", `/ai-assistants/${id}`, { token: t })
    expect(del.status).toBe(200)
    const after = await apiRequest("GET", `/ai-assistants/${id}`, { token: t })
    expect(after.status).toBe(404)
  })

  it("agent biasa tidak boleh create (403)", async () => {
    const agent = await seedUser({ role: "agent" })
    const t = await token({ sub: agent.id, email: agent.email, role: "agent" })
    const res = await apiRequest("POST", "/ai-assistants", { token: t, body: { name: "X" } })
    expect(res.status).toBe(403)
  })

  it("assign 1:1 — reassign agen memindahkan dari assistant lama", async () => {
    const t = await adminToken()
    const agent = await seedUser({ role: "agent" })
    const a1 = await seedAssistant({ name: "A1" })
    const a2 = await seedAssistant({ name: "A2" })

    await apiRequest("POST", `/ai-assistants/${a1.id}/assign`, { token: t, body: { agentId: agent.id } })
    const r2 = await apiRequest("POST", `/ai-assistants/${a2.id}/assign`, { token: t, body: { agentId: agent.id } })
    expect(r2.status).toBe(200)

    const get1 = await apiRequest("GET", `/ai-assistants/${a1.id}`, { token: t })
    const get2 = await apiRequest("GET", `/ai-assistants/${a2.id}`, { token: t })
    expect((get1.body!.data as { assignedAgentId: string | null }).assignedAgentId).toBeNull()
    expect((get2.body!.data as { assignedAgentId: string | null }).assignedAgentId).toBe(agent.id)
  })

  it("test-chat mengembalikan response + handoffDetected", async () => {
    const t = await adminToken()
    const a = await seedAssistant({ name: "Bot", handoffConfig: { triggerKeywords: ["daftar"] } })
    const res = await apiRequest("POST", `/ai-assistants/${a.id}/test-chat`, {
      token: t,
      body: { messages: [{ role: "user", content: "saya mau daftar" }] },
    })
    expect(res.status).toBe(200)
    const data = res.body!.data as { response: string; handoffDetected: boolean }
    expect(data.response).toBe("Jawaban AI uji.")
    expect(data.handoffDetected).toBe(true)
  })
})
