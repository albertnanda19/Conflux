import { findChannelById } from "./queries"
import { telegramAdapter, type TelegramCredentials } from "./providers/telegram"
import { messageQueue, INBOUND_JOB } from "@/lib/queues"
import { resolveCredentials } from "./credentials"

export async function handleTelegramWebhook(
  channelId: string,
  body: unknown,
  headers: Record<string, string | undefined>,
) {
  const channel = await findChannelById(channelId)
  if (!channel || channel.provider !== "telegram_bot") return { ok: false }

  const creds = resolveCredentials("telegram_bot", channel.credentials) as TelegramCredentials
  if (creds?.webhookSecret) {
    if (headers["x-telegram-bot-api-secret-token"] !== creds.webhookSecret) return { ok: false }
  }

  const inbound = telegramAdapter.parseInbound(body)
  for (const ib of inbound) {
    await messageQueue.add(INBOUND_JOB, { channelId, inbound: ib }, { jobId: `tgwh_${channelId}_${ib.externalMessageId}` })
  }
  return { ok: true }
}
