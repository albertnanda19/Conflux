import { db } from "@/lib/db"
import { messages, conversations, channels, users, contactChannels } from "@/lib/schema"
import { eq, and, lt, desc, inArray, count } from "drizzle-orm"
import type { MessageContent } from "./types"

export async function countAiMessages(conversationId: string) {
  const [row] = await db
    .select({ total: count() })
    .from(messages)
    .where(and(eq(messages.conversationId, conversationId), eq(messages.senderType, "ai")))
  return row?.total ?? 0
}

export async function getContactChannelIdentifier(contactId: string, channelType: string) {
  const [row] = await db
    .select({ identifier: contactChannels.channelIdentifier })
    .from(contactChannels)
    .where(and(eq(contactChannels.contactId, contactId), eq(contactChannels.channelType, channelType)))
    .limit(1)
  return row?.identifier ?? null
}

export async function listMessages(conversationId: string, limit: number, cursor?: string) {
  const conditions = [eq(messages.conversationId, conversationId)]
  if (cursor) conditions.push(lt(messages.createdAt, new Date(cursor)))

  return db
    .select({
      id: messages.id,
      conversationId: messages.conversationId,
      direction: messages.direction,
      senderType: messages.senderType,
      senderId: messages.senderId,
      contentType: messages.contentType,
      content: messages.content,
      status: messages.status,
      createdAt: messages.createdAt,
    })
    .from(messages)
    .where(and(...conditions))
    .orderBy(desc(messages.createdAt))
    .limit(limit)
}

export async function insertMessage(data: {
  conversationId: string
  direction: string
  senderType: string
  senderId?: string
  contentType: string
  content: MessageContent
  status?: string
  externalMessageId?: string
}) {
  const [row] = await db
    .insert(messages)
    .values({
      conversationId: data.conversationId,
      direction: data.direction,
      senderType: data.senderType,
      senderId: data.senderId,
      contentType: data.contentType,
      content: data.content,
      status: data.status ?? "sent",
      externalMessageId: data.externalMessageId,
    })
    .returning()
  return row
}

export async function setMessageDelivery(id: string, externalMessageId: string | null, status: string) {
  await db
    .update(messages)
    .set({ externalMessageId: externalMessageId ?? undefined, status })
    .where(eq(messages.id, id))
}

export async function updateMessageStatusByExternalId(externalMessageId: string, status: string) {
  const [row] = await db
    .update(messages)
    .set({ status })
    .where(eq(messages.externalMessageId, externalMessageId))
    .returning({ id: messages.id, conversationId: messages.conversationId })
  return row || null
}

export async function getConversationWithChannel(conversationId: string) {
  const [row] = await db
    .select({
      id: conversations.id,
      contactId: conversations.contactId,
      channelId: conversations.channelId,
      agentId: conversations.agentId,
      status: conversations.status,
      isAiHandling: conversations.isAiHandling,
      aiAssistantId: conversations.aiAssistantId,
      channelType: channels.type,
      provider: channels.provider,
      credentials: channels.credentials,
    })
    .from(conversations)
    .innerJoin(channels, eq(conversations.channelId, channels.id))
    .where(eq(conversations.id, conversationId))
    .limit(1)
  return row || null
}

export async function updateConversationAfterMessage(
  conversationId: string,
  data: { lastMessagePreview: string; lastMessageAt: Date; isAiHandling?: boolean },
) {
  await db
    .update(conversations)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(conversations.id, conversationId))
}

export async function getAgentNames(userIds: string[]) {
  if (userIds.length === 0) return new Map<string, string>()
  const rows = await db
    .select({ id: users.id, fullName: users.fullName })
    .from(users)
    .where(inArray(users.id, userIds))
  return new Map(rows.map((r) => [r.id, r.fullName]))
}
