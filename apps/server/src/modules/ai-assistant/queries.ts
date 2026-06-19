import { db } from "@/lib/db"
import { aiAssistants, users } from "@/lib/schema"
import { and, asc, desc, eq, sql, count } from "drizzle-orm"
import type { CreateAssistantInput, UpdateAssistantInput, ListAssistantsQuery } from "./types"

export async function listAssistants(query: ListAssistantsQuery) {
  const conditions = []
  if (query.search) {
    conditions.push(sql`(${aiAssistants.name} ILIKE ${"%" + query.search + "%"} OR ${aiAssistants.description} ILIKE ${"%" + query.search + "%"} OR ${aiAssistants.personaName} ILIKE ${"%" + query.search + "%"})`)
  }
  if (query.status) conditions.push(eq(aiAssistants.status, query.status))
  const where = conditions.length > 0 ? and(...conditions) : undefined

  const [[{ total }], data] = await Promise.all([
    db.select({ total: count() }).from(aiAssistants).where(where),
    db.select().from(aiAssistants).where(where).orderBy(desc(aiAssistants.isDefault), asc(aiAssistants.name)).limit(query.limit).offset((query.page - 1) * query.limit),
  ])
  return { data, meta: { total, page: query.page, limit: query.limit } }
}

export async function findAssistantById(id: string) {
  const [row] = await db.select().from(aiAssistants).where(eq(aiAssistants.id, id)).limit(1)
  return row || null
}

export async function findAssistantByAgentId(agentId: string) {
  const [row] = await db.select().from(aiAssistants).where(eq(aiAssistants.assignedAgentId, agentId)).limit(1)
  return row || null
}

export async function findDefaultAssistant() {
  const [row] = await db
    .select()
    .from(aiAssistants)
    .where(and(eq(aiAssistants.isDefault, true), eq(aiAssistants.status, "active")))
    .limit(1)
  return row || null
}

export async function createAssistant(data: CreateAssistantInput & { createdBy: string }) {
  const [row] = await db.insert(aiAssistants).values(data).returning()
  return row!
}

export async function updateAssistant(id: string, input: UpdateAssistantInput) {
  const [row] = await db.update(aiAssistants).set({ ...input, updatedAt: new Date() }).where(eq(aiAssistants.id, id)).returning()
  return row!
}

export async function deleteAssistant(id: string) {
  await db.delete(aiAssistants).where(eq(aiAssistants.id, id))
}

export async function assignAgent(assistantId: string, agentId: string | null) {
  return db.transaction(async (tx) => {
    if (agentId) {
      await tx.update(aiAssistants).set({ assignedAgentId: null, updatedAt: new Date() }).where(eq(aiAssistants.assignedAgentId, agentId))
    }
    const [row] = await tx.update(aiAssistants).set({ assignedAgentId: agentId, updatedAt: new Date() }).where(eq(aiAssistants.id, assistantId)).returning()
    return row!
  })
}

export async function findAgentById(agentId: string) {
  const [row] = await db.select({ id: users.id, role: users.role }).from(users).where(eq(users.id, agentId)).limit(1)
  return row || null
}
