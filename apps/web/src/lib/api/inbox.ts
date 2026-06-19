import { api } from './client'
import { API_BASE } from '@/lib/constants'
import type {
  Agent,
  Label,
  Message,
  QuickReply,
  ChannelType,
  ConversationStatus,
  ConversationPriority,
  PipelineStatus,
  MessageContentType,
  ActivityLog,
} from '@/types/inbox'

export type ConversationContact = {
  id: string
  name: string | null
  avatarUrl: string | null
  phone: string | null
  email: string | null
  source: ChannelType | null
  pipelineStatus: PipelineStatus
}

export type ConversationListItem = {
  id: string
  contactId: string
  contact: ConversationContact
  channel: ChannelType
  status: ConversationStatus
  isAiHandling: boolean
  aiAssistantId?: string | null
  priority: ConversationPriority
  unreadCount: number
  lastMessage: string
  lastMessageAt: string | null
  labels: Label[]
  assignedAgent?: Agent
}

export type ConversationDetail = ConversationListItem & {
  aiAssistant?: { id: string; name: string; avatar: string }
  contact: ConversationContact & {
    channelIdentifiers: { channel: ChannelType; identifier: string }[]
  }
}

export type ContactDetail = {
  id: string
  name: string | null
  avatarUrl: string | null
  phone: string | null
  email: string | null
  notes: string | null
  pipelineStatus: PipelineStatus
  source: ChannelType | null
  channelIdentifiers: { channel: ChannelType; identifier: string }[]
  activityLog: ActivityLog[]
  createdAt: string
}

export type LabelWithCount = Label & { conversationCount?: number }

export type SortOption = 'newest' | 'waiting' | 'priority'
export type DatePreset = 'today' | '7d' | '30d'

export type ChannelInstance = {
  id: string
  name: string
  type: string
  provider: string
  isActive: boolean
}

export type ConversationFilters = {
  channel?: ChannelType
  status?: ConversationStatus
  agentId?: string
  contactId?: string
  labelIds?: string[]
  search?: string
  sortBy?: SortOption
  datePreset?: DatePreset
  page?: number
  limit?: number
}

type Paginated<T> = { data: T[]; meta: { total: number; page: number; limit: number; totalPages: number } }

function buildQuery(filters: ConversationFilters): string {
  const p = new URLSearchParams()
  if (filters.channel) p.set('channel', filters.channel)
  if (filters.status) p.set('status', filters.status)
  if (filters.agentId) p.set('agentId', filters.agentId)
  if (filters.contactId) p.set('contactId', filters.contactId)
  if (filters.labelIds?.length) p.set('labelIds', filters.labelIds.join(','))
  if (filters.search) p.set('search', filters.search)
  if (filters.sortBy) p.set('sortBy', filters.sortBy)
  if (filters.datePreset) p.set('datePreset', filters.datePreset)
  p.set('page', String(filters.page ?? 1))
  p.set('limit', String(filters.limit ?? 30))
  return p.toString()
}

