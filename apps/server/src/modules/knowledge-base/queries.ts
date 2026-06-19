import { db } from "@/lib/db"
import { kbDocuments } from "@/lib/schema"
import { and, asc, desc, eq, inArray, isNull, isNotNull, or, sql, count } from "drizzle-orm"
import type { ListKbQuery, UpdateKbInput } from "./types"

const KB_MAX_DISTANCE = Number(process.env.KB_MAX_DISTANCE) || 0.6

const DOC_COLUMNS = {
  id: kbDocuments.id,
  title: kbDocuments.title,
  category: kbDocuments.category,
  fileType: kbDocuments.fileType,
  fileSize: kbDocuments.fileSize,
  chunkCount: kbDocuments.chunkCount,
  processingStatus: kbDocuments.processingStatus,
  isActive: kbDocuments.isActive,
  aiAssistantId: kbDocuments.aiAssistantId,
  originalFileUrl: kbDocuments.originalFileUrl,
  createdBy: kbDocuments.createdBy,
  createdByName: kbDocuments.createdByName,
  createdAt: kbDocuments.createdAt,
  updatedAt: kbDocuments.updatedAt,
}

export async function listParentDocuments(query: ListKbQuery) {
  const conditions = [isNull(kbDocuments.sourceDocumentId)]
  if (query.search) {
    conditions.push(sql`(${kbDocuments.title} ILIKE ${"%" + query.search + "%"} OR ${kbDocuments.category} ILIKE ${"%" + query.search + "%"})`)
  }
  if (query.category) conditions.push(eq(kbDocuments.category, query.category))
  if (query.status) conditions.push(eq(kbDocuments.processingStatus, query.status))
  if (query.scope === "global") conditions.push(isNull(kbDocuments.aiAssistantId))
  else if (query.aiAssistantId) conditions.push(eq(kbDocuments.aiAssistantId, query.aiAssistantId))

  const where = and(...conditions)
  const orderCol = kbDocuments[query.sortBy]
  const orderBy = query.sortOrder === "asc" ? asc(orderCol) : desc(orderCol)

  const [[{ total }], data] = await Promise.all([
    db.select({ total: count() }).from(kbDocuments).where(where),
    db.select(DOC_COLUMNS).from(kbDocuments).where(where).orderBy(orderBy).limit(query.limit).offset((query.page - 1) * query.limit),
  ])
  return { data, meta: { total, page: query.page, limit: query.limit } }
}

export async function findDocumentById(id: string) {
  const [doc] = await db.select().from(kbDocuments).where(eq(kbDocuments.id, id)).limit(1)
  return doc || null
}

export async function createParentDocument(data: {
  title: string
  category: string | null
  aiAssistantId: string | null
  fileType: string
  fileSize: number
  originalFileUrl: string
  createdBy: string
  createdByName: string
}) {
  const [doc] = await db
    .insert(kbDocuments)
    .values({ ...data, processingStatus: "pending" })
    .returning(DOC_COLUMNS)
  return doc!
}

export async function updateParentDocument(id: string, input: UpdateKbInput) {
  const [doc] = await db
    .update(kbDocuments)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(kbDocuments.id, id))
    .returning(DOC_COLUMNS)
  if (input.isActive !== undefined) {
    await db.update(kbDocuments).set({ isActive: input.isActive }).where(eq(kbDocuments.sourceDocumentId, id))
  }
  return doc!
}

export async function deleteDocument(id: string) {
  await db.delete(kbDocuments).where(or(eq(kbDocuments.id, id), eq(kbDocuments.sourceDocumentId, id)))
}

export async function searchChunks(
  embedding: number[],
  scope: { mode: "global" | "custom"; documentIds: string[] },
  limit = 5,
): Promise<{ title: string; content: string }[]> {
  const literal = `[${embedding.join(",")}]`
  const conditions = [
    isNotNull(kbDocuments.sourceDocumentId),
    eq(kbDocuments.isActive, true),
    eq(kbDocuments.processingStatus, "completed"),
  ]
  if (scope.mode === "global") {
    conditions.push(isNull(kbDocuments.aiAssistantId))
  } else {
    if (scope.documentIds.length === 0) return []
    conditions.push(inArray(kbDocuments.sourceDocumentId, scope.documentIds))
  }

  const candidates = (await db
    .select({
      title: kbDocuments.title,
      content: kbDocuments.content,
      distance: sql<number>`${kbDocuments.embedding} <=> ${literal}::vector`,
    })
    .from(kbDocuments)
    .where(and(...conditions))
    .orderBy(sql`${kbDocuments.embedding} <=> ${literal}::vector`)
    .limit(Math.max(limit, 8))) as { title: string; content: string; distance: number }[]

  const seen = new Set<string>()
  const result: { title: string; content: string }[] = []
  for (const c of candidates) {
    if (c.distance > KB_MAX_DISTANCE) continue
    const key = c.content.trim()
    if (seen.has(key)) continue
    seen.add(key)
    result.push({ title: c.title, content: c.content })
    if (result.length >= limit) break
  }
  return result
}
