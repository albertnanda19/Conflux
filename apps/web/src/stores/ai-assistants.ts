import { create } from 'zustand'
import type { AIAssistantStatus } from '@/types/ai'

interface AIAssistantsUIState {
  searchQuery: string
  statusFilter: 'all' | AIAssistantStatus
  setSearchQuery: (q: string) => void
  setStatusFilter: (f: 'all' | AIAssistantStatus) => void
}

export const useAIAssistantsStore = create<AIAssistantsUIState>((set) => ({
  searchQuery: '',
  statusFilter: 'all',
  setSearchQuery: (q) => set({ searchQuery: q }),
  setStatusFilter: (f) => set({ statusFilter: f }),
}))
