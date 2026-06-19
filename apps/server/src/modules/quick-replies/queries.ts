import { db } from "@/lib/db"
import { quickReplies } from "@/lib/schema"
import { eq } from "drizzle-orm"

const columns = {
  id: quickReplies.id,
  shortcut: quickReplies.shortcut,
  name: quickReplies.name,
  content: quickReplies.content,
  category: quickReplies.category,
}

export async function listQuickReplies() {
  return db.select(columns).from(quickReplies).orderBy(quickReplies.shortcut)
}

export async function findQuickReplyByShortcut(shortcut: string) {
  const [row] = await db.select(columns).from(quickReplies).where(eq(quickReplies.shortcut, shortcut)).limit(1)
  return row || null
}

export async function createQuickReply(data: {
  shortcut: string
  name: string
  content: string
  category?: string
  createdBy?: string
}) {
  const [row] = await db.insert(quickReplies).values(data).returning(columns)
  return row
}

export async function updateQuickReply(
  id: string,
  data: { shortcut?: string; name?: string; content?: string; category?: string },
) {
  const [row] = await db.update(quickReplies).set(data).where(eq(quickReplies.id, id)).returning(columns)
  return row || null
}

export async function deleteQuickReply(id: string) {
  const [deleted] = await db.delete(quickReplies).where(eq(quickReplies.id, id)).returning({ id: quickReplies.id })
  return deleted || null
}
