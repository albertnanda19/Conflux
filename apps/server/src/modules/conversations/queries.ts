import { db, type DbExecutor } from "@/lib/db"
import { conversations, contacts, channels, users, conversationLabels } from "@/lib/schema"
import { eq, and, or, ilike, asc, desc, sql, count, inArray, gte } from "drizzle-orm"
import type { ListConversationsQuery } from "./types"

const rowColumns = {
  id: conversations.id,
  contactId: conversations.contactId,
  status: conversations.status,
  priority: conversations.priority,
  isAiHandling: conversations.isAiHandling,
  aiAssistantId: conversations.aiAssistantId,
  unreadCount: conversations.unreadCount,
  lastMessagePreview: conversations.lastMessagePreview,
  lastMessageAt: conversations.lastMessageAt,
  channelType: channels.type,
  agentId: users.id,
  agentName: users.fullName,
  agentStatus: users.status,
  contactName: contacts.fullName,
  contactAvatar: contacts.avatarUrl,
  contactPhone: contacts.phoneNumber,
  contactEmail: contacts.email,
  contactSource: contacts.source,
  contactPipelineStatus: contacts.pipelineStatus,
}

const priorityRank = sql`case ${conversations.priority} when 'urgent' then 0 when 'high' then 1 when 'medium' then 2 else 3 end`

export async function listConversations(query: ListConversationsQuery) {
  const conditions = []
  if (query.channel) conditions.push(eq(channels.type, query.channel))
  if (query.status) conditions.push(eq(conversations.status, query.status))
  if (query.agentId) conditions.push(eq(conversations.agentId, query.agentId))
  if (query.contactId) conditions.push(eq(conversations.contactId, query.contactId))
  if (query.datePreset) {
    const since = new Date()
    if (query.datePreset === "today") since.setHours(0, 0, 0, 0)
    else if (query.datePreset === "7d") since.setDate(since.getDate() - 7)
    else if (query.datePreset === "30d") since.setDate(since.getDate() - 30)
    conditions.push(gte(conversations.lastMessageAt, since))
  }
  if (query.search) {
    const term = `%${query.search}%`
    conditions.push(
      or(
        ilike(contacts.fullName, term),
        ilike(contacts.phoneNumber, term),
        ilike(conversations.lastMessagePreview, term),
      ),
    )
  }
  if (query.labelIds && query.labelIds.length > 0) {
    conditions.push(
      inArray(
        conversations.id,
        db
          .select({ id: conversationLabels.conversationId })
          .from(conversationLabels)
          .where(inArray(conversationLabels.labelId, query.labelIds)),
      ),
    )
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined

  const orderBy =
    query.sortBy === "waiting"
      ? [asc(conversations.lastMessageAt)]
      : query.sortBy === "priority"
        ? [priorityRank, desc(conversations.lastMessageAt)]
        : [desc(conversations.lastMessageAt)]

  const baseCount = db
    .select({ total: count() })
    .from(conversations)
    .innerJoin(contacts, eq(conversations.contactId, contacts.id))
    .innerJoin(channels, eq(conversations.channelId, channels.id))
    .leftJoin(users, eq(conversations.agentId, users.id))
    .where(where)

  const baseData = db
    .select(rowColumns)
    .from(conversations)
    .innerJoin(contacts, eq(conversations.contactId, contacts.id))
    .innerJoin(channels, eq(conversations.channelId, channels.id))
    .leftJoin(users, eq(conversations.agentId, users.id))
    .where(where)
    .orderBy(...orderBy)
    .limit(query.limit)
    .offset((query.page - 1) * query.limit)

  const [[{ total }], data] = await Promise.all([baseCount, baseData])
  return { data, total }
}

export async function findConversationDetail(id: string) {
  const [row] = await db
    .select(rowColumns)
    .from(conversations)
    .innerJoin(contacts, eq(conversations.contactId, contacts.id))
    .innerJoin(channels, eq(conversations.channelId, channels.id))
    .leftJoin(users, eq(conversations.agentId, users.id))
    .where(eq(conversations.id, id))
    .limit(1)
  return row || null
}

export async function updateStatus(id: string, status: string) {
  const [row] = await db
    .update(conversations)
    .set({ status, updatedAt: new Date() })
    .where(eq(conversations.id, id))
    .returning({ id: conversations.id, status: conversations.status })
  return row || null
}

export async function setConversationAi(id: string, aiAssistantId: string | null) {
  const [row] = await db
    .update(conversations)
    .set({ aiAssistantId, isAiHandling: aiAssistantId !== null, updatedAt: new Date() })
    .where(eq(conversations.id, id))
    .returning({ id: conversations.id, aiAssistantId: conversations.aiAssistantId, isAiHandling: conversations.isAiHandling })
  return row || null
}

export async function assignAgent(id: string, agentId: string | null, exec: DbExecutor = db) {
  const [row] = await exec
    .update(conversations)
    .set({ agentId, isAiHandling: agentId ? false : undefined, updatedAt: new Date() })
    .where(eq(conversations.id, id))
    .returning({ id: conversations.id, agentId: conversations.agentId })
  return row || null
}

export async function findReusableConversation(contactId: string, channelId: string) {
  const [row] = await db
    .select({ id: conversations.id, agentId: conversations.agentId, status: conversations.status })
    .from(conversations)
    .where(
      and(
        eq(conversations.contactId, contactId),
        eq(conversations.channelId, channelId),
        inArray(conversations.status, ["open", "pending", "snoozed"]),
      ),
    )
    .orderBy(desc(conversations.lastMessageAt))
    .limit(1)
  return row || null
}

export async function createConversation(data: { contactId: string; channelId: string; agentId?: string | null }) {
  const [row] = await db
    .insert(conversations)
    .values({ contactId: data.contactId, channelId: data.channelId, agentId: data.agentId ?? null, status: "open" })
    .returning({ id: conversations.id, agentId: conversations.agentId, status: conversations.status })
  return row
}

export async function applyInbound(id: string, preview: string, lastMessageAt: Date, reopen: boolean) {
  await db
    .update(conversations)
    .set({
      lastMessagePreview: preview,
      lastMessageAt,
      unreadCount: sql`${conversations.unreadCount} + 1`,
      ...(reopen ? { status: "open" } : {}),
      updatedAt: new Date(),
    })
    .where(eq(conversations.id, id))
}

export async function markRead(id: string) {
  const [row] = await db
    .update(conversations)
    .set({ unreadCount: 0, updatedAt: new Date() })
    .where(eq(conversations.id, id))
    .returning({ id: conversations.id, unreadCount: conversations.unreadCount })
  return row || null
}