export const inboxApi = {
  listConversations: (filters: ConversationFilters) =>
    api.get<Paginated<ConversationListItem>>(`/api/v1/conversations?${buildQuery(filters)}`),
  getConversation: (id: string) => api.get<ConversationDetail>(`/api/v1/conversations/${id}`),
  listMessages: (id: string, cursor?: string) =>
    api.get<{ data: Message[]; nextCursor: string | null }>(
      `/api/v1/conversations/${id}/messages?limit=30${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`,
    ),
  sendMessage: (id: string, body: { contentType: MessageContentType; content: { text?: string; mediaUrl?: string; fileName?: string; fileSize?: string; location?: { lat: number; lng: number; name?: string } } }) =>
    api.post<Message>(`/api/v1/conversations/${id}/messages`, body),
  updateStatus: (id: string, status: ConversationStatus) =>
    api.patch<{ id: string; status: string }>(`/api/v1/conversations/${id}/status`, { status }),
  resolve: (id: string) => api.post<{ id: string; status: string }>(`/api/v1/conversations/${id}/resolve`),
  snooze: (id: string) => api.post<{ id: string; status: string }>(`/api/v1/conversations/${id}/snooze`),
  markRead: (id: string) => api.post<{ id: string; unreadCount: number }>(`/api/v1/conversations/${id}/read`),
  assign: (id: string, agentId: string | null) =>
    api.patch<{ id: string; agentId: string | null }>(`/api/v1/conversations/${id}/assign`, { agentId }),
  transfer: (id: string, agentId: string, note?: string) =>
    api.post<{ id: string; agentId: string | null }>(`/api/v1/conversations/${id}/transfer`, { agentId, note }),
  assignAi: (id: string, aiAssistantId: string) =>
    api.post<ConversationDetail>(`/api/v1/conversations/${id}/assign-ai`, { aiAssistantId }),
  deactivateAi: (id: string) =>
    api.post<ConversationDetail>(`/api/v1/conversations/${id}/deactivate-ai`),
  addLabel: (id: string, labelId: string) => api.post<Label>(`/api/v1/conversations/${id}/labels`, { labelId }),
  removeLabel: (id: string, labelId: string) =>
    api.del<{ conversationId: string; labelId: string }>(`/api/v1/conversations/${id}/labels/${labelId}`),

  listAgents: () => api.get<Agent[]>('/api/v1/users/agents'),
  updateMyStatus: (status: 'online' | 'busy' | 'offline') =>
    api.patch<{ id: string; status: string }>('/api/v1/users/me/status', { status }),

  listChannels: () => api.get<ChannelInstance[]>('/api/v1/channels'),
  createChannel: (body: { name: string; type: string; provider: string; credentials?: Record<string, unknown> }) =>
    api.post<ChannelInstance>('/api/v1/channels', body),
  updateChannel: (id: string, body: { name?: string; isActive?: boolean; credentials?: Record<string, unknown> }) =>
    api.put<ChannelInstance>(`/api/v1/channels/${id}`, body),
  deleteChannel: (id: string) => api.del<{ id: string }>(`/api/v1/channels/${id}`),

  uploadMedia: async (file: File): Promise<{ url: string; fileName: string; fileSize: string; contentType: string }> => {
    const form = new FormData()
    form.append('file', file)
    const token = (document.cookie.match(/(^| )access_token=([^;]+)/) || [])[2]
    const res = await fetch(`${API_BASE}/api/v1/media/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${decodeURIComponent(token)}` } : {},
      body: form,
    })
    const json = await res.json()
    if (!res.ok || !json.success) throw new Error(json.message || 'Gagal mengunggah file.')
    return json.data
  },
  getContact: (id: string) => api.get<ContactDetail>(`/api/v1/contacts/${id}`),
  updateContact: (id: string, body: { notes?: string }) => api.put<ContactDetail>(`/api/v1/contacts/${id}`, body),

  listLabels: () => api.get<LabelWithCount[]>('/api/v1/labels'),
  createLabel: (body: { name: string; color: string }) => api.post<Label>('/api/v1/labels', body),
  updateLabel: (id: string, body: { name?: string; color?: string }) => api.put<Label>(`/api/v1/labels/${id}`, body),
  deleteLabel: (id: string) => api.del<{ id: string }>(`/api/v1/labels/${id}`),

  listQuickReplies: () => api.get<QuickReply[]>('/api/v1/quick-replies'),

  listNotifications: () => api.get<{ data: NotificationItem[]; unreadCount: number }>('/api/v1/notifications'),
  markNotificationRead: (id: string) => api.post<{ id: string }>(`/api/v1/notifications/${id}/read`),
  markAllNotificationsRead: () => api.post<{ success: boolean }>('/api/v1/notifications/read-all'),
}

export type NotificationItem = {
  id: string
  type: 'new_message' | 'new_assignment' | 'ai_handoff' | 'stale_message'
  title: string
  body: string
  conversationId?: string
  read: boolean
  createdAt: string
}
