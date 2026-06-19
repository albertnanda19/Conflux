import { describe, it, expect, beforeEach, vi } from "vitest"
import { resetDb, apiRequest, token, seedUser, seedChannel, seedContact, seedConversation, seedLabel, seedAssistant } from "@/test/helpers"
import { db } from "@/lib/db"
import { conversations, contactActivities } from "@/lib/schema"
import { eq } from "drizzle-orm"

vi.mock("@/modules/ai-assistant/services", async (orig) => {
  const actual = await orig<typeof import("@/modules/ai-assistant/services")>()
  return { ...actual, generateRagReply: vi.fn().mockResolvedValue("Halo dari AI.") }
})
vi.mock("@/modules/channels/registry", () => ({
  getAdapter: () => ({ sendMessage: vi.fn().mockResolvedValue({ externalMessageId: "ext-1" }) }),
}))

let agentToken: string

beforeEach(async () => {
  await resetDb()
  const u = await seedUser()
  agentToken = await token({ sub: u.id, email: u.email, role: u.role })
})

async function seedConv(over = {}) {
  const ch = await seedChannel()
  const ct = await seedContact()
  return seedConversation(ct.id, ch.id, over)
}

describe("conversations handlers (integration)", () => {
  it("401 without token", async () => {
    const r = await apiRequest("GET", "/conversations")
    expect(r.status).toBe(401)
  })

  it("200 empty list", async () => {
    const r = await apiRequest("GET", "/conversations", { token: agentToken })
    expect(r.status).toBe(200)
    expect((r.body!.data as { meta: { total: number } }).meta.total).toBe(0)
  })

  it("lists seeded conversation with joined contact + channel", async () => {
    await seedConv({ lastMessagePreview: "hai", priority: "high" })
    const r = await apiRequest("GET", "/conversations", { token: agentToken })
    const data = (r.body!.data as { data: Array<{ channel: string; contact: { name: string }; lastMessage: string }> }).data
    expect(data).toHaveLength(1)
    expect(data[0]!.channel).toBe("whatsapp")
    expect(data[0]!.contact.name).toBe("Test Lead")
    expect(data[0]!.lastMessage).toBe("hai")
  })

  it("filters by contactId", async () => {
    const ch = await seedChannel()
    const ctA = await seedContact({ fullName: "Lead A" })
    const ctB = await seedContact({ fullName: "Lead B" })
    await seedConversation(ctA.id, ch.id)
    await seedConversation(ctB.id, ch.id)
    const r = await apiRequest("GET", `/conversations?contactId=${ctA.id}`, { token: agentToken })
    const data = (r.body!.data as { data: Array<{ contactId: string }> }).data
    expect(data).toHaveLength(1)
    expect(data[0]!.contactId).toBe(ctA.id)
  })

  it("404 detail for unknown id", async () => {
    const r = await apiRequest("GET", "/conversations/11111111-1111-1111-1111-111111111111", { token: agentToken })
    expect(r.status).toBe(404)
  })

  it("PATCH status 200, invalid status 422", async () => {
    const cv = await seedConv()
    const ok = await apiRequest("PATCH", `/conversations/${cv.id}/status`, { token: agentToken, body: { status: "resolved" } })
    expect(ok.status).toBe(200)
    const bad = await apiRequest("PATCH", `/conversations/${cv.id}/status`, { token: agentToken, body: { status: "bogus" } })
    expect(bad.status).toBe(422)
    expect(bad.body!.errors).toBeDefined()
  })

  it("mark read resets unreadCount", async () => {
    const cv = await seedConv({ unreadCount: 5 })
    const r = await apiRequest("POST", `/conversations/${cv.id}/read`, { token: agentToken })
    expect((r.body!.data as { unreadCount: number }).unreadCount).toBe(0)
  })

  it("add label then detail shows it", async () => {
    const cv = await seedConv()
    const label = await seedLabel()
    const add = await apiRequest("POST", `/conversations/${cv.id}/labels`, { token: agentToken, body: { labelId: label.id } })
    expect(add.status).toBe(200)
    const detail = await apiRequest("GET", `/conversations/${cv.id}`, { token: agentToken })
    expect((detail.body!.data as { labels: unknown[] }).labels).toHaveLength(1)
  })

  it("assign-ai: set aiAssistantId + isAiHandling, activity ai_assigned, AI balas", async () => {
    const assistant = await seedAssistant({ name: "Bot", status: "active", handoffConfig: { triggerKeywords: [] } })
    const cv = await seedConv()
    const r = await apiRequest("POST", `/conversations/${cv.id}/assign-ai`, { token: agentToken, body: { aiAssistantId: assistant.id } })
    expect(r.status).toBe(200)
    const [c] = await db.select().from(conversations).where(eq(conversations.id, cv.id))
    expect(c!.aiAssistantId).toBe(assistant.id)
    expect(c!.isAiHandling).toBe(true)
    const acts = await db.select().from(contactActivities).where(eq(contactActivities.contactId, cv.contactId))
    expect(acts.some((a) => a.type === "ai_assigned")).toBe(true)
  })

  it("assign-ai: 400 bila assistant tidak aktif", async () => {
    const assistant = await seedAssistant({ name: "Draft", status: "draft" })
    const cv = await seedConv()
    const r = await apiRequest("POST", `/conversations/${cv.id}/assign-ai`, { token: agentToken, body: { aiAssistantId: assistant.id } })
    expect(r.status).toBe(400)
  })

  it("deactivate-ai: reset aiAssistantId + isAiHandling", async () => {
    const assistant = await seedAssistant({ name: "Bot", status: "active" })
    const ch = await seedChannel()
    const ct = await seedContact()
    const cv = await seedConversation(ct.id, ch.id, { isAiHandling: true, aiAssistantId: assistant.id })
    const r = await apiRequest("POST", `/conversations/${cv.id}/deactivate-ai`, { token: agentToken })
    expect(r.status).toBe(200)
    const [c] = await db.select().from(conversations).where(eq(conversations.id, cv.id))
    expect(c!.aiAssistantId).toBeNull()
    expect(c!.isAiHandling).toBe(false)
  })
})
