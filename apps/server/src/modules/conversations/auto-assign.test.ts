import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { autoAssign } from "./auto-assign"
import * as convQ from "./queries"
import * as userQ from "@/modules/users/queries"
import * as contactQ from "@/modules/contacts/queries"
import { notifyUsers } from "@/modules/notifications/services"
import { publishRealtime } from "@/lib/pubsub"

vi.mock("./queries", () => ({ assignAgent: vi.fn() }))
vi.mock("@/modules/users/queries", () => ({ findLeastBusyOnlineAgent: vi.fn() }))
vi.mock("@/modules/contacts/queries", () => ({ createContactActivity: vi.fn() }))
vi.mock("@/modules/notifications/services", () => ({ notifyUsers: vi.fn() }))
vi.mock("@/lib/pubsub", () => ({ publishRealtime: vi.fn() }))
vi.mock("@/lib/db", () => ({
  db: { transaction: async (fn: (tx: { execute: () => Promise<void> }) => unknown) => fn({ execute: async () => {} }) },
}))

const prev = process.env.AUTO_ASSIGN_ENABLED
beforeEach(() => vi.clearAllMocks())
afterEach(() => { process.env.AUTO_ASSIGN_ENABLED = prev })

describe("autoAssign", () => {
  it("assign ke agent least-busy + activity + emit + notif, return id", async () => {
    delete process.env.AUTO_ASSIGN_ENABLED
    vi.mocked(userQ.findLeastBusyOnlineAgent).mockResolvedValue({ id: "ag1", activeConversationCount: 2 } as never)
    const result = await autoAssign("cv1", "ct1", "Budi")
    expect(result).toBe("ag1")
    expect(convQ.assignAgent).toHaveBeenCalledWith("cv1", "ag1", expect.anything())
    expect(contactQ.createContactActivity).toHaveBeenCalledWith(expect.objectContaining({ type: "assignment", agentId: "ag1" }))
    expect(vi.mocked(publishRealtime).mock.calls[0]![0].type).toBe("conversation:assigned")
    expect(vi.mocked(notifyUsers).mock.calls[0]![0]).toEqual(["ag1"])
  })

  it("return null + tanpa efek bila tak ada agent online", async () => {
    delete process.env.AUTO_ASSIGN_ENABLED
    vi.mocked(userQ.findLeastBusyOnlineAgent).mockResolvedValue(null as never)
    const result = await autoAssign("cv1", "ct1")
    expect(result).toBeNull()
    expect(convQ.assignAgent).not.toHaveBeenCalled()
    expect(notifyUsers).not.toHaveBeenCalled()
  })

  it("return null + skip bila AUTO_ASSIGN_ENABLED=false", async () => {
    process.env.AUTO_ASSIGN_ENABLED = "false"
    const result = await autoAssign("cv1", "ct1")
    expect(result).toBeNull()
    expect(userQ.findLeastBusyOnlineAgent).not.toHaveBeenCalled()
    expect(convQ.assignAgent).not.toHaveBeenCalled()
  })
})
