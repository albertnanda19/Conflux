import { describe, it, expect, vi, beforeEach } from "vitest"
import { ingestInbound } from "./ingest"
import * as contactQ from "@/modules/contacts/queries"
import * as convQ from "@/modules/conversations/queries"
import * as msgQ from "./queries"
import { publishRealtime } from "@/lib/pubsub"
import type { NormalizedInbound } from "@/modules/channels/adapter"

vi.mock("@/modules/contacts/queries", () => ({
  findContactByChannelIdentifier: vi.fn(),
  createContact: vi.fn(),
  createContactChannel: vi.fn(),
  createContactActivity: vi.fn(),
}))
vi.mock("@/modules/conversations/queries", () => ({
  findReusableConversation: vi.fn(),
  createConversation: vi.fn(),
  applyInbound: vi.fn(),
}))
vi.mock("./queries", () => ({ insertMessage: vi.fn() }))
vi.mock("@/lib/pubsub", () => ({ publishRealtime: vi.fn() }))
vi.mock("@/modules/notifications/services", () => ({
  notifyUsers: vi.fn(),
  resolveRecipients: vi.fn(async () => ["agent-x"]),
}))
vi.mock("@/modules/conversations/auto-assign", () => ({ autoAssign: vi.fn(async () => null) }))

const inbound: NormalizedInbound = {
  channelType: "whatsapp",
  channelIdentifier: "+6281",
  contactName: "Lead Baru",
  contentType: "text",
  content: { text: "halo daftar" },
  externalMessageId: "sim_x",
}

beforeEach(() => vi.clearAllMocks())

describe("ingestInbound — new contact", () => {
  it("creates contact, channel, activity, conversation, message and emits realtime", async () => {
    vi.mocked(contactQ.findContactByChannelIdentifier).mockResolvedValue(null)
    vi.mocked(contactQ.createContact).mockResolvedValue({ id: "ct1" } as never)
    vi.mocked(convQ.findReusableConversation).mockResolvedValue(null as never)
    vi.mocked(convQ.createConversation).mockResolvedValue({ id: "cv1", agentId: null, status: "open" } as never)
    vi.mocked(msgQ.insertMessage).mockResolvedValue({ id: "m1", createdAt: new Date("2026-01-01") } as never)

    const result = await ingestInbound("ch1", inbound)

    expect(result).toMatchObject({ contactId: "ct1", conversationId: "cv1", messageId: "m1", isNewContact: true, isNewConversation: true })
    expect(contactQ.createContact).toHaveBeenCalledWith(expect.objectContaining({ pipelineStatus: "new_lead", phoneNumber: "+6281", source: "whatsapp" }))
    expect(contactQ.createContactChannel).toHaveBeenCalled()
    expect(contactQ.createContactActivity).toHaveBeenCalled()
    expect(convQ.applyInbound).toHaveBeenCalledWith("cv1", "halo daftar", expect.any(Date), false)
    expect(vi.mocked(publishRealtime).mock.calls.map((c) => c[0].type)).toEqual(["message:new", "conversation:updated"])
  })
})

describe("ingestInbound — existing contact (dedup)", () => {
  it("reuses contact + conversation and reopens snoozed", async () => {
    vi.mocked(contactQ.findContactByChannelIdentifier).mockResolvedValue("ct-existing")
    vi.mocked(convQ.findReusableConversation).mockResolvedValue({ id: "cv-existing", agentId: "ag1", status: "snoozed" } as never)
    vi.mocked(msgQ.insertMessage).mockResolvedValue({ id: "m2", createdAt: new Date("2026-01-02") } as never)

    const result = await ingestInbound("ch1", inbound)

    expect(result).toMatchObject({ contactId: "ct-existing", conversationId: "cv-existing", isNewContact: false, isNewConversation: false })
    expect(contactQ.createContact).not.toHaveBeenCalled()
    expect(convQ.createConversation).not.toHaveBeenCalled()
    expect(convQ.applyInbound).toHaveBeenCalledWith("cv-existing", "halo daftar", expect.any(Date), true)
  })
})
