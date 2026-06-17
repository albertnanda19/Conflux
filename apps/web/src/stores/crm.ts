import { create } from 'zustand'
import {
  MOCK_CRM_CONTACTS,
  DEFAULT_PIPELINE_COLUMNS,
  type CrmContact,
  type PipelineColumn,
} from '@/mock/crm'
import type { PipelineStatus, ChannelType } from '@/mock/inbox'

interface CrmState {
  contacts: CrmContact[]
  columns: PipelineColumn[]
  agentFilter: string | null
  programFilter: string | null
  sourceFilter: ChannelType | null

  setAgentFilter: (agentId: string | null) => void
  setProgramFilter: (program: string | null) => void
  setSourceFilter: (source: ChannelType | null) => void
  resetFilters: () => void

  moveContact: (contactId: string, newStatus: PipelineStatus) => void
  renameColumn: (columnId: string, newName: string) => void
  addColumn: (name: string, color: string) => void
  removeColumn: (columnId: string) => boolean
  getFilteredContacts: () => CrmContact[]
}

export const useCrmStore = create<CrmState>((set, get) => ({
  contacts: [...MOCK_CRM_CONTACTS],
  columns: [...DEFAULT_PIPELINE_COLUMNS],
  agentFilter: null,
  programFilter: null,
  sourceFilter: null,

  setAgentFilter: (agentId) => set({ agentFilter: agentId }),
  setProgramFilter: (program) => set({ programFilter: program }),
  setSourceFilter: (source) => set({ sourceFilter: source }),
  resetFilters: () => set({ agentFilter: null, programFilter: null, sourceFilter: null }),

  moveContact: (contactId, newStatus) =>
    set((s) => ({
      contacts: s.contacts.map((c) =>
        c.id === contactId ? { ...c, pipelineStatus: newStatus } : c,
      ),
    })),

  renameColumn: (columnId, newName) =>
    set((s) => ({
      columns: s.columns.map((col) =>
        col.id === columnId ? { ...col, name: newName } : col,
      ),
    })),

  addColumn: (name, color) => {
    const slug = name.trim().toLowerCase().replace(/\s+/g, '_')
    const id = `custom_${slug}_${Date.now()}`
    set((s) => ({
      columns: [...s.columns, { id, name: name.trim(), color }],
    }))
  },

  removeColumn: (columnId) => {
    const { columns, contacts } = get()
    if (columns.length <= 1) return false
    if (contacts.some((c) => c.pipelineStatus === columnId)) return false
    set({ columns: columns.filter((col) => col.id !== columnId) })
    return true
  },

  getFilteredContacts: () => {
    const { contacts, agentFilter, programFilter, sourceFilter } = get()
    let filtered = contacts
    if (agentFilter) {
      filtered = filtered.filter((c) => c.assignedAgentId === agentFilter)
    }
    if (programFilter) {
      filtered = filtered.filter((c) => c.programInterest === programFilter)
    }
    if (sourceFilter) {
      filtered = filtered.filter((c) => c.source === sourceFilter)
    }
    return filtered
  },
}))
