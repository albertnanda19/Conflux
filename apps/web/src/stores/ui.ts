import { create } from "zustand"
import type { ConversationStatus } from "@/types/inbox"

type DateRange = 'all' | 'today' | '7d' | '30d'

type PresenceState = {
  presence: 'online' | 'busy' | 'offline'
  setPresence: (p: 'online' | 'busy' | 'offline') => void
}

export const usePresenceStore = create<PresenceState>((set) => ({
  presence: 'online',
  setPresence: (p) => set({ presence: p }),
}))

type SidebarState = {
  isCollapsed: boolean
  isMobileOpen: boolean
  toggle: () => void
  setMobileOpen: (open: boolean) => void
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isCollapsed: false,
  isMobileOpen: false,
  toggle: () => set((s) => ({ isCollapsed: !s.isCollapsed })),
  setMobileOpen: (open) => set({ isMobileOpen: open }),
}))

type SortOption = 'newest' | 'waiting' | 'priority'

type ChannelTab = 'all' | 'whatsapp' | 'instagram' | 'facebook' | 'telegram'

type InboxState = {
  selectedConversationId: string | null
  detailPanelOpen: boolean
  agentFilter: string | null
  labelFilter: string[]
  sortBy: SortOption
  searchQuery: string
  channelTab: ChannelTab
  statusFilter: ConversationStatus | null
  dateFilter: DateRange
  selectConversation: (id: string | null) => void
  setDetailPanelOpen: (open: boolean) => void
  setAgentFilter: (agentId: string | null) => void
  setLabelFilter: (labelIds: string[]) => void
  toggleLabelFilter: (labelId: string) => void
  setSortBy: (sort: SortOption) => void
  setSearchQuery: (q: string) => void
  setChannelTab: (tab: ChannelTab) => void
  setStatusFilter: (status: ConversationStatus | null) => void
  setDateFilter: (range: DateRange) => void
}

export const useInboxStore = create<InboxState>((set) => ({
  selectedConversationId: null,
  detailPanelOpen: false,
  agentFilter: null,
  labelFilter: [],
  sortBy: 'newest',
  searchQuery: '',
  channelTab: 'all',
  statusFilter: null,
  dateFilter: 'all',
  selectConversation: (id) => set({ selectedConversationId: id, detailPanelOpen: !!id }),
  setDetailPanelOpen: (open) => set({ detailPanelOpen: open }),
  setAgentFilter: (agentId) => set({ agentFilter: agentId }),
  setLabelFilter: (labelIds) => set({ labelFilter: labelIds }),
  toggleLabelFilter: (labelId) =>
    set((s) => ({
      labelFilter: s.labelFilter.includes(labelId)
        ? s.labelFilter.filter((id) => id !== labelId)
        : [...s.labelFilter, labelId],
    })),
  setSortBy: (sort) => set({ sortBy: sort }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setChannelTab: (tab) => set({ channelTab: tab }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setDateFilter: (range) => set({ dateFilter: range }),
}))
