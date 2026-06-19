export type {
  ChannelType,
  ConversationStatus,
  SenderType,
  MessageDirection,
  MessageStatus,
  MessageContentType,
  PipelineStatus,
  ConversationPriority,
  Label,
  ActivityLog,
  Contact,
  Agent,
  Conversation,
  Message,
  QuickReply,
} from '@/types/inbox'

import type { Label, Agent } from '@/types/inbox'
import { getAgents } from './agents'

export const LABELS: Label[] = [
  { id: 'l1', name: 'Minat Data Science', color: '#4A7AFF' },
  { id: 'l2', name: 'Minat UX Design', color: '#E84393' },
  { id: 'l3', name: 'Follow Up', color: '#FF6B5A' },
  { id: 'l4', name: 'Siap Daftar', color: '#10B981' },
  { id: 'l5', name: 'Dari IG Ads', color: '#7C3AED' },
  { id: 'l6', name: 'Dari WA Organik', color: '#25D366' },
]

export const MOCK_AGENTS: Agent[] = getAgents().map((a) => ({
  id: a.id,
  name: a.name,
  initials: a.initials,
  status: a.status,
  activeConversationCount: a.activeConversationCount,
}))
