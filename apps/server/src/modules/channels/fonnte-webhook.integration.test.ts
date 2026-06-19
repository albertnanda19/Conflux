import { describe, it, expect, beforeEach } from "vitest"
import { resetDb, seedChannel, seedContact, seedConversation, seedOutboundMessage, getMessageById } from "@/test/helpers"
import { handleFonnteWebhook } from "./fonnte-webhook"

beforeEach(resetDb)

describe("handleFonnteWebhook (integration)", () => {
  it("status report memperbarui status pesan keluar (by externalMessageId)", async () => {
    const ch = await seedChannel({ provider: "whatsapp_fonnte" })
    const ct = await seedContact()
    const cv = await seedConversation(ct.id, ch.id)
    const msg = await seedOutboundMessage(cv.id, "fonnte-ext-1", "delivered")

    const res = await handleFonnteWebhook(ch.id, { status: "read", id: "fonnte-ext-1" })
    expect(res.ok).toBe(true)

    const updated = await getMessageById(msg.id)
    expect(updated?.status).toBe("read")
  })

  it("pesan masuk (sender+message) di-ingest, bukan status update", async () => {
    const ch = await seedChannel({ provider: "whatsapp_fonnte" })
    const res = await handleFonnteWebhook(ch.id, { sender: "628999", name: "Lead", message: "halo" })
    expect(res.ok).toBe(true)
  })

  it("channel non-fonnte ditolak", async () => {
    const ch = await seedChannel({ provider: "whatsapp_cloud" })
    const res = await handleFonnteWebhook(ch.id, { status: "read", id: "x" })
    expect(res.ok).toBe(false)
  })
})
