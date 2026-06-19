import { describe, it, expect, vi, beforeEach } from "vitest"
import { notifyUsers, resolveRecipients } from "./services"
import * as q from "./queries"
import * as userQ from "@/modules/users/queries"
import { publishRealtime } from "@/lib/pubsub"

vi.mock("./queries", () => ({ createNotifications: vi.fn() }))
vi.mock("@/modules/users/queries", () => ({ listUserIdsByRoles: vi.fn() }))
vi.mock("@/lib/pubsub", () => ({ publishRealtime: vi.fn() }))

beforeEach(() => vi.clearAllMocks())

describe("resolveRecipients", () => {
  it("kembalikan agent pemegang bila assigned", async () => {
    expect(await resolveRecipients({ agentId: "ag1" })).toEqual(["ag1"])
    expect(userQ.listUserIdsByRoles).not.toHaveBeenCalled()
  })

  it("broadcast ke role antrian bila unassigned", async () => {
    vi.mocked(userQ.listUserIdsByRoles).mockResolvedValue(["a", "b", "c"])
    const r = await resolveRecipients({ agentId: null })
    expect(r).toEqual(["a", "b", "c"])
    expect(userQ.listUserIdsByRoles).toHaveBeenCalledWith(["agent", "supervisor", "admin", "super_admin"])
  })
})

describe("notifyUsers", () => {
  it("no-op untuk daftar kosong", async () => {
    await notifyUsers([], { type: "new_message", title: "x" })
    expect(q.createNotifications).not.toHaveBeenCalled()
  })

  it("dedup userIds, insert, publish per user ke agent room", async () => {
    vi.mocked(q.createNotifications).mockResolvedValue([
      { id: "n1", userId: "u1", type: "new_message", title: "T", body: "B", conversationId: "c1", isRead: false, createdAt: new Date() },
      { id: "n2", userId: "u2", type: "new_message", title: "T", body: "B", conversationId: "c1", isRead: false, createdAt: new Date() },
    ] as never)
    await notifyUsers(["u1", "u2", "u1"], { type: "new_message", title: "T", body: "B", conversationId: "c1" })
    expect(vi.mocked(q.createNotifications).mock.calls[0]![0]).toHaveLength(2)
    const calls = vi.mocked(publishRealtime).mock.calls
    expect(calls).toHaveLength(2)
    expect(calls[0]![0].type).toBe("notification:new")
    expect(calls[0]![0].rooms).toEqual(["agent:u1"])
    expect(calls[1]![0].rooms).toEqual(["agent:u2"])
  })
})
