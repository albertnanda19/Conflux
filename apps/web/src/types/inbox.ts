export type ChannelType = 'whatsapp' | 'instagram' | 'facebook' | 'telegram'

export type ConversationStatus = 'open' | 'pending' | 'resolved' | 'snoozed'

export type SenderType = 'contact' | 'agent' | 'ai' | 'system'

export type MessageDirection = 'inbound' | 'outbound'

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed'

export type MessageContentType = 'text' | 'image' | 'video' | 'document' | 'audio' | 'location' | 'sticker'

export type PipelineStatus =
  | 'new_lead'
  | 'contacted'
  | 'qualified'
  | 'proposal_sent'
  | 'closed_won'
  | 'closed_lost'

export type ConversationPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Label {
  id: string
  name: string
  color: string
}

export interface ActivityLog {
  id: string
  type: 'status_change' | 'assignment' | 'note_added' | 'label_added' | 'message_sent' | 'ai_handoff'
  description: string
  agentName?: string
  createdAt: string
}

export interface Contact {
  id: string
  name: string
  avatarUrl?: string
  phone?: string
  email?: string
  channelIdentifiers: { channel: ChannelType; identifier: string }[]
  pipelineStatus: PipelineStatus
  source: ChannelType
  labels: Label[]
  notes?: string
  activityLog: ActivityLog[]
  createdAt: string
}

export interface Agent {
  id: string
  name: string
  initials: string
  status: 'online' | 'busy' | 'offline'
  activeConversationCount: number
}

export interface Conversation {
  id: string
  contactId: string
  contact: Contact
  channel: ChannelType
  status: ConversationStatus
  isAiHandling: boolean
  aiAssistantId?: string | null
  aiAssistant?: { id: string; name: string; avatar: string }
  assignedAgent?: Agent
  lastMessage: string
  lastMessageAt: string
  unreadCount: number
  labels: Label[]
  priority: ConversationPriority
}

export interface Message {
  id: string
  conversationId: string
  direction: MessageDirection
  senderType: SenderType
  senderName?: string
  content: string
  contentType: MessageContentType
  status: MessageStatus
  createdAt: string
  mediaUrl?: string
  fileName?: string
  fileSize?: string
  location?: { lat: number; lng: number; name?: string }
}

export interface QuickReply {
  id: string
  shortcut: string
  name: string
  content: string
  category: string
}
