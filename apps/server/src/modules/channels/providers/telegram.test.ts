import { describe, it, expect } from "vitest"
import { telegramAdapter } from "./telegram"

describe("telegramAdapter.parseInbound", () => {
  it("normalizes a text message update", () => {
    const [msg] = telegramAdapter.parseInbound({
      update_id: 100,
      message: {
        message_id: 7,
        date: 1700000000,
        from: { id: 555, first_name: "Budi", last_name: "Santoso", username: "budis" },
        chat: { id: 555 },
        text: "Halo bot",
      },
    })
    expect(msg!.channelType).toBe("telegram")
    expect(msg!.channelIdentifier).toBe("555")
    expect(msg!.contactName).toBe("Budi Santoso")
    expect(msg!.contentType).toBe("text")
    expect(msg!.content.text).toBe("Halo bot")
    expect(msg!.externalMessageId).toBe("7")
  })

  it("falls back to username when no name", () => {
    const [msg] = telegramAdapter.parseInbound({
      update_id: 101,
      message: { message_id: 8, date: 1700000000, from: { id: 1, username: "anon" }, chat: { id: 1 }, text: "hi" },
    })
    expect(msg!.contactName).toBe("anon")
  })

  it("classifies a location message", () => {
    const [msg] = telegramAdapter.parseInbound({
      update_id: 102,
      message: { message_id: 9, date: 1700000000, chat: { id: 2 }, location: { latitude: -6.2, longitude: 106.8 } },
    })
    expect(msg!.contentType).toBe("location")
    expect(msg!.content.location).toEqual({ lat: -6.2, lng: 106.8 })
  })

  it("returns empty array for non-message updates", () => {
    expect(telegramAdapter.parseInbound({ update_id: 103 })).toEqual([])
    expect(telegramAdapter.parseInbound(null)).toEqual([])
  })

  it("verifyWebhook returns true", () => {
    expect(telegramAdapter.verifyWebhook({ headers: {}, rawBody: "", query: {} })).toBe(true)
  })
})
