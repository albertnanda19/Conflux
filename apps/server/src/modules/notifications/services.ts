import * as q from "./queries"
import { listUserIdsByRoles } from "@/modules/users/queries"
import { publishRealtime } from "@/lib/pubsub"
import { agentRoom } from "@/lib/ws"
import { NotFoundError } from "@/lib/errors"

const QUEUE_ROLES = ["agent", "supervisor", "admin", "super_admin"]

export type NotifyPayload = {
  type: "new_message" | "new_assignment" | "ai_handoff" | "stale_message"
  title: string
  body?: string
  conversationId?: string
}

export async function notifyUsers(userIds: string[], payload: NotifyPayload) {
  const unique = [...new Set(userIds)].filter(Boolean)
  if (unique.length === 0) return
  const created = await q.createNotifications(unique.map((userId) => ({ userId, ...payload })))
  await Promise.all(
    created.map((n) =>
      publishRealtime({
        rooms: [agentRoom(n.userId)],
        type: "notification:new",
        data: {
          id: n.id,
          type: n.type,
          title: n.title,
          body: n.body,
          conversationId: n.conversationId,
          read: n.isRead,
          createdAt: n.createdAt,
        },
      }),
    ),
  )
}

export async function resolveRecipients(conversation: { agentId: string | null }): Promise<string[]> {
  if (conversation.agentId) return [conversation.agentId]
  return listUserIdsByRoles(QUEUE_ROLES)
}

export async function getMyNotifications(userId: string, unreadOnly: boolean) {
  const [data, unreadCount] = await Promise.all([
    q.listByUser(userId, { unreadOnly, limit: 50 }),
    q.countUnread(userId),
  ])
  return {
    data: data.map((n) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      body: n.body ?? "",
      conversationId: n.conversationId ?? undefined,
      read: n.isRead,
      createdAt: n.createdAt,
    })),
    unreadCount,
  }
}

export async function markRead(userId: string, id: string) {
  const row = await q.markRead(id, userId)
  if (!row) throw new NotFoundError("Notifikasi")
  return row
}

export async function markAllRead(userId: string) {
  await q.markAllRead(userId)
  return { success: true }
}
