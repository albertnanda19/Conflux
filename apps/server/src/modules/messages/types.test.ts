import { describe, it, expect } from "vitest"
import { sendMessageSchema, listMessagesQuerySchema } from "./types"

describe("sendMessageSchema", () => {
  it("accepts text message", () => {
    const r = sendMessageSchema.safeParse({ contentType: "text", content: { text: "halo" } })
    expect(r.success).toBe(true)
  })

  it("defaults contentType to text", () => {
    const r = sendMessageSchema.safeParse({ content: { text: "halo" } })
    expect(r.success && r.data.contentType).toBe("text")
  })

  it("rejects text without content.text", () => {
    const r = sendMessageSchema.safeParse({ contentType: "text", content: {} })
    expect(r.success).toBe(false)
  })

  it("rejects location without content.location", () => {
    const r = sendMessageSchema.safeParse({ contentType: "location", content: {} })
    expect(r.success).toBe(false)
  })

  it("accepts document with fileName", () => {
    const r = sendMessageSchema.safeParse({ contentType: "document", content: { fileName: "a.pdf", mediaUrl: "https://x/a.pdf" } })
    expect(r.success).toBe(true)
  })
})

describe("listMessagesQuerySchema", () => {
  it("defaults limit to 30", () => {
    const r = listMessagesQuerySchema.safeParse({})
    expect(r.success && r.data.limit).toBe(30)
  })

  it("rejects non-datetime cursor", () => {
    const r = listMessagesQuerySchema.safeParse({ cursor: "not-a-date" })
    expect(r.success).toBe(false)
  })

  it("caps limit at 100", () => {
    const r = listMessagesQuerySchema.safeParse({ limit: "500" })
    expect(r.success).toBe(false)
  })
})
