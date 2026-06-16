export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000"
export const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:3000"

export const CHANNEL_TYPES = {
  whatsapp: "whatsapp",
  instagram: "instagram",
  facebook: "facebook",
  livechat: "livechat",
  telegram: "telegram",
} as const

export const CHANNEL_COLORS: Record<string, string> = {
  whatsapp: "#FF6B5A",
  instagram: "#E84393",
  facebook: "#4A7AFF",
  livechat: "#00D4FF",
  telegram: "#7C3AED",
}

export const PIPELINE_COLUMNS = [
  { id: "new_lead", name: "New Lead", color: "#4A7AFF" },
  { id: "contacted", name: "Contacted", color: "#FF6B5A" },
  { id: "qualified", name: "Qualified", color: "#E84393" },
  { id: "proposal_sent", name: "Proposal Sent", color: "#7C3AED" },
  { id: "closed_won", name: "Closed Won", color: "#10B981" },
  { id: "closed_lost", name: "Closed Lost", color: "#888888" },
] as const

export const USER_ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  SUPERVISOR: "supervisor",
  AGENT: "agent",
} as const

export const CONVERSATION_STATUSES = {
  open: "open",
  pending: "pending",
  resolved: "resolved",
  snoozed: "snoozed",
} as const
