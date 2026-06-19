import { describe, it, expect } from "vitest"
import { whatsappFonnteAdapter } from "./whatsapp-fonnte"

describe("whatsappFonnteAdapter.parseInbound", () => {
  it("normalizes a text message", () => {
    const [msg] = whatsappFonnteAdapter.parseInbound({ sender: "628123456789", name: "Budi", message: "halo" })
    expect(msg!.channelType).toBe("whatsapp")
    expect(msg!.channelIdentifier).toBe("628123456789")
    expect(msg!.contactName).toBe("Budi")
    expect(msg!.contentType).toBe("text")
    expect(msg!.content.text).toBe("halo")
  })

  it("classifies media by extension", () => {
    const [img] = whatsappFonnteAdapter.parseInbound({ sender: "628", message: "cek", url: "https://x/p.jpg", extension: "jpg", filename: "p.jpg" })
    expect(img!.contentType).toBe("image")
    expect(img!.content.mediaUrl).toBe("https://x/p.jpg")
    const [doc] = whatsappFonnteAdapter.parseInbound({ sender: "628", url: "https://x/f.pdf", extension: "pdf", filename: "f.pdf" })
    expect(doc!.contentType).toBe("document")
  })

  it("parses location", () => {
    const [msg] = whatsappFonnteAdapter.parseInbound({ sender: "628", location: "-6.2,106.8" })
    expect(msg!.contentType).toBe("location")
    expect(msg!.content.location).toEqual({ lat: -6.2, lng: 106.8 })
  })

  it("returns empty when no sender", () => {
    expect(whatsappFonnteAdapter.parseInbound({ message: "x" })).toEqual([])
    expect(whatsappFonnteAdapter.parseInbound(null)).toEqual([])
  })
})
