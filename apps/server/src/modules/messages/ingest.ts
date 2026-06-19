import * as contactQ from "@/modules/contacts/queries"
import * as convQ from "@/modules/conversations/queries"
import * as msgQ from "./queries"
import { previewFromContent } from "./services"
import { notifyUsers, resolveRecipients } from "@/modules/notifications/services"
import { autoAssign } from "@/modules/conversations/auto-assign"
import { aiQueue, AI_REPLY_JOB } from "@/lib/queues"
import { publishRealtime } from "@/lib/pubsub"
import { conversationRoom, agentRoom, INBOX_ROOM } from "@/lib/ws"
import type { NormalizedInbound } from "@/modules/channels/adapter"
import type { MessageResponse } from "./types"

export type IngestResult = {
  contactId: string
  conversationId: string
  messageId: string
  isNewContact: boolean
  isNewConversation: boolean
}

export async function ingestInbound(channelId: string, inbound: NormalizedInbound): Promise<IngestResult> {
  let contactId = await contactQ.findContactByChannelIdentifier(inbound.channelType, inbound.channelIdentifier)
  let isNewContact = false

  if (!contactId) {
    const contact = await contactQ.createContact({
      fullName: inbound.contactName,
      source: inbound.channelType,
      sourceChannelId: channelId,
      pipelineStatus: "new_lead",
      ...(inbound.channelType === "whatsapp" ? { phoneNumber: inbound.channelIdentifier } : {}),
    })
    contactId = contact.id
    isNewContact = true
    await contactQ.createContactChannel({
      contactId,
      channelType: inbound.channelType,
      channelIdentifier: inbound.channelIdentifier,
      isPrimary: true,
    })
    await contactQ.createContactActivity({
      contactId,
      type: "message_sent",
      description: `Kontak baru masuk via ${inbound.channelType}.`,
    })
  }

  let conversation = await convQ.findReusableConversation(contactId, channelId)
  let isNewConversation = false
  if (!conversation) {
    conversation = await convQ.createConversation({ contactId, channelId })
    isNewConversation = true
    const assignedAgentId = await autoAssign(conversation.id, contactId, inbound.contactName)
    if (assignedAgentId) conversation = { ...conversation, agentId: assignedAgentId }
  }

  const message = await msgQ.insertMessage({
    conversationId: conversation.id,
    direction: "inbound",
    senderType: "contact",
    senderId: contactId,
    contentType: inbound.contentType,
    content: inbound.content,
    status: "delivered",
    externalMessageId: inbound.externalMessageId,
  })

  const preview = previewFromContent(inbound.contentType, inbound.content)
  const lastMessageAt = message.createdAt
  await convQ.applyInbound(conversation.id, preview, lastMessageAt, conversation.status === "snoozed")

  const rooms = [conversationRoom(conversation.id), INBOX_ROOM]
  if (conversation.agentId) rooms.push(agentRoom(conversation.agentId))

  const messagePayload: MessageResponse = {
    id: message.id,
    conversationId: conversation.id,
    direction: "inbound",
    senderType: "contact",
    content: inbound.content.text ?? "",
    contentType: inbound.contentType,
    status: "delivered",
    createdAt: message.createdAt,
    mediaUrl: inbound.content.mediaUrl,
    fileName: inbound.content.fileName,
    fileSize: inbound.content.fileSize,
    location: inbound.content.location,
  }

  await publishRealtime({ rooms, type: "message:new", data: messagePayload })
  await publishRealtime({
    rooms,
    type: "conversation:updated",
    data: { id: conversation.id, lastMessage: preview, lastMessageAt },
  })

  const recipients = await resolveRecipients({ agentId: conversation.agentId })
  await notifyUsers(recipients, {
    type: "new_message",
    title: inbound.contactName ? `Pesan baru dari ${inbound.contactName}` : "Pesan baru",
    body: preview,
    conversationId: conversation.id,
  })

  await aiQueue.add(AI_REPLY_JOB, {
    conversationId: conversation.id,
    inboundText: inbound.content.text ?? "",
    contactName: inbound.contactName,
  })

  return {
    contactId,
    conversationId: conversation.id,
    messageId: message.id,
    isNewContact,
    isNewConversation,
  }
}
