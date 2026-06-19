import { describe, it, expect, beforeEach, vi } from "vitest"
import { resetDb, seedUser, seedChannel, seedContact, seedConversation, seedAssistant, seedAiSettings } from "@/test/helpers"
import { db } from "@/lib/db"
import { messages, conversations, contactActivities } from "@/lib/schema"
import { eq, and } from "drizzle-orm"

vi.mock("@/modules/ai-assistant/services", async (orig) => {
  const actual = await orig<typeof import("@/modules/ai-assistant/services")>()
  return { ...actual, generateRagReply: vi.fn().mockResolvedValue("Jawaban AI dari KB.") }
})
vi.mock("@/modules/channels/registry", () => ({
  getAdapter: () => ({ sendMessage: vi.fn().mockResolvedValue({ externalMessageId: "ext-ai-1" }) }),
}))

import { maybeAutoReply } from "./ai-reply"
import { generateRagReply } from "@/modules/ai-assistant/services"

beforeEach(resetDb)

async function outboundAiMessages(conversationId: string) {
  return db.select().from(messages).where(and(eq(messages.conversationId, conversationId), eq(messages.senderType, "ai")))
}

async function seedInbound(conversationId: string, contactId: string, text: string) {
  await db.insert(messages).values({
    conversationId, direction: "inbound", senderType: "contact", senderId: contactId,
    contentType: "text", content: { text }, status: "delivered",
  })
}

