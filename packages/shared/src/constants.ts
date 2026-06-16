export const CHANNEL_TYPES = {
  whatsapp: "whatsapp",
  instagram: "instagram",
  facebook: "facebook",
  livechat: "livechat",
  telegram: "telegram",
} as const

export type ChannelType = (typeof CHANNEL_TYPES)[keyof typeof CHANNEL_TYPES]

export const CHANNEL_NAMES: Record<ChannelType, string> = {
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  facebook: "Facebook",
  livechat: "Live Chat",
  telegram: "Telegram",
}

export const CHANNEL_COLORS: Record<ChannelType, string> = {
  whatsapp: "#FF6B5A",
  instagram: "#E84393",
  facebook: "#4A7AFF",
  livechat: "#00D4FF",
  telegram: "#7C3AED",
}

export const PIPELINE_STAGES = [
  { id: "new_lead", name: "New Lead", color: "#4A7AFF", order: 1 },
  { id: "contacted", name: "Contacted", color: "#FF6B5A", order: 2 },
  { id: "qualified", name: "Qualified", color: "#E84393", order: 3 },
  { id: "proposal_sent", name: "Proposal Sent", color: "#7C3AED", order: 4 },
  { id: "closed_won", name: "Closed Won", color: "#10B981", order: 5 },
  { id: "closed_lost", name: "Closed Lost", color: "#888888", order: 6 },
] as const

export type PipelineStageId = (typeof PIPELINE_STAGES)[number]["id"]

export const USER_ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  SUPERVISOR: "supervisor",
  AGENT: "agent",
} as const

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  super_admin: 4,
  admin: 3,
  supervisor: 2,
  agent: 1,
}

export const CONVERSATION_STATUSES = ["open", "pending", "resolved", "snoozed"] as const
export type ConversationStatus = (typeof CONVERSATION_STATUSES)[number]

export const MESSAGE_SENDER_TYPES = ["contact", "agent", "ai", "system"] as const
export type SenderType = (typeof MESSAGE_SENDER_TYPES)[number]

export const MESSAGE_CONTENT_TYPES = ["text", "image", "video", "audio", "file", "location"] as const
export type MessageContentType = (typeof MESSAGE_CONTENT_TYPES)[number]

export const TEMPLATE_CATEGORIES = [
  "sapaan",
  "info_program",
  "harga",
  "jadwal",
  "follow_up",
  "closing",
] as const
export type TemplateCategory = (typeof TEMPLATE_CATEGORIES)[number]

export const CAMPAIGN_STATUSES = ["draft", "scheduled", "running", "completed", "cancelled"] as const
export type CampaignStatus = (typeof CAMPAIGN_STATUSES)[number]

export const KB_CATEGORIES = [
  "program",
  "harga",
  "jadwal",
  "syarat",
  "faq",
  "umum",
] as const
export type KbCategory = (typeof KB_CATEGORIES)[number]

export const PROCESSING_STATUSES = ["pending", "processing", "completed", "failed"] as const
export type ProcessingStatus = (typeof PROCESSING_STATUSES)[number]
