export type UserRole = "super_admin" | "admin" | "supervisor" | "agent"

export type User = {
  id: string
  email: string
  full_name: string
  role: UserRole
  status: "online" | "busy" | "offline"
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export type ChannelType = "whatsapp" | "instagram" | "facebook" | "livechat" | "telegram"

export type Channel = {
  id: string
  name: string
  type: ChannelType
  is_active: boolean
  created_at: string
}

export type PipelineStatus =
  | "new_lead"
  | "contacted"
  | "qualified"
  | "proposal_sent"
  | "closed_won"
  | "closed_lost"

export type Contact = {
  id: string
  full_name: string
  avatar_url: string | null
  phone_number: string | null
  email: string | null
  notes: string | null
  pipeline_status: PipelineStatus
  source: ChannelType
  assigned_agent_id: string | null
  created_at: string
  updated_at: string
}

export type ConversationStatus = "open" | "pending" | "resolved" | "snoozed"

export type Conversation = {
  id: string
  contact_id: string
  channel_id: string
  agent_id: string | null
  status: ConversationStatus
  is_ai_handling: boolean
  last_message_at: string
  created_at: string
}

export type MessageContentType = "text" | "image" | "video" | "audio" | "file" | "location"

export type Message = {
  id: string
  conversation_id: string
  direction: "inbound" | "outbound"
  sender_type: "contact" | "agent" | "ai" | "system"
  sender_id: string | null
  content_type: MessageContentType
  content: Record<string, unknown>
  status: "sent" | "delivered" | "read" | "failed"
  created_at: string
}

export type Label = {
  id: string
  name: string
  color: string
  created_by: string
  created_at: string
}

export type CampaignStatus = "draft" | "scheduled" | "running" | "completed" | "cancelled"

export type Campaign = {
  id: string
  name: string
  status: CampaignStatus
  channel_id: string
  scheduled_at: string | null
  total_recipients: number
  sent_count: number
  delivered_count: number
  read_count: number
  replied_count: number
  created_by: string
  created_at: string
}

export type TemplateCategory = "sapaan" | "info_program" | "harga" | "jadwal" | "follow_up" | "closing"

export type MessageTemplate = {
  id: string
  name: string
  category: TemplateCategory
  content: Record<string, unknown>
  media_url: string | null
  is_active: boolean
  created_by: string
  created_at: string
}

export type PaginatedResponse<T> = {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    total_pages: number
  }
}

export type ApiResponse<T> = {
  data: T
  message?: string
}
