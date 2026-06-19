import * as q from "./queries"
import { NotFoundError, ConflictError } from "@/lib/errors"
import type { CreateContactInput, UpdateContactInput, ListContactsQuery } from "./types"

export async function listContacts(query: ListContactsQuery) {
  return q.listContacts(query)
}

export async function getContactDetail(id: string) {
  const contact = await q.findContactById(id)
  if (!contact) throw new NotFoundError("Kontak")

  const [channels, activities] = await Promise.all([
    q.findContactChannels(id),
    q.listContactActivities(id),
  ])

  return {
    id: contact.id,
    name: contact.fullName,
    avatarUrl: contact.avatarUrl,
    phone: contact.phoneNumber,
    email: contact.email,
    notes: contact.notes,
    pipelineStatus: contact.pipelineStatus,
    source: contact.source,
    channelIdentifiers: channels.map((c) => ({ channel: c.channelType, identifier: c.channelIdentifier })),
    activityLog: activities.map((a) => ({
      id: a.id,
      type: a.type,
      description: a.description,
      agentName: a.agentName ?? undefined,
      createdAt: a.createdAt,
    })),
    createdAt: contact.createdAt,
  }
}

export async function createContact(input: CreateContactInput) {
  if (input.phoneNumber) {
    const existing = await q.findContactByPhone(input.phoneNumber)
    if (existing) throw new ConflictError("Kontak dengan nomor telepon ini sudah ada.")
  }
  return q.createContact(input)
}

export async function updateContact(id: string, input: UpdateContactInput) {
  const updated = await q.updateContact(id, input)
  if (!updated) throw new NotFoundError("Kontak")
  return updated
}

export async function deleteContact(id: string) {
  const deleted = await q.deleteContact(id)
  if (!deleted) throw new NotFoundError("Kontak")
  return deleted
}

export async function getContactActivities(id: string) {
  const contact = await q.findContactById(id)
  if (!contact) throw new NotFoundError("Kontak")
  return q.listContactActivities(id)
}
