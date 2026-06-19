import { randomUUID } from "node:crypto"
import type {
  ChannelAdapter,
  ChannelType,
  MessageContent,
  MessageContentType,
  NormalizedInbound,
} from "../adapter"
import { BadRequestError } from "@/lib/errors"

const VALID_TYPES: MessageContentType[] = ["text", "image", "video", "document", "audio", "location"]

export const simulatorAdapter: ChannelAdapter = {
  provider: "simulator",
  async sendMessage() {
    return { externalMessageId: `sim_${randomUUID()}` }
  },
  verifyWebhook() {
    return true
  },
  parseInbound(payload: unknown): NormalizedInbound[] {
    const p = payload as Partial<NormalizedInbound> | undefined
    if (!p || typeof p !== "object") {
      throw new BadRequestError("Payload simulasi tidak valid.")
    }
    if (!p.channelType) throw new BadRequestError("channelType wajib diisi.")
    if (!p.channelIdentifier) throw new BadRequestError("channelIdentifier wajib diisi.")

    const contentType: MessageContentType = p.contentType ?? "text"
    if (!VALID_TYPES.includes(contentType)) {
      throw new BadRequestError(`contentType tidak valid: ${contentType}`)
    }

    const content: MessageContent = p.content ?? {}
    if (contentType === "text" && !content.text) {
      throw new BadRequestError("Pesan teks memerlukan content.text.")
    }
    if (contentType === "location" && !content.location) {
      throw new BadRequestError("Pesan lokasi memerlukan content.location.")
    }

    return [
      {
        channelType: p.channelType as ChannelType,
        channelIdentifier: p.channelIdentifier,
        contactName: p.contactName,
        contentType,
        content,
        externalMessageId: p.externalMessageId ?? `sim_${randomUUID()}`,
        timestamp: p.timestamp ?? new Date().toISOString(),
      },
    ]
  },
}
