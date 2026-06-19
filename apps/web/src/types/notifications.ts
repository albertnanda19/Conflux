export type NotificationType = 'new_message' | 'new_assignment' | 'ai_handoff' | 'stale_message'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  body: string
  conversationId?: string
  read: boolean
  createdAt: string
}
