import * as q from "./queries"
import { getAdapter } from "@/modules/channels/registry"
import { publishRealtime } from "@/lib/pubsub"
import { conversationRoom, INBOX_ROOM } from "@/lib/ws"
import { NotFoundError } from "@/lib/errors"
import { resolveCredentials } from "@/modules/channels/credentials"
import type { JwtPayload } from "@/lib/auth"
import type { ChannelProvider } from "@/modules/channels/adapter"
import type { MessageContent, MessageResponse, SendMessageInput } from "./types"

const CONTENT_LABEL: Record<string, string> = {
  image: "🖼️ Gambar",
  video: "🎬 Video",
  document: "📎 Dokumen",
  audio: "🎵 Audio",
  location: "📍 Lokasi",
}

export function previewFromContent(contentType: string, content: MessageContent): string {
  if (contentType === "text") return content.text ?? ""
  if (content.text) return content.text
  return CONTENT_LABEL[contentType] ?? ""
}

function resolveSenderName(senderType: string, senderId: string | null, agentNames: Map<string, string>): string | undefined {
  if (senderType === "ai") return "AI Assistant"
  if (senderType === "system") return "Sistem"
  if (senderType === "agent" && senderId) return agentNames.get(senderId)
  return undefined
}

function mapMessage(
  row: {
    id: string
    conversationId: string
    direction: string
    senderType: string
    senderId: string | null
    contentType: string
    content: unknown
    status: string
    createdAt: Date
  },
  agentNames: Map<string, string>,
): MessageResponse {
  const content = (row.content ?? {}) as MessageContent
  return {
    id: row.id,
    conversationId: row.conversationId,
    direction: row.direction,
    senderType: row.senderType,
    senderName: resolveSenderName(row.senderType, row.senderId, agentNames),
    content: content.text ?? "",
    contentType: row.contentType,
    status: row.status,
    createdAt: row.createdAt,
    mediaUrl: content.mediaUrl,
    fileName: content.fileName,
    fileSize: content.fileSize,
    location: content.location,
  }
}

export async function listMessages(conversationId: string, limit: number, cursor?: string) {
  const rows = await q.listMessages(conversationId, limit, cursor)
  const agentIds = [
    ...new Set(rows.filter((r) => r.senderType === "agent" && r.senderId).map((r) => r.senderId as string)),
  ]
  const agentNames = await q.getAgentNames(agentIds)
  const ordered = [...rows].reverse()
  const nextCursor = rows.length === limit ? rows[rows.length - 1]!.createdAt.toISOString() : null
  return {
    data: ordered.map((r) => mapMessage(r, agentNames)),
    nextCursor,
  }
}

export async function sendMessage(conversationId: string, input: SendMessageInput, agent: JwtPayload): Promise<MessageResponse> {
  const conversation = await q.getConversationWithChannel(conversationId)
  if (!conversation) throw new NotFoundError("Percakapan")

  const inserted = await q.insertMessage({
    conversationId,
    direction: "outbound",
    senderType: "agent",
    senderId: agent.sub,
    contentType: input.contentType,
    content: input.content,
    status: "sent",
  })

  const adapter = getAdapter(conversation.provider as ChannelProvider)
  const recipient = (await q.getContactChannelIdentifier(conversation.contactId, conversation.channelType)) ?? conversation.contactId
  // Sukses kirim = "sent" (diterima platform). "delivered"/"read" HANYA dari status report
  // nyata (mis. webhook Fonnte). Telegram Bot API tak menyediakan delivery/read receipt → tetap "sent".
  try {
    const result = await adapter.sendMessage({
      credentials: resolveCredentials(conversation.provider, conversation.credentials),
      to: recipient,
      contentType: input.contentType,
      content: input.content,
    })
    await q.setMessageDelivery(inserted.id, result.externalMessageId, "sent")
    inserted.externalMessageId = result.externalMessageId
  } catch (err) {
    await q.setMessageDelivery(inserted.id, null, "failed")
    inserted.status = "failed"
    console.error("[Messages] Gagal kirim ke channel:", (err as Error).message)
  }

  const lastMessageAt = inserted.createdAt
  const preview = previewFromContent(input.contentType, input.content)
  await q.updateConversationAfterMessage(conversationId, {
    lastMessagePreview: preview,
    lastMessageAt,
    isAiHandling: false,
  })

  const agentNames = await q.getAgentNames([agent.sub])
  const message = mapMessage({ ...inserted, content: input.content }, agentNames)

  await publishRealtime({
    rooms: [conversationRoom(conversationId), INBOX_ROOM],
    type: "message:new",
    data: message,
  })
  await publishRealtime({
    rooms: [conversationRoom(conversationId), INBOX_ROOM],
    type: "conversation:updated",
    data: { id: conversationId, lastMessage: preview, lastMessageAt, isAiHandling: false },
  })

  return message
}

export async function applyMessageStatus(externalMessageId: string, status: string) {
  const row = await q.updateMessageStatusByExternalId(externalMessageId, status)
  if (!row) return null
  await publishRealtime({
    rooms: [conversationRoom(row.conversationId), INBOX_ROOM],
    type: "message:status",
    data: { id: row.id, conversationId: row.conversationId, status },
  })
  return row
}
