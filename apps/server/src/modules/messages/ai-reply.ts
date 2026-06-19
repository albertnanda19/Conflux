import * as msgQ from "./queries"
import { previewFromContent } from "./services"
import * as aiQ from "@/modules/ai-assistant/queries"
import { detectHandoff, generateRagReply } from "@/modules/ai-assistant/services"
import { getUserStatusById, findLeastBusyOnlineAgent } from "@/modules/users/queries"
import { assignAgent } from "@/modules/conversations/queries"
import { createContactActivity, findContactById } from "@/modules/contacts/queries"
import { getOrCreateSettings } from "@/modules/settings/queries"
import { notifyUsers } from "@/modules/notifications/services"
import { getAdapter } from "@/modules/channels/registry"
import { resolveCredentials } from "@/modules/channels/credentials"
import { isWithinWorkingHours, oooMessageOf } from "@/lib/working-hours"
import { aiQueue, AI_REPLY_JOB } from "@/lib/queues"
import { publishRealtime } from "@/lib/pubsub"
import { conversationRoom, agentRoom, INBOX_ROOM } from "@/lib/ws"
import type { ChannelProvider } from "@/modules/channels/adapter"
import type { MessageResponse } from "./types"

type AssistantRow = typeof import("@/lib/schema").aiAssistants.$inferSelect
type ConversationRow = NonNullable<Awaited<ReturnType<typeof msgQ.getConversationWithChannel>>>

const HISTORY_LIMIT = 10

async function sendAiMessage(
  conversation: ConversationRow,
  text: string,
  isAiHandling: boolean,
): Promise<void> {
  const content = { text }
  const inserted = await msgQ.insertMessage({
    conversationId: conversation.id,
    direction: "outbound",
    senderType: "ai",
    contentType: "text",
    content,
    status: "sent",
  })

  const adapter = getAdapter(conversation.provider as ChannelProvider)
  const recipient = (await msgQ.getContactChannelIdentifier(conversation.contactId, conversation.channelType)) ?? conversation.contactId
  try {
    const result = await adapter.sendMessage({
      credentials: resolveCredentials(conversation.provider, conversation.credentials),
      to: recipient,
      contentType: "text",
      content,
    })
    await msgQ.setMessageDelivery(inserted.id, result.externalMessageId, "sent")
    inserted.externalMessageId = result.externalMessageId
  } catch (err) {
    await msgQ.setMessageDelivery(inserted.id, null, "failed")
    inserted.status = "failed"
    console.error("[AI-Reply] Gagal kirim ke channel:", (err as Error).message)
  }

  const preview = previewFromContent("text", content)
  await msgQ.updateConversationAfterMessage(conversation.id, {
    lastMessagePreview: preview,
    lastMessageAt: inserted.createdAt,
    isAiHandling,
  })

  const payload: MessageResponse = {
    id: inserted.id,
    conversationId: conversation.id,
    direction: "outbound",
    senderType: "ai",
    content: text,
    contentType: "text",
    status: inserted.status,
    createdAt: inserted.createdAt,
  }
  const rooms = [conversationRoom(conversation.id), INBOX_ROOM]
  if (conversation.agentId) rooms.push(agentRoom(conversation.agentId))
  await publishRealtime({ rooms, type: "message:new", data: payload })
  await publishRealtime({
    rooms,
    type: "conversation:updated",
    data: { id: conversation.id, lastMessage: preview, lastMessageAt: inserted.createdAt, isAiHandling },
  })
}

async function resolveAssistant(conversation: ConversationRow): Promise<AssistantRow | null> {
  if (conversation.aiAssistantId) {
    return aiQ.findAssistantById(conversation.aiAssistantId)
  }
  if (conversation.agentId) {
    const byAgent = await aiQ.findAssistantByAgentId(conversation.agentId)
    if (byAgent) return byAgent.status === "active" ? byAgent : null
  }
  return aiQ.findDefaultAssistant()
}

