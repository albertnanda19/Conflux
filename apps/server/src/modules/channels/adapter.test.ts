import { describe, it, expect } from "vitest"
import { createStubAdapter } from "./adapter"
import { simulatorAdapter } from "./providers/simulator"
import { AppError, BadRequestError } from "@/lib/errors"

describe("createStubAdapter", () => {
  const stub = createStubAdapter("telegram_bot")

  it("sets provider", () => {
    expect(stub.provider).toBe("telegram_bot")
  })

  it("sendMessage throws NOT_IMPLEMENTED (501)", async () => {
    await expect(stub.sendMessage({ credentials: {}, to: "x", contentType: "text", content: { text: "y" } })).rejects.toMatchObject({
      code: "NOT_IMPLEMENTED",
      statusCode: 501,
    })
  })

  it("verifyWebhook returns false", () => {
    expect(stub.verifyWebhook({ headers: {}, rawBody: "", query: {} })).toBe(false)
  })

  it("parseInbound throws", () => {
    expect(() => stub.parseInbound({})).toThrow(AppError)
  })
})

describe("simulatorAdapter", () => {
  it("sendMessage returns sim_ external id", async () => {
    const res = await simulatorAdapter.sendMessage({ credentials: {}, to: "+62", contentType: "text", content: { text: "hi" } })
    expect(res.externalMessageId).toMatch(/^sim_/)
  })

  it("verifyWebhook returns true", () => {
    expect(simulatorAdapter.verifyWebhook({ headers: {}, rawBody: "", query: {} })).toBe(true)
  })

  it("parseInbound normalizes a valid text payload", () => {
    const [msg] = simulatorAdapter.parseInbound({
      channelType: "whatsapp",
      channelIdentifier: "+6281",
      contentType: "text",
      content: { text: "halo" },
    })
    expect(msg!.channelType).toBe("whatsapp")
    expect(msg!.content.text).toBe("halo")
    expect(msg!.externalMessageId).toMatch(/^sim_/)
    expect(msg!.timestamp).toBeDefined()
  })

  it("rejects missing channelIdentifier", () => {
    expect(() => simulatorAdapter.parseInbound({ channelType: "whatsapp" })).toThrow(BadRequestError)
  })

  it("rejects text payload without text", () => {
    expect(() => simulatorAdapter.parseInbound({ channelType: "whatsapp", channelIdentifier: "+62", contentType: "text", content: {} })).toThrow(BadRequestError)
  })

  it("rejects location payload without location", () => {
    expect(() => simulatorAdapter.parseInbound({ channelType: "whatsapp", channelIdentifier: "+62", contentType: "location", content: {} })).toThrow(BadRequestError)
  })
})
