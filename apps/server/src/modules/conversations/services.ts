import * as q from "./queries"
import { listLabelsForConversations, findLabelById, attachLabel, detachLabel } from "@/modules/labels/queries"
import { findContactChannels, createContactActivity } from "@/modules/contacts/queries"
import { findAssistantById } from "@/modules/ai-assistant/queries"
import { triggerAiReply } from "@/modules/messages/ai-reply"
import { computeInitials } from "@/modules/users/services"
import { notifyUsers } from "@/modules/notifications/services"
import { publishRealtime } from "@/lib/pubsub"
import { conversationRoom, agentRoom, INBOX_ROOM } from "@/lib/ws"
import { NotFoundError, BadRequestError } from "@/lib/errors"
import type { JwtPayload } from "@/lib/auth"
import type { ListConversationsQuery, TransferInput } from "./types"

type Row = Awaited<ReturnType<typeof q.findConversationDetail>>
type LabelLite = { id: string; name: string; color: string }

function mapRow(row: NonNullable<Row>, labels: LabelLite[]) {
  return {
    id: row.id,
    contactId: row.contactId,
    contact: {
      id: row.contactId,
      name: row.contactName,
      avatarUrl: row.contactAvatar,
      phone: row.contactPhone,
      email: row.contactEmail,
      source: row.contactSource,
      pipelineStatus: row.contactPipelineStatus,
    },
    channel: row.channelType,
    status: row.status,
    isAiHandling: row.isAiHandling,
    aiAssistantId: row.aiAssistantId,
    priority: row.priority,
    unreadCount: row.unreadCount,
    lastMessage: row.lastMessagePreview ?? "",
    lastMessageAt: row.lastMessageAt,
    labels,
    assignedAgent: row.agentId
      ? {
          id: row.agentId,
          name: row.agentName!,
          initials: computeInitials(row.agentName!),
          status: row.agentStatus!,
          activeConversationCount: 0,
        }
      : undefined,
  }
}

export async function listConversations(query: ListConversationsQuery) {
  const { data, total } = await q.listConversations(query)
  const ids = data.map((r) => r.id)
  const labelRows = await listLabelsForConversations(ids)
  const labelsByConv = new Map<string, LabelLite[]>()
  for (const l of labelRows) {
    const arr = labelsByConv.get(l.conversationId) ?? []
    arr.push({ id: l.id, name: l.name, color: l.color })
    labelsByConv.set(l.conversationId, arr)
  }
  return {
    data: data.map((r) => mapRow(r, labelsByConv.get(r.id) ?? [])),
    meta: { total, page: query.page, limit: query.limit, totalPages: Math.ceil(total / query.limit) },
  }
}

export async function getConversationDetail(id: string) {
  const row = await q.findConversationDetail(id)
  if (!row) throw new NotFoundError("Percakapan")
  const [labelRows, channels] = await Promise.all([
    listLabelsForConversations([id]),
    findContactChannels(row.contactId),
  ])
  const base = mapRow(row, labelRows.map((l) => ({ id: l.id, name: l.name, color: l.color })))
  const aiAssistant = row.aiAssistantId ? await findAssistantById(row.aiAssistantId) : null
  return {
    ...base,
    aiAssistant: aiAssistant ? { id: aiAssistant.id, name: aiAssistant.name, avatar: aiAssistant.avatar } : undefined,
    contact: {
      ...base.contact,
      channelIdentifiers: channels.map((c) => ({ channel: c.channelType, identifier: c.channelIdentifier })),
    },
  }
}

export async function assignAiAssistant(id: string, aiAssistantId: string) {
  const conv = await q.findConversationDetail(id)
  if (!conv) throw new NotFoundError("Percakapan")
  const assistant = await findAssistantById(aiAssistantId)
  if (!assistant) throw new NotFoundError("AI Assistant")
  if (assistant.status !== "active") throw new BadRequestError("AI Assistant tidak aktif. Aktifkan dulu sebelum di-assign.")

  await q.setConversationAi(id, aiAssistantId)
  await createContactActivity({
    contactId: conv.contactId,
    type: "ai_assigned",
    description: `AI Assistant "${assistant.name}" di-assign ke percakapan.`,
  })
  await emitUpdated(id, conv.agentId, { id, isAiHandling: true, aiAssistantId })
  await triggerAiReply(id, conv.contactName ?? undefined)
  return getConversationDetail(id)
}

