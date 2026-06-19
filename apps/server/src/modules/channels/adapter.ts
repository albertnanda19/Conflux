import { AppError } from "@/lib/errors"

export type ChannelType = "whatsapp" | "instagram" | "facebook" | "telegram" | "livechat"

export type ChannelProvider =
  | "whatsapp_cloud"
  | "whatsapp_fonnte"
  | "telegram_bot"
  | "instagram"
  | "facebook"
  | "livechat"
  | "simulator"

export type MessageContentType = "text" | "image" | "video" | "document" | "audio" | "location"

export type MessageContent = {
  text?: string
  mediaUrl?: string
  fileName?: string
  fileSize?: string
  location?: { lat: number; lng: number; name?: string }
}

export type NormalizedInbound = {
  channelType: ChannelType
  channelIdentifier: string
  contactName?: string
  contentType: MessageContentType
  content: MessageContent
  externalMessageId?: string
  timestamp?: string
}

export type SendMessageParams = {
  credentials: unknown
  to: string
  contentType: MessageContentType
  content: MessageContent
}

export type SendResult = { externalMessageId: string }

export type WebhookContext = {
  headers: Record<string, string | undefined>
  rawBody: string
  query: Record<string, string | undefined>
}

export interface ChannelAdapter {
  provider: ChannelProvider
  sendMessage(params: SendMessageParams): Promise<SendResult>
  verifyWebhook(ctx: WebhookContext): boolean
  parseInbound(payload: unknown): NormalizedInbound[]
}

export class NotImplementedError extends AppError {
  constructor(provider: ChannelProvider, action: string) {
    super(501, "NOT_IMPLEMENTED", `Integrasi ${action} untuk provider "${provider}" belum diimplementasi.`)
  }
}

export function createStubAdapter(provider: ChannelProvider): ChannelAdapter {
  return {
    provider,
    async sendMessage() {
      throw new NotImplementedError(provider, "pengiriman pesan")
    },
    verifyWebhook() {
      return false
    },
    parseInbound() {
      throw new NotImplementedError(provider, "parsing webhook")
    },
  }
}
