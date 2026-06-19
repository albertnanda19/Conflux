import { redis } from "@/lib/redis"
import { messageQueue, INBOUND_JOB } from "@/lib/queues"
import { listActiveTelegramChannels } from "@/modules/channels/queries"
import { telegramAdapter, telegramCall, type TelegramCredentials } from "@/modules/channels/providers/telegram"
import { resolveCredentials } from "@/modules/channels/credentials"

type TgUpdate = { update_id: number }

let running = false
const loops: Promise<void>[] = []

const offsetKey = (channelId: string) => `telegram:offset:${channelId}`
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function pollChannel(channelId: string, token: string) {
  try {
    await telegramCall(token, "deleteWebhook", { drop_pending_updates: false })
  } catch (err) {
    console.error(`[TelegramPoller] deleteWebhook gagal (${channelId}):`, (err as Error).message)
  }

  while (running) {
    try {
      const offset = Number(await redis.get(offsetKey(channelId))) || 0
      const updates = await telegramCall<TgUpdate[]>(token, "getUpdates", {
        offset,
        timeout: 20,
        allowed_updates: ["message"],
      })
      for (const update of updates) {
        const inbound = telegramAdapter.parseInbound(update)
        for (const ib of inbound) {
          await messageQueue.add(INBOUND_JOB, { channelId, inbound: ib }, { jobId: `tg_${channelId}_${update.update_id}` })
        }
        await redis.set(offsetKey(channelId), String(update.update_id + 1))
      }
    } catch (err) {
      console.error(`[TelegramPoller] getUpdates error (${channelId}):`, (err as Error).message)
      await sleep(5000)
    }
  }
}

export async function startTelegramPoller() {
  const channels = await listActiveTelegramChannels()
  const pollable = channels
    .map((c) => ({ id: c.id, creds: resolveCredentials("telegram_bot", c.credentials) as TelegramCredentials }))
    .filter((c) => c.creds?.botToken && c.creds.mode !== "webhook")

  if (pollable.length === 0) {
    console.log("[TelegramPoller] Tidak ada channel Telegram (polling) aktif.")
    return
  }

  running = true
  for (const channel of pollable) {
    loops.push(pollChannel(channel.id, channel.creds!.botToken))
  }
  console.log(`[TelegramPoller] Polling ${pollable.length} channel Telegram.`)
}

export async function stopTelegramPoller() {
  running = false
  await Promise.allSettled(loops)
}
