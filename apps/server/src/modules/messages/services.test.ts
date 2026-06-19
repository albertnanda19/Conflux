import { describe, it, expect, vi, beforeEach } from "vitest"
import { previewFromContent, listMessages, sendMessage } from "./services"
import * as q from "./queries"
import { publishRealtime } from "@/lib/pubsub"
import { NotFoundError } from "@/lib/errors"

vi.mock("./queries", () => ({
  listMessages: vi.fn(),
  getAgentNames: vi.fn(),
  getConversationWithChannel: vi.fn(),
  getContactChannelIdentifier: vi.fn(),
  insertMessage: vi.fn(),
  setMessageDelivery: vi.fn(),
  updateConversationAfterMessage: vi.fn(),
}))
vi.mock("@/lib/pubsub", () => ({ publishRealtime: vi.fn() }))

const agent = { sub: "agent-1", email: "a@test.com", role: "agent" }

beforeEach(() => vi.clearAllMocks())

describe("previewFromContent", () => {
  it("returns text for text type", () => {
    expect(previewFromContent("text", { text: "halo" })).toBe("halo")
  })
  it("returns label for document without caption", () => {
    expect(previewFromContent("document", { fileName: "a.pdf" })).toBe("📎 Dokumen")
  })
  it("prefers caption text when present", () => {
    expect(previewFromContent("image", { text: "lihat ini", mediaUrl: "x" })).toBe("lihat ini")
  })
  it("labels location", () => {
    expect(previewFromContent("location", { location: { lat: 1, lng: 2 } })).toBe("📍 Lokasi")
  })
})

describe("listMessages", () => {
  it("reverses rows to ascending and resolves agent senderName", async () => {
    vi.mocked(q.listMessages).mockResolvedValue([
      { id: "m2", conversationId: "c1", direction: "outbound", senderType: "agent", senderId: "agent-1", contentType: "text", content: { text: "kedua" }, status: "sent", createdAt: new Date("2026-01-02") },
      { id: "m1", conversationId: "c1", direction: "inbound", senderType: "contact", senderId: "ct1", contentType: "text", content: { text: "pertama" }, status: "read", createdAt: new Date("2026-01-01") },
    ] as never)
    vi.mocked(q.getAgentNames).mockResolvedValue(new Map([["agent-1", "Sari Dewi"]]))

    const result = await listMessages("c1", 30)
    expect(result.data.map((m) => m.id)).toEqual(["m1", "m2"])
    expect(result.data[1]!.senderName).toBe("Sari Dewi")
    expect(result.data[0]!.senderName).toBeUndefined()
    expect(result.nextCursor).toBeNull()
  })

  it("sets nextCursor when page is full", async () => {
    const rows = Array.from({ length: 2 }, (_, i) => ({
      id: `m${i}`, conversationId: "c1", direction: "inbound", senderType: "contact", senderId: "ct1",
      contentType: "text", content: { text: "x" }, status: "read", createdAt: new Date(2026, 0, i + 1),
    }))
    vi.mocked(q.listMessages).mockResolvedValue(rows as never)
    vi.mocked(q.getAgentNames).mockResolvedValue(new Map())
    const result = await listMessages("c1", 2)
    expect(result.nextCursor).toBe(rows[rows.length - 1]!.createdAt.toISOString())
  })
})

describe("sendMessage", () => {
  it("throws NotFound when conversation missing", async () => {
    vi.mocked(q.getConversationWithChannel).mockResolvedValue(null as never)
    await expect(sendMessage("c1", { contentType: "text", content: { text: "hi" } }, agent as never)).rejects.toBeInstanceOf(NotFoundError)
  })

  it("inserts, sends via simulator, updates conversation, publishes events", async () => {
    vi.mocked(q.getConversationWithChannel).mockResolvedValue({
      id: "c1", contactId: "ct1", channelId: "ch1", agentId: null, status: "open", channelType: "whatsapp", provider: "simulator", credentials: null,
    } as never)
    vi.mocked(q.insertMessage).mockResolvedValue({
      id: "m1", conversationId: "c1", direction: "outbound", senderType: "agent", senderId: "agent-1",
      contentType: "text", content: { text: "halo balasan" }, status: "sent", createdAt: new Date("2026-01-01"),
    } as never)
    vi.mocked(q.getContactChannelIdentifier).mockResolvedValue("tg-chat-123")
    vi.mocked(q.getAgentNames).mockResolvedValue(new Map([["agent-1", "Sari Dewi"]]))

    const msg = await sendMessage("c1", { contentType: "text", content: { text: "halo balasan" } }, agent as never)

    expect(q.getContactChannelIdentifier).toHaveBeenCalledWith("ct1", "whatsapp")

    expect(msg.content).toBe("halo balasan")
    expect(msg.senderType).toBe("agent")
    expect(msg.senderName).toBe("Sari Dewi")
    expect(q.setMessageDelivery).toHaveBeenCalledWith("m1", expect.stringMatching(/^sim_/), "sent")
    expect(msg.status).toBe("sent")
    expect(q.updateConversationAfterMessage).toHaveBeenCalledWith("c1", expect.objectContaining({ lastMessagePreview: "halo balasan", isAiHandling: false }))
    expect(vi.mocked(publishRealtime).mock.calls.map((c) => c[0].type)).toEqual(["message:new", "conversation:updated"])
  })
})
