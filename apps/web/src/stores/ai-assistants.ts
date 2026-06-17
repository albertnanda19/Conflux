import { create } from 'zustand'
import {
  getAIAssistants,
  createAIAssistant,
  updateAIAssistant,
  deleteAIAssistant,
  toggleAIAssistantStatus,
  type AIAssistant,
  type AIAssistantStatus,
} from '@/mock/ai-assistants'

interface AIAssistantsState {
  assistants: AIAssistant[]
  searchQuery: string
  statusFilter: 'all' | AIAssistantStatus
  setSearchQuery: (q: string) => void
  setStatusFilter: (f: 'all' | AIAssistantStatus) => void
  getFilteredAssistants: () => AIAssistant[]
  addAssistant: (data: Omit<AIAssistant, 'id' | 'createdAt' | 'updatedAt'>) => void
  editAssistant: (id: string, data: Partial<Omit<AIAssistant, 'id' | 'createdAt'>>) => void
  removeAssistant: (id: string) => void
  toggleStatus: (id: string) => void
}

export const useAIAssistantsStore = create<AIAssistantsState>((set, get) => ({
  assistants: getAIAssistants(),
  searchQuery: '',
  statusFilter: 'all',

  setSearchQuery: (q) => set({ searchQuery: q }),
  setStatusFilter: (f) => set({ statusFilter: f }),

  getFilteredAssistants: () => {
    const { assistants, searchQuery, statusFilter } = get()
    let result = [...assistants]
    if (statusFilter !== 'all') {
      result = result.filter((a) => a.status === statusFilter)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.persona.name.toLowerCase().includes(q),
      )
    }
    return result
  },

  addAssistant: (data) => {
    createAIAssistant(data)
    set({ assistants: getAIAssistants() })
  },

  editAssistant: (id, data) => {
    updateAIAssistant(id, data)
    set({ assistants: getAIAssistants() })
  },

  removeAssistant: (id) => {
    deleteAIAssistant(id)
    set({ assistants: getAIAssistants() })
  },

  toggleStatus: (id) => {
    toggleAIAssistantStatus(id)
    set({ assistants: getAIAssistants() })
  },
}))
