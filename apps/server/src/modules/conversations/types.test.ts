import { describe, it, expect } from "vitest"
import { listConversationsQuerySchema, assignSchema, transferSchema } from "./types"

describe("listConversationsQuerySchema", () => {
  it("applies defaults", () => {
    const r = listConversationsQuerySchema.safeParse({})
    expect(r.success && r.data.page).toBe(1)
    expect(r.success && r.data.limit).toBe(20)
    expect(r.success && r.data.sortBy).toBe("newest")
  })

  it("splits labelIds CSV into array", () => {
    const r = listConversationsQuerySchema.safeParse({ labelIds: "a, b ,c" })
    expect(r.success && r.data.labelIds).toEqual(["a", "b", "c"])
  })

  it("leaves labelIds undefined when absent", () => {
    const r = listConversationsQuerySchema.safeParse({})
    expect(r.success && r.data.labelIds).toBeUndefined()
  })

  it("rejects invalid channel", () => {
    const r = listConversationsQuerySchema.safeParse({ channel: "tiktok" })
    expect(r.success).toBe(false)
  })

  it("rejects invalid sortBy", () => {
    const r = listConversationsQuerySchema.safeParse({ sortBy: "random" })
    expect(r.success).toBe(false)
  })

  it("accepts uuid contactId, rejects non-uuid", () => {
    expect(listConversationsQuerySchema.safeParse({ contactId: "11111111-1111-1111-1111-111111111111" }).success).toBe(true)
    expect(listConversationsQuerySchema.safeParse({ contactId: "abc" }).success).toBe(false)
  })

  it("accepts valid datePreset, rejects invalid", () => {
    expect(listConversationsQuerySchema.safeParse({ datePreset: "7d" }).success).toBe(true)
    expect(listConversationsQuerySchema.safeParse({ datePreset: "1y" }).success).toBe(false)
  })
})

describe("assignSchema", () => {
  it("accepts null agentId (unassign)", () => {
    const r = assignSchema.safeParse({ agentId: null })
    expect(r.success).toBe(true)
  })
  it("rejects non-uuid agentId", () => {
    const r = assignSchema.safeParse({ agentId: "abc" })
    expect(r.success).toBe(false)
  })
})

describe("transferSchema", () => {
  it("requires uuid agentId", () => {
    expect(transferSchema.safeParse({ agentId: "abc" }).success).toBe(false)
    expect(transferSchema.safeParse({ agentId: "11111111-1111-1111-1111-111111111111" }).success).toBe(true)
  })
})