export async function deactivateAi(id: string) {
  const conv = await q.findConversationDetail(id)
  if (!conv) throw new NotFoundError("Percakapan")
  await q.setConversationAi(id, null)
  await emitUpdated(id, conv.agentId, { id, isAiHandling: false, aiAssistantId: null })
  return getConversationDetail(id)
}

async function emitUpdated(id: string, agentId: string | null, data: unknown) {
  const rooms = [conversationRoom(id), INBOX_ROOM]
  if (agentId) rooms.push(agentRoom(agentId))
  await publishRealtime({ rooms, type: "conversation:updated", data })
}

export async function changeStatus(id: string, status: string) {
  const updated = await q.updateStatus(id, status)
  if (!updated) throw new NotFoundError("Percakapan")
  await emitUpdated(id, null, updated)
  return updated
}

export async function resolveConversation(id: string) {
  return changeStatus(id, "resolved")
}

export async function snoozeConversation(id: string) {
  return changeStatus(id, "snoozed")
}

export async function markRead(id: string) {
  const updated = await q.markRead(id)
  if (!updated) throw new NotFoundError("Percakapan")
  await emitUpdated(id, null, updated)
  return updated
}

export async function assignConversation(id: string, agentId: string | null) {
  const conv = await q.findConversationDetail(id)
  if (!conv) throw new NotFoundError("Percakapan")

  const updated = await q.assignAgent(id, agentId)

  if (agentId) {
    await createContactActivity({
      contactId: conv.contactId,
      type: "assignment",
      description: "Percakapan ditugaskan ke agen.",
      agentId,
    })
    await publishRealtime({
      rooms: [conversationRoom(id), agentRoom(agentId), INBOX_ROOM],
      type: "conversation:assigned",
      data: { id, agentId },
    })
    await notifyUsers([agentId], {
      type: "new_assignment",
      title: "Percakapan ditugaskan",
      body: conv.contactName ? `Percakapan dengan ${conv.contactName} ditugaskan ke Anda.` : "Sebuah percakapan ditugaskan ke Anda.",
      conversationId: id,
    })
  }
  await emitUpdated(id, agentId, updated)
  return updated
}

export async function transferConversation(id: string, input: TransferInput, by: JwtPayload) {
  const conv = await q.findConversationDetail(id)
  if (!conv) throw new NotFoundError("Percakapan")

  const updated = await q.assignAgent(id, input.agentId)
  await createContactActivity({
    contactId: conv.contactId,
    type: "assignment",
    description: input.note ? `Transfer percakapan: ${input.note}` : "Percakapan ditransfer ke agen lain.",
    agentId: by.sub,
  })
  await publishRealtime({
    rooms: [conversationRoom(id), agentRoom(input.agentId), INBOX_ROOM],
    type: "conversation:assigned",
    data: { id, agentId: input.agentId, note: input.note },
  })
  await notifyUsers([input.agentId], {
    type: "new_assignment",
    title: "Percakapan ditransfer",
    body: conv.contactName ? `Percakapan dengan ${conv.contactName} ditransfer ke Anda.` : "Sebuah percakapan ditransfer ke Anda.",
    conversationId: id,
  })
  await emitUpdated(id, input.agentId, updated)
  return updated
}

export async function addLabel(conversationId: string, labelId: string) {
  const conv = await q.findConversationDetail(conversationId)
  if (!conv) throw new NotFoundError("Percakapan")
  const label = await findLabelById(labelId)
  if (!label) throw new NotFoundError("Label")
  await attachLabel(conversationId, labelId)
  await emitUpdated(conversationId, conv.agentId, { id: conversationId })
  return label
}

export async function removeLabel(conversationId: string, labelId: string) {
  const conv = await q.findConversationDetail(conversationId)
  if (!conv) throw new NotFoundError("Percakapan")
  await detachLabel(conversationId, labelId)
  await emitUpdated(conversationId, conv.agentId, { id: conversationId })
  return { conversationId, labelId }
}