describe("maybeAutoReply (integration)", () => {
  it("AI balas saat tak ada agen + assistant default aktif", async () => {
    await seedAiSettings({ aiEnabled: true })
    await seedAssistant({ name: "Default", isDefault: true, status: "active", kbScope: "global", handoffConfig: { triggerKeywords: ["daftar"] } })
    const ch = await seedChannel({ provider: "whatsapp_fonnte" })
    const ct = await seedContact()
    const conv = await seedConversation(ct.id, ch.id, { status: "open" })
    await seedInbound(conv.id, ct.id, "halo, info program?")

    await maybeAutoReply(conv.id, "halo, info program?", "Lead A")

    const out = await outboundAiMessages(conv.id)
    expect(out.length).toBe(1)
    expect((out[0]!.content as { text: string }).text).toBe("Jawaban AI dari KB.")
    const [c] = await db.select().from(conversations).where(eq(conversations.id, conv.id))
    expect(c!.isAiHandling).toBe(true)
  })

  it("handoff: keyword konversi → kirim pesan handoff + assign agen online + activity", async () => {
    await seedAiSettings({ aiEnabled: true })
    await seedAssistant({ name: "Default", isDefault: true, status: "active", handoffConfig: { triggerKeywords: ["daftar"], handoffMessage: "Saya hubungkan ke tim." } })
    const agent = await seedUser({ role: "agent", status: "online", fullName: "Agen Online" })
    const ch = await seedChannel({ provider: "whatsapp_fonnte" })
    const ct = await seedContact()
    const conv = await seedConversation(ct.id, ch.id, { status: "open" })

    await maybeAutoReply(conv.id, "saya mau daftar", "Lead B")

    const out = await outboundAiMessages(conv.id)
    expect((out[0]!.content as { text: string }).text).toBe("Saya hubungkan ke tim.")
    const [c] = await db.select().from(conversations).where(eq(conversations.id, conv.id))
    expect(c!.agentId).toBe(agent.id)
    expect(c!.isAiHandling).toBe(false)
    const acts = await db.select().from(contactActivities).where(eq(contactActivities.contactId, ct.id))
    expect(acts.some((a) => a.type === "ai_handoff")).toBe(true)
  })

  it("skip bila percakapan sudah dipegang agen online", async () => {
    await seedAiSettings({ aiEnabled: true })
    await seedAssistant({ name: "Default", isDefault: true, status: "active" })
    const agent = await seedUser({ role: "agent", status: "online" })
    const ch = await seedChannel({ provider: "whatsapp_fonnte" })
    const ct = await seedContact()
    const conv = await seedConversation(ct.id, ch.id, { status: "open", agentId: agent.id })

    await maybeAutoReply(conv.id, "halo", "Lead C")
    expect((await outboundAiMessages(conv.id)).length).toBe(0)
  })

  it("di luar jam kerja → kirim pesan OOO (bukan RAG)", async () => {
    await seedAiSettings({ aiEnabled: true })
    const closedHours = {
      timezone: "Asia/Jakarta",
      days: [{ day: "monday", dayLabel: "Senin", enabled: false, start: "08:00", end: "17:00" }],
      oooMessage: "Kami sedang tutup.",
    }
    await seedAssistant({ name: "Default", isDefault: true, status: "active", workingHours: closedHours })
    const ch = await seedChannel({ provider: "whatsapp_fonnte" })
    const ct = await seedContact()
    const conv = await seedConversation(ct.id, ch.id, { status: "open" })
    await seedInbound(conv.id, ct.id, "halo")

    await maybeAutoReply(conv.id, "halo", "Lead F")
    const out = await outboundAiMessages(conv.id)
    expect(out.length).toBe(1)
    expect((out[0]!.content as { text: string }).text).toBe("Kami sedang tutup.")
  })

  it("threshold maxAiMessages tercapai → handoff walau tanpa keyword", async () => {
    await seedAiSettings({ aiEnabled: true })
    await seedAssistant({ name: "Default", isDefault: true, status: "active", handoffConfig: { triggerKeywords: [], maxAiMessages: 2, handoffMessage: "Diserahkan ke tim." } })
    await seedUser({ role: "agent", status: "online" })
    const ch = await seedChannel({ provider: "whatsapp_fonnte" })
    const ct = await seedContact()
    const conv = await seedConversation(ct.id, ch.id, { status: "open" })
    await seedInbound(conv.id, ct.id, "tanya biasa")
    // 2 pesan AI sebelumnya → sudah capai threshold
    await db.insert(messages).values([
      { conversationId: conv.id, direction: "outbound", senderType: "ai", contentType: "text", content: { text: "a" }, status: "sent" },
      { conversationId: conv.id, direction: "outbound", senderType: "ai", contentType: "text", content: { text: "b" }, status: "sent" },
    ])

    await maybeAutoReply(conv.id, "pertanyaan lanjutan", "Lead G")
    const [c] = await db.select().from(conversations).where(eq(conversations.id, conv.id))
    expect(c!.agentId).not.toBeNull()
    const acts = await db.select().from(contactActivities).where(eq(contactActivities.contactId, ct.id))
    expect(acts.some((a) => a.type === "ai_handoff")).toBe(true)
  })

  it("manual override: AI tetap balas walau agen online (isAiHandling+aiAssistantId)", async () => {
    await seedAiSettings({ aiEnabled: true })
    const assistant = await seedAssistant({ name: "Manual", status: "active", handoffConfig: { triggerKeywords: [] } })
    const agent = await seedUser({ role: "agent", status: "online" })
    const ch = await seedChannel({ provider: "whatsapp_fonnte" })
    const ct = await seedContact()
    const conv = await seedConversation(ct.id, ch.id, { status: "open", agentId: agent.id, isAiHandling: true, aiAssistantId: assistant.id })
    await seedInbound(conv.id, ct.id, "halo")

    await maybeAutoReply(conv.id, "halo", "Lead H")
    expect((await outboundAiMessages(conv.id)).length).toBe(1)
  })

  it("manual override: di luar jam kerja tetap RAG (bukan OOO)", async () => {
    await seedAiSettings({ aiEnabled: true })
    const closed = { timezone: "Asia/Jakarta", days: [{ day: "monday", dayLabel: "Senin", enabled: false, start: "08:00", end: "17:00" }], oooMessage: "Tutup." }
    const assistant = await seedAssistant({ name: "Manual2", status: "active", workingHours: closed, handoffConfig: { triggerKeywords: [] } })
    const ch = await seedChannel({ provider: "whatsapp_fonnte" })
    const ct = await seedContact()
    const conv = await seedConversation(ct.id, ch.id, { status: "open", isAiHandling: true, aiAssistantId: assistant.id })
    await seedInbound(conv.id, ct.id, "halo")

    await maybeAutoReply(conv.id, "halo", "Lead I")
    const out = await outboundAiMessages(conv.id)
    expect((out[0]!.content as { text: string }).text).toBe("Jawaban AI dari KB.")
  })

  it("skip bila aiEnabled false", async () => {
    await seedAiSettings({ aiEnabled: false })
    await seedAssistant({ name: "Default", isDefault: true, status: "active" })
    const ch = await seedChannel({ provider: "whatsapp_fonnte" })
    const ct = await seedContact()
    const conv = await seedConversation(ct.id, ch.id, { status: "open" })

    await maybeAutoReply(conv.id, "halo", "Lead D")
    expect((await outboundAiMessages(conv.id)).length).toBe(0)
  })

  it("history membuang pesan system sebelum dikirim ke RAG", async () => {
    await seedAiSettings({ aiEnabled: true })
    await seedAssistant({ name: "Default", isDefault: true, status: "active", handoffConfig: { triggerKeywords: [] } })
    const ch = await seedChannel({ provider: "whatsapp_fonnte" })
    const ct = await seedContact()
    const conv = await seedConversation(ct.id, ch.id, { status: "open" })
    await seedInbound(conv.id, ct.id, "halo")
    await db.insert(messages).values({
      conversationId: conv.id, direction: "outbound", senderType: "system",
      contentType: "text", content: { text: "Percakapan ditransfer ke agen." }, status: "delivered",
    })

    await maybeAutoReply(conv.id, "halo", "Lead J")

    expect(generateRagReply).toHaveBeenCalled()
    const passedHistory = vi.mocked(generateRagReply).mock.calls[0]![1]
    expect(passedHistory.some((m) => m.content.includes("ditransfer"))).toBe(false)
  })

  it("AI tetap balas saat agen ter-assign tapi offline (pakai assistant agen)", async () => {
    await seedAiSettings({ aiEnabled: true })
    const agent = await seedUser({ role: "agent", status: "offline" })
    await seedAssistant({ name: "Asisten Agen", status: "active", assignedAgentId: agent.id, handoffConfig: { triggerKeywords: [] } })
    const ch = await seedChannel({ provider: "whatsapp_fonnte" })
    const ct = await seedContact()
    const conv = await seedConversation(ct.id, ch.id, { status: "open", agentId: agent.id })
    await seedInbound(conv.id, ct.id, "halo")

    await maybeAutoReply(conv.id, "halo", "Lead E")
    expect((await outboundAiMessages(conv.id)).length).toBe(1)
  })
})
