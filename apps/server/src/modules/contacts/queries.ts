import { db } from "@/lib/db"
import { contacts, contactChannels, contactActivities } from "@/lib/schema"
import { eq, and, asc, desc, sql, count } from "drizzle-orm"
import type { ListContactsQuery } from "./types"

export async function findContactById(id: string) {
  const [contact] = await db
    .select()
    .from(contacts)
    .where(eq(contacts.id, id))
    .limit(1)

  return contact || null
}

export async function findContactByPhone(phoneNumber: string) {
  const [contact] = await db
    .select()
    .from(contacts)
    .where(eq(contacts.phoneNumber, phoneNumber))
    .limit(1)

  return contact || null
}

export async function findContactChannels(contactId: string) {
  return db
    .select()
    .from(contactChannels)
    .where(eq(contactChannels.contactId, contactId))
}

export async function createContactChannel(data: {
  contactId: string
  channelType: string
  channelIdentifier: string
  isPrimary?: boolean
}) {
  const [row] = await db
    .insert(contactChannels)
    .values(data)
    .onConflictDoNothing()
    .returning()
  return row || null
}

export async function listContacts(query: ListContactsQuery) {
  const conditions = []
  if (query.search) {
    conditions.push(
      sql`(${contacts.fullName} ILIKE ${"%" + query.search + "%"} OR ${contacts.email} ILIKE ${"%" + query.search + "%"} OR ${contacts.phoneNumber} ILIKE ${"%" + query.search + "%"})`
    )
  }
  if (query.pipelineStatus) conditions.push(eq(contacts.pipelineStatus, query.pipelineStatus))
  if (query.assignedAgentId) conditions.push(eq(contacts.assignedAgentId, query.assignedAgentId))
  if (query.source) conditions.push(eq(contacts.source, query.source))

  const where = conditions.length > 0 ? and(...conditions) : undefined
  const orderBy = query.sortOrder === "asc"
    ? asc(contacts[query.sortBy])
    : desc(contacts[query.sortBy])

  const [[{ total }], data] = await Promise.all([
    db.select({ total: count() }).from(contacts).where(where),
    db.select().from(contacts).where(where).orderBy(orderBy).limit(query.limit).offset((query.page - 1) * query.limit),
  ])

  return {
    data,
    meta: {
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
    },
  }
}

export async function createContact(data: {
  fullName?: string
  phoneNumber?: string
  email?: string
  notes?: string
  pipelineStatus?: string
  source?: string
  sourceChannelId?: string
  assignedAgentId?: string
}) {
  const [contact] = await db
    .insert(contacts)
    .values(data)
    .returning()

  return contact
}

export async function updateContact(id: string, data: {
  fullName?: string
  phoneNumber?: string
  email?: string
  notes?: string
  pipelineStatus?: string
  source?: string
  assignedAgentId?: string | null
}) {
  const [contact] = await db
    .update(contacts)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(contacts.id, id))
    .returning()

  return contact || null
}

export async function deleteContact(id: string) {
  const [deleted] = await db
    .delete(contacts)
    .where(eq(contacts.id, id))
    .returning({ id: contacts.id })

  return deleted || null
}

export async function findContactByEmail(email: string) {
  const [contact] = await db
    .select()
    .from(contacts)
    .where(eq(contacts.email, email))
    .limit(1)

  return contact || null
}

export async function findContactByChannelIdentifier(channelType: string, channelIdentifier: string) {
  const [row] = await db
    .select({ contactId: contactChannels.contactId })
    .from(contactChannels)
    .where(and(eq(contactChannels.channelType, channelType), eq(contactChannels.channelIdentifier, channelIdentifier)))
    .limit(1)
  return row?.contactId || null
}

export async function listContactActivities(contactId: string) {
  return db
    .select({
      id: contactActivities.id,
      type: contactActivities.type,
      description: contactActivities.description,
      agentName: contactActivities.agentName,
      createdAt: contactActivities.createdAt,
    })
    .from(contactActivities)
    .where(eq(contactActivities.contactId, contactId))
    .orderBy(desc(contactActivities.createdAt))
}

export async function createContactActivity(data: {
  contactId: string
  type: string
  description: string
  agentId?: string
  agentName?: string
}) {
  const [row] = await db.insert(contactActivities).values(data).returning()
  return row
}