async function buildHistory(conversationId: string) {
  const rows = await msgQ.listMessages(conversationId, HISTORY_LIMIT)
  return [...rows]
    .reverse()
    .filter((r) => r.senderType === "contact" || r.senderType === "agent" || r.senderType === "ai")
    .map((r) => ({
      role: (r.senderType === "contact" ? "user" : "assistant") as "user" | "assistant",
      content: (r.content as { text?: string }).text ?? "",
    }))
    .filter((m) => m.content.trim().length > 0)
}

async function handleHandoff(
  conversation: ConversationRow,
  assistant: AssistantRow,
  contactName: string | undefined,
): Promise<void> {
  const handoffConfig = assistant.handoffConfig as { handoffMessage?: string } | null
  const message = handoffConfig?.handoffMessage?.trim() ||
    "Terima kasih! Saya akan menghubungkan Anda dengan tim kami sebentar lagi."
  await sendAiMessage(conversation, message, false)

  let targetAgentId = assistant.assignedAgentId
  if (!targetAgentId) {
    const agent = await findLeastBusyOnlineAgent()
    targetAgentId = agent?.id ?? null
  }
  if (!targetAgentId) return

  await assignAgent(conversation.id, targetAgentId)
  await createContactActivity({
    contactId: conversation.contactId,
    type: "ai_handoff",
    description: "AI mendeteksi sinyal konversi dan menyerahkan percakapan ke agen.",
    agentId: targetAgentId,
  })
  await publishRealtime({
    rooms: [conversationRoom(conversation.id), agentRoom(targetAgentId), INBOX_ROOM],
    type: "conversation:assigned",
    data: { id: conversation.id, agentId: targetAgentId },
  })
  await notifyUsers([targetAgentId], {
    type: "ai_handoff",
    title: "Handoff dari AI",
    body: contactName ? `AI menyerahkan percakapan dengan ${contactName} ke Anda.` : "AI menyerahkan percakapan ke Anda.",
    conversationId: conversation.id,
  })
}

export async function maybeAutoReply(conversationId: string, inboundText: string, contactName?: string): Promise<void> {
  try {
    const conversation = await msgQ.getConversationWithChannel(conversationId)
    if (!conversation) return
    if (conversation.status === "resolved") return

    const manual = conversation.isAiHandling && !!conversation.aiAssistantId

    if (!manual) {
      const settings = await getOrCreateSettings()
      if (!settings.aiEnabled) return
      if (conversation.agentId) {
        const agent = await getUserStatusById(conversation.agentId)
        if (agent?.status === "online") return
      }
    }

    const assistant = await resolveAssistant(conversation)
    if (!assistant || assistant.status !== "active") return

    if (!manual && !isWithinWorkingHours(assistant.workingHours)) {
      await sendAiMessage(conversation, oooMessageOf(assistant.workingHours), true)
      return
    }

    const maxAiMessages = (assistant.handoffConfig as { maxAiMessages?: number } | null)?.maxAiMessages ?? 0
    const aiCount = await msgQ.countAiMessages(conversationId)
    const overThreshold = maxAiMessages > 0 && aiCount >= maxAiMessages

    if (overThreshold || (inboundText.trim() && detectHandoff(inboundText, assistant.handoffConfig))) {
      await handleHandoff(conversation, assistant, contactName)
      return
    }

    const history = await buildHistory(conversationId)
    if (history.length === 0) return
    const contact = await findContactById(conversation.contactId)
    const reply = await generateRagReply(
      assistant,
      history,
      contact
        ? { fullName: contact.fullName, pipelineStatus: contact.pipelineStatus, source: contact.source, notes: contact.notes }
        : undefined,
    )
    await sendAiMessage(conversation, reply, true)
  } catch (err) {
    console.error("[AI-Reply] Gagal memproses auto-reply:", (err as Error).message)
  }
}

export async function triggerAiReply(conversationId: string, contactName?: string): Promise<void> {
  const rows = await msgQ.listMessages(conversationId, 1)
  const lastInbound = rows.find((r) => r.senderType === "contact")
  const text = (lastInbound?.content as { text?: string } | undefined)?.text ?? ""
  await aiQueue.add(AI_REPLY_JOB, { conversationId, inboundText: text, contactName })
}
