export type AgentRole = 'super_admin' | 'admin' | 'supervisor' | 'agent'

export interface AgentProfile {
  id: string
  name: string
  email: string
  phone?: string
  initials: string
  role: AgentRole
  team?: string
  status: 'online' | 'busy' | 'offline'
  activeConversationCount: number
  totalConversations: number
  resolvedConversations: number
  avgResponseTime: string
  conversionRate: number
  lastActiveAt: string
  createdAt: string
  maxConversations: number
  timezone: string
  aiAssistantId?: string | null
}

const now = new Date()
const daysAgo = (d: number) => new Date(now.getTime() - d * 86_400_000).toISOString()
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3_600_000).toISOString()

let nextId = 7
let localAgents: AgentProfile[] = [
  {
    id: 'a1', name: 'Sari Dewi', email: 'sari.dewi@example.com', phone: '081234567801',
    initials: 'SD', role: 'admin', team: 'Sales', status: 'online',
    activeConversationCount: 3, totalConversations: 142, resolvedConversations: 128,
    avgResponseTime: '1m 23s', conversionRate: 34, lastActiveAt: now.toISOString(),
    createdAt: daysAgo(90), maxConversations: 15, timezone: 'WIB (UTC+7)',
    aiAssistantId: 'ai-1',
  },
  {
    id: 'a2', name: 'Rizki Pratama', email: 'rizki.pratama@example.com', phone: '081234567802',
    initials: 'RP', role: 'supervisor', team: 'Sales', status: 'online',
    activeConversationCount: 5, totalConversations: 203, resolvedConversations: 187,
    avgResponseTime: '0m 58s', conversionRate: 41, lastActiveAt: hoursAgo(0.5),
    createdAt: daysAgo(120), maxConversations: 20, timezone: 'WIB (UTC+7)',
    aiAssistantId: null,
  },
  {
    id: 'a3', name: 'Nina Kusuma', email: 'nina.kusuma@example.com', phone: '081234567803',
    initials: 'NK', role: 'agent', team: 'Support', status: 'busy',
    activeConversationCount: 8, totalConversations: 176, resolvedConversations: 161,
    avgResponseTime: '2m 05s', conversionRate: 28, lastActiveAt: hoursAgo(1),
    createdAt: daysAgo(65), maxConversations: 10, timezone: 'WIB (UTC+7)',
    aiAssistantId: 'ai-2',
  },
  {
    id: 'a4', name: 'Andi Wijaya', email: 'andi.wijaya@example.com', phone: '081234567804',
    initials: 'AW', role: 'agent', team: 'Marketing', status: 'offline',
    activeConversationCount: 0, totalConversations: 95, resolvedConversations: 88,
    avgResponseTime: '1m 45s', conversionRate: 22, lastActiveAt: daysAgo(1),
    createdAt: daysAgo(45), maxConversations: 10, timezone: 'WIB (UTC+7)',
    aiAssistantId: null,
  },
  {
    id: 'a5', name: 'Maya Putri', email: 'maya.putri@example.com', phone: '081234567805',
    initials: 'MP', role: 'super_admin', team: 'Sales', status: 'online',
    activeConversationCount: 1, totalConversations: 312, resolvedConversations: 298,
    avgResponseTime: '0m 42s', conversionRate: 52, lastActiveAt: now.toISOString(),
    createdAt: daysAgo(180), maxConversations: 20, timezone: 'WIB (UTC+7)',
    aiAssistantId: null,
  },
  {
    id: 'a6', name: 'Dimas Ramadhan', email: 'dimas.ramadhan@example.com', phone: '081234567806',
    initials: 'DR', role: 'agent', team: 'Support', status: 'online',
    activeConversationCount: 4, totalConversations: 67, resolvedConversations: 59,
    avgResponseTime: '1m 12s', conversionRate: 19, lastActiveAt: now.toISOString(),
    createdAt: daysAgo(30), maxConversations: 10, timezone: 'WIB (UTC+7)',
    aiAssistantId: null,
  },
]

export function getAgents(): AgentProfile[] {
  return [...localAgents]
}

export function getAgentById(id: string): AgentProfile | undefined {
  return localAgents.find((a) => a.id === id)
}

export function createAgent(data: Omit<AgentProfile, 'id' | 'initials' | 'createdAt' | 'totalConversations' | 'resolvedConversations' | 'avgResponseTime' | 'conversionRate' | 'lastActiveAt'>): AgentProfile {
  const words = data.name.trim().split(/\s+/)
  const initials = words.length >= 2
    ? (words[0][0] + words[words.length - 1][0]).toUpperCase()
    : data.name.slice(0, 2).toUpperCase()

  const agent: AgentProfile = {
    ...data,
    id: `a${nextId++}`,
    initials,
    totalConversations: 0,
    resolvedConversations: 0,
    avgResponseTime: '—',
    conversionRate: 0,
    lastActiveAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  }
  localAgents.push(agent)
  return agent
}

export function updateAgent(id: string, data: Partial<Omit<AgentProfile, 'id' | 'createdAt' | 'totalConversations' | 'resolvedConversations'>>): AgentProfile | undefined {
  const idx = localAgents.findIndex((a) => a.id === id)
  if (idx === -1) return undefined
  const updated = { ...localAgents[idx], ...data }
  if (data.name && data.name !== localAgents[idx].name) {
    const words = data.name.trim().split(/\s+/)
    updated.initials = words.length >= 2
      ? (words[0][0] + words[words.length - 1][0]).toUpperCase()
      : data.name.slice(0, 2).toUpperCase()
  }
  localAgents[idx] = updated
  return localAgents[idx]
}

export function deleteAgent(id: string): boolean {
  const idx = localAgents.findIndex((a) => a.id === id)
  if (idx === -1) return false
  localAgents.splice(idx, 1)
  return true
}

export function toggleAgentStatus(id: string): AgentProfile | undefined {
  const idx = localAgents.findIndex((a) => a.id === id)
  if (idx === -1) return undefined
  const cycle: Record<string, string> = { online: 'busy', busy: 'offline', offline: 'online' }
  localAgents[idx] = { ...localAgents[idx], status: cycle[localAgents[idx].status] as AgentProfile['status'] }
  return localAgents[idx]
}
