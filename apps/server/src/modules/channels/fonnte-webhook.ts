import { findChannelById } from "./queries"
import { whatsappFonnteAdapter } from "./providers/whatsapp-fonnte"
import { messageQueue, INBOUND_JOB } from "@/lib/queues"
import { applyMessageStatus } from "@/modules/messages/services"

const STATUS_MAP: Record<string, string> = {
  sent: "sent",
  delivered: "delivered",
  read: "read",
  failed: "failed",
  fail: "failed",
}

export async function handleFonnteWebhook(channelId: string, body: unknown) {
  const channel = await findChannelById(channelId)
  if (!channel || channel.provider !== "whatsapp_fonnte") return { ok: false }

  const b = (body ?? {}) as Record<string, string>

  // Status report pesan keluar (bukan pesan masuk): ada `status` + `id`, tanpa pesan masuk
  if (b.status && STATUS_MAP[b.status] && !b.message && !b.sender && b.id) {
    await applyMessageStatus(String(b.id), STATUS_MAP[b.status]!)
    return { ok: true }
  }

  const inbound = whatsappFonnteAdapter.parseInbound(body)
  for (const ib of inbound) {
    await messageQueue.add(INBOUND_JOB, { channelId, inbound: ib }, { jobId: `fonnte_${channelId}_${ib.externalMessageId}` })
  }
  return { ok: true }
}
