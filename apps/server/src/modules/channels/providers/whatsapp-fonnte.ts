import type {
  ChannelAdapter,
  MessageContent,
  MessageContentType,
  NormalizedInbound,
  SendMessageParams,
} from "../adapter"
import { AppError } from "@/lib/errors"

export type FonnteCredentials = { apiToken: string; webhookSecret?: string }

const API = "https://api.fonnte.com"

function tokenOf(credentials: unknown): string {
  const token = (credentials as FonnteCredentials | null)?.apiToken
  if (!token) throw new AppError(400, "CHANNEL_MISCONFIGURED", "API token Fonnte belum dikonfigurasi pada channel.")
  return token
}

export async function fonnteSend(token: string, body: Record<string, string>): Promise<{ id?: unknown[] }> {
  const res = await fetch(`${API}/send`, {
    method: "POST",
    headers: { Authorization: token, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  const json = (await res.json().catch(() => null)) as { status?: boolean; reason?: string; id?: unknown[] } | null
  if (!json?.status) {
    throw new AppError(502, "FONNTE_ERROR", `Fonnte gagal kirim: ${json?.reason ?? res.status}`)
  }
  return json
}

function classify(body: Record<string, string>): { contentType: MessageContentType; content: MessageContent } {
  if (body.location) {
    const [lat, lng] = body.location.split(",").map((s) => Number(s.trim()))
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return { contentType: "location", content: { location: { lat: lat!, lng: lng! } } }
    }
  }
  if (body.url) {
    const ext = (body.extension || "").toLowerCase()
    const isImage = ["jpg", "jpeg", "png", "webp", "gif"].includes(ext)
    return {
      contentType: isImage ? "image" : "document",
      content: { mediaUrl: body.url, fileName: body.filename, text: body.message || undefined },
    }
  }
  return { contentType: "text", content: { text: body.message ?? body.text ?? "" } }
}

export const whatsappFonnteAdapter: ChannelAdapter = {
  provider: "whatsapp_fonnte",

  async sendMessage(params: SendMessageParams) {
    const token = tokenOf(params.credentials)
    const { to, contentType, content } = params
    if ((contentType === "image" || contentType === "document") && content.mediaUrl) {
      const r = await fonnteSend(token, { target: to, url: content.mediaUrl, message: content.text ?? "" })
      return { externalMessageId: String((r.id?.[0] as string | number | undefined) ?? "") }
    }
    if (contentType === "location" && content.location) {
      const r = await fonnteSend(token, { target: to, location: `${content.location.lat},${content.location.lng}` })
      return { externalMessageId: String((r.id?.[0] as string | number | undefined) ?? "") }
    }
    const r = await fonnteSend(token, { target: to, message: content.text ?? "" })
    return { externalMessageId: String((r.id?.[0] as string | number | undefined) ?? "") }
  },

  verifyWebhook() {
    return true
  },

  parseInbound(payload: unknown): NormalizedInbound[] {
    const body = payload as Record<string, string> | null
    if (!body || !body.sender) return []
    // Abaikan pesan dari grup (member berisi pengirim asli) — fokus chat 1-1
    const { contentType, content } = classify(body)
    return [
      {
        channelType: "whatsapp",
        channelIdentifier: body.sender,
        contactName: body.name || undefined,
        contentType,
        content,
        externalMessageId: body.id ? String(body.id) : `fonnte_${body.sender}_${Date.now()}`,
        timestamp: new Date().toISOString(),
      },
    ]
  },
}
