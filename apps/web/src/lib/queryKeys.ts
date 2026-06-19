import type { ConversationFilters } from '@/lib/api/inbox'

export const queryKeys = {
  conversations: (filters: ConversationFilters) => ['conversations', filters] as const,
  conversation: (id: string) => ['conversation', id] as const,
  messages: (conversationId: string) => ['messages', conversationId] as const,
  agents: () => ['agents'] as const,
  labels: () => ['labels'] as const,
  quickReplies: () => ['quickReplies'] as const,
  contact: (id: string) => ['contact', id] as const,
  channels: () => ['channels'] as const,
  aiAssistants: (filters: { search?: string; status?: string }) => ['aiAssistants', filters] as const,
  aiAssistant: (id: string) => ['aiAssistant', id] as const,
  kbDocuments: (filters: Record<string, string | undefined>) => ['kbDocuments', filters] as const,
  kbDocument: (id: string) => ['kbDocument', id] as const,
  aiSettings: () => ['aiSettings'] as const,
}
