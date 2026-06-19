import { db } from "@/lib/db"
import { labels, conversationLabels } from "@/lib/schema"
import { eq, and, inArray, sql } from "drizzle-orm"

export async function listLabels() {
  return db
    .select({
      id: labels.id,
      name: labels.name,
      color: labels.color,
      conversationCount: sql<number>`count(${conversationLabels.conversationId})`.mapWith(Number),
    })
    .from(labels)
    .leftJoin(conversationLabels, eq(conversationLabels.labelId, labels.id))
    .groupBy(labels.id)
    .orderBy(labels.name)
}

export async function findLabelById(id: string) {
  const [label] = await db
    .select({ id: labels.id, name: labels.name, color: labels.color })
    .from(labels)
    .where(eq(labels.id, id))
    .limit(1)
  return label || null
}

export async function createLabel(data: { name: string; color: string; createdBy?: string }) {
  const [label] = await db
    .insert(labels)
    .values(data)
    .returning({ id: labels.id, name: labels.name, color: labels.color })
  return label
}

export async function updateLabel(id: string, data: { name?: string; color?: string }) {
  const [label] = await db
    .update(labels)
    .set(data)
    .where(eq(labels.id, id))
    .returning({ id: labels.id, name: labels.name, color: labels.color })
  return label || null
}

export async function deleteLabel(id: string) {
  const [deleted] = await db.delete(labels).where(eq(labels.id, id)).returning({ id: labels.id })
  return deleted || null
}

export async function attachLabel(conversationId: string, labelId: string) {
  await db
    .insert(conversationLabels)
    .values({ conversationId, labelId })
    .onConflictDoNothing()
}

export async function detachLabel(conversationId: string, labelId: string) {
  await db
    .delete(conversationLabels)
    .where(and(eq(conversationLabels.conversationId, conversationId), eq(conversationLabels.labelId, labelId)))
}

export async function listLabelsForConversations(conversationIds: string[]) {
  if (conversationIds.length === 0) return []
  return db
    .select({
      conversationId: conversationLabels.conversationId,
      id: labels.id,
      name: labels.name,
      color: labels.color,
    })
    .from(conversationLabels)
    .innerJoin(labels, eq(conversationLabels.labelId, labels.id))
    .where(inArray(conversationLabels.conversationId, conversationIds))
}
