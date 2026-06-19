import { describe, it, expect, vi, beforeEach } from "vitest"
import { listConversations, getConversationDetail, changeStatus, assignConversation } from "./services"
import * as q from "./queries"
import * as labelQ from "@/modules/labels/queries"
import * as contactQ from "@/modules/contacts/queries"
import { publishRealtime } from "@/lib/pubsub"
import { NotFoundError } from "@/lib/errors"

vi.mock("./queries", () => ({
  listConversations: vi.fn(),
  findConversationDetail: vi.fn(),
  updateStatus: vi.fn(),
  assignAgent: vi.fn(),
  markRead: vi.fn(),
}))
vi.mock("@/modules/labels/queries", () => ({
  listLabelsForConversations: vi.fn(),
  findLabelById: vi.fn(),
  attachLabel: vi.fn(),
  detachLabel: vi.fn(),
}))
vi.mock("@/modules/contacts/queries", () => ({
  findContactChannels: vi.fn(),
  createContactActivity: vi.fn(),
}))
vi.mock("@/modules/users/queries", () => ({ listAgents: vi.fn() }))
vi.mock("@/modules/notifications/services", () => ({ notifyUsers: vi.fn(), resolveRecipients: vi.fn() }))
vi.mock("@/lib/pubsub", () => ({ publishRealtime: vi.fn() }))

function row(over: Record<string, unknown> = {}) {
  return {
    id: "cv1", contactId: "ct1", status: "open", priority: "high", isAiHandling: true, unreadCount: 2,
    lastMessagePreview: "halo", lastMessageAt: new Date("2026-01-01"), channelType: "whatsapp",
    agentId: null, agentName: null, agentStatus: null,
    contactName: "Rina", contactAvatar: null, contactPhone: "+62", contactEmail: null,
    contactSource: "whatsapp", contactPipelineStatus: "qualified", ...over,
  }
}

beforeEach(() => vi.clearAllMocks())

describe("listConversations", () => {
  it("maps rows + groups batched labels + pagination meta", async () => {
    vi.mocked(q.listConversations).mockResolvedValue({ data: [row()], total: 1 } as never)
    vi.mocked(labelQ.listLabelsForConversations).mockResolvedValue([
      { conversationId: "cv1", id: "l1", name: "DS", color: "#000" },
    ] as never)

    const result = await listConversations({ page: 1, limit: 20, sortBy: "newest" } as never)
    expect(result.meta).toEqual({ total: 1, page: 1, limit: 20, totalPages: 1 })
    const c = result.data[0]!
    expect(c.channel).toBe("whatsapp")
    expect(c.lastMessage).toBe("halo")
    expect(c.labels).toEqual([{ id: "l1", name: "DS", color: "#000" }])
    expect(c.assignedAgent).toBeUndefined()
    expect(c.contact.name).toBe("Rina")
  })

  it("embeds assigned agent with initials", async () => {
    vi.mocked(q.listConversations).mockResolvedValue({
      data: [row({ agentId: "ag1", agentName: "Sari Dewi", agentStatus: "online" })], total: 1,
    } as never)
    vi.mocked(labelQ.listLabelsForConversations).mockResolvedValue([] as never)
    const result = await listConversations({ page: 1, limit: 20, sortBy: "newest" } as never)
    expect(result.data[0]!.assignedAgent).toEqual({ id: "ag1", name: "Sari Dewi", initials: "SD", status: "online", activeConversationCount: 0 })
  })
})

describe("getConversationDetail", () => {
  it("throws NotFound when missing", async () => {
    vi.mocked(q.findConversationDetail).mockResolvedValue(null as never)
    await expect(getConversationDetail("x")).rejects.toBeInstanceOf(NotFoundError)
  })

  it("includes contact channelIdentifiers", async () => {
    vi.mocked(q.findConversationDetail).mockResolvedValue(row() as never)
    vi.mocked(labelQ.listLabelsForConversations).mockResolvedValue([] as never)
    vi.mocked(contactQ.findContactChannels).mockResolvedValue([
      { channelType: "whatsapp", channelIdentifier: "+62" },
    ] as never)
    const detail = await getConversationDetail("cv1")
    expect(detail.contact.channelIdentifiers).toEqual([{ channel: "whatsapp", identifier: "+62" }])
  })
})

describe("changeStatus", () => {
  it("throws NotFound when update returns null", async () => {
    vi.mocked(q.updateStatus).mockResolvedValue(null as never)
    await expect(changeStatus("x", "resolved")).rejects.toBeInstanceOf(NotFoundError)
  })

  it("emits conversation:updated", async () => {
    vi.mocked(q.updateStatus).mockResolvedValue({ id: "cv1", status: "resolved" } as never)
    await changeStatus("cv1", "resolved")
    expect(vi.mocked(publishRealtime).mock.calls[0]![0].type).toBe("conversation:updated")
  })
})

describe("assignConversation", () => {
  it("logs activity + emits assigned & updated when agent set", async () => {
    vi.mocked(q.findConversationDetail).mockResolvedValue(row() as never)
    vi.mocked(q.assignAgent).mockResolvedValue({ id: "cv1", agentId: "ag1" } as never)
    await assignConversation("cv1", "ag1")
    expect(contactQ.createContactActivity).toHaveBeenCalledWith(expect.objectContaining({ type: "assignment", agentId: "ag1" }))
    const types = vi.mocked(publishRealtime).mock.calls.map((c) => c[0].type)
    expect(types).toContain("conversation:assigned")
    expect(types).toContain("conversation:updated")
  })

  it("skips activity when unassigning", async () => {
    vi.mocked(q.findConversationDetail).mockResolvedValue(row() as never)
    vi.mocked(q.assignAgent).mockResolvedValue({ id: "cv1", agentId: null } as never)
    await assignConversation("cv1", null)
    expect(contactQ.createContactActivity).not.toHaveBeenCalled()
  })
})
