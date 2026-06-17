import { create } from 'zustand'
import { getAgents, getAgentById, createAgent, updateAgent, deleteAgent, toggleAgentStatus, type AgentProfile, type AgentRole } from '@/mock/agents'

interface AgentsState {
  agents: AgentProfile[]
  searchQuery: string
  roleFilter: AgentRole | null
  statusFilter: AgentProfile['status'] | null
  sortBy: 'name' | 'status' | 'conversations' | 'conversion'

  setSearchQuery: (query: string) => void
  setRoleFilter: (role: AgentRole | null) => void
  setStatusFilter: (status: AgentProfile['status'] | null) => void
  setSortBy: (sort: AgentsState['sortBy']) => void

  addAgent: (data: Parameters<typeof createAgent>[0]) => AgentProfile
  editAgent: (id: string, data: Parameters<typeof updateAgent>[1]) => AgentProfile | undefined
  removeAgent: (id: string) => boolean
  cycleStatus: (id: string) => AgentProfile | undefined
  getAgent: (id: string) => AgentProfile | undefined

  getFilteredAgents: () => AgentProfile[]
}

export const useAgentsStore = create<AgentsState>((set, get) => ({
  agents: getAgents(),
  searchQuery: '',
  roleFilter: null,
  statusFilter: null,
  sortBy: 'name',

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setRoleFilter: (roleFilter) => set({ roleFilter }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setSortBy: (sortBy) => set({ sortBy }),

  addAgent: (data) => {
    const agent = createAgent(data)
    set({ agents: getAgents() })
    return agent
  },

  editAgent: (id, data) => {
    const agent = updateAgent(id, data)
    if (agent) set({ agents: getAgents() })
    return agent
  },

  removeAgent: (id) => {
    const ok = deleteAgent(id)
    if (ok) set({ agents: getAgents() })
    return ok
  },

  cycleStatus: (id) => {
    const agent = toggleAgentStatus(id)
    if (agent) set({ agents: getAgents() })
    return agent
  },

  getAgent: (id) => getAgentById(id),

  getFilteredAgents: () => {
    const { agents, searchQuery, roleFilter, statusFilter, sortBy } = get()
    let filtered = agents

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (a) => a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q),
      )
    }
    if (roleFilter) {
      filtered = filtered.filter((a) => a.role === roleFilter)
    }
    if (statusFilter) {
      filtered = filtered.filter((a) => a.status === statusFilter)
    }

    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'status') return a.status.localeCompare(b.status)
      if (sortBy === 'conversations') return b.activeConversationCount - a.activeConversationCount
      return b.conversionRate - a.conversionRate
    })

    return filtered
  },
}))
