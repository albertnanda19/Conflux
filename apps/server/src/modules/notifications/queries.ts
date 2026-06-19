import { db } from "@/lib/db"
import { notifications } from "@/lib/schema"
import { eq, and, desc, count } from "drizzle-orm"

const columns = {
  id: notifications.id,
  userId: notifications.userId,
  type: notifications.type,
  title: notifications.title,
  body: notifications.body,
  conversationId: notifications.conversationId,
  isRead: notifications.isRead,
  createdAt: notifications.createdAt,
}

export type NewNotification = {
  userId: string
  type: string
  title: string
  body?: string
  conversationId?: string
}

export async function createNotifications(rows: NewNotification[]) {
  if (rows.length === 0) return []
  return db.insert(notifications).values(rows).returning(columns)
}

export async function listByUser(userId: string, opts: { unreadOnly?: boolean; limit: number }) {
  const conds = [eq(notifications.userId, userId)]
  if (opts.unreadOnly) conds.push(eq(notifications.isRead, false))
  return db
    .select(columns)
    .from(notifications)
    .where(and(...conds))
    .orderBy(desc(notifications.createdAt))
    .limit(opts.limit)
}

export async function countUnread(userId: string) {
  const [row] = await db
    .select({ total: count() })
    .from(notifications)
    .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)))
  return row?.total ?? 0
}

export async function markRead(id: string, userId: string) {
  const [row] = await db
    .update(notifications)
    .set({ isRead: true })
    .where(and(eq(notifications.id, id), eq(notifications.userId, userId)))
    .returning({ id: notifications.id })
  return row || null
}

export async function markAllRead(userId: string) {
  await db.update(notifications).set({ isRead: true }).where(eq(notifications.userId, userId))
}
