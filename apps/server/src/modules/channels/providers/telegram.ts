import type {
  ChannelAdapter,
  MessageContent,
  MessageContentType,
  NormalizedInbound,
  SendMessageParams,
} from "../adapter"
import { AppError } from "@/lib/errors"

export type TelegramCredentials = {
  botToken: string
  mode?: "polling" | "webhook"
  webhookSecret?: string
}

const API = "https://api.telegram.org"

function tokenOf(credentials: unknown): string {
  const token = (credentials as TelegramCredentials | null)?.botToken
  if (!token) throw new AppError(400, "CHANNEL_MISCONFIGURED", "Bot token Telegram belum dikonfigurasi pada channel.")
  return token
}

export async function telegramCall<T = unknown>(token: string, method: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API}/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  })
  const json = (await res.json()) as { ok: boolean; result?: T; description?: string }
  if (!json.ok) {
    throw new AppError(502, "TELEGRAM_ERROR", `Telegram API gagal: ${json.description ?? res.status}`)
  }
  return json.result as T
}

type TgUpdate = {
  update_id: number
  message?: {
    message_id: number
    date: number
    from?: { id: number; first_name?: string; last_name?: string; username?: string }
    chat: { id: number }
    text?: string
    caption?: string
    photo?: unknown[]
    document?: unknown
    location?: { latitude: number; longitude: number }
  }
}

function classify(msg: NonNullable<TgUpdate["message"]>): { contentType: MessageContentType; content: MessageContent } {
  if (msg.location) {
    return { contentType: "location", content: { location: { lat: msg.location.latitude, lng: msg.location.longitude } } }
  }
  if (msg.photo) return { contentType: "image", content: { text: msg.caption || "[Gambar]" } }
  if (msg.document) return { contentType: "document", content: { text: msg.caption || "[Dokumen]" } }
  return { contentType: "text", content: { text: msg.text ?? msg.caption ?? "" } }
}

export const telegramAdapter: ChannelAdapter = {
  provider: "telegram_bot",

  async sendMessage(params: SendMessageParams) {
    const token = tokenOf(params.credentials)
    const { to, contentType, content } = params
    if (contentType === "image" && content.mediaUrl) {
      const r = await telegramCall<{ message_id: number }>(token, "sendPhoto", { chat_id: to, photo: content.mediaUrl, caption: content.text })
      return { externalMessageId: String(r.message_id) }
    }
    if (contentType === "document" && content.mediaUrl) {
      const r = await telegramCall<{ message_id: number }>(token, "sendDocument", { chat_id: to, document: content.mediaUrl, caption: content.text })
      return { externalMessageId: String(r.message_id) }
    }
    if (contentType === "location" && content.location) {
      const r = await telegramCall<{ message_id: number }>(token, "sendLocation", { chat_id: to, latitude: content.location.lat, longitude: content.location.lng })
      return { externalMessageId: String(r.message_id) }
    }
    const r = await telegramCall<{ message_id: number }>(token, "sendMessage", { chat_id: to, text: content.text ?? "" })
    return { externalMessageId: String(r.message_id) }
  },

  verifyWebhook() {
    return true
  },

  parseInbound(payload: unknown): NormalizedInbound[] {
    const update = payload as TgUpdate | null
    const msg = update?.message
    if (!msg) return []
    const { contentType, content } = classify(msg)
    const name = [msg.from?.first_name, msg.from?.last_name].filter(Boolean).join(" ") || msg.from?.username
    return [
      {
        channelType: "telegram",
        channelIdentifier: String(msg.chat.id),
        contactName: name,
        contentType,
        content,
        externalMessageId: String(msg.message_id),
        timestamp: new Date((msg.date ?? Date.now() / 1000) * 1000).toISOString(),
      },
    ]
  },
}
