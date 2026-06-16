import { create } from "zustand"

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

type InboxState = {
  selectedConversationId: string | null
  detailPanelOpen: boolean
  agentFilter: string | null
  labelFilter: string[]
  sortBy: SortOption
  selectConversation: (id: string | null) => void
  setDetailPanelOpen: (open: boolean) => void
  setAgentFilter: (agentId: string | null) => void
  setLabelFilter: (labelIds: string[]) => void
  toggleLabelFilter: (labelId: string) => void
  setSortBy: (sort: SortOption) => void
}

export const useInboxStore = create<InboxState>((set) => ({
  selectedConversationId: null,
  detailPanelOpen: false,
  agentFilter: null,
  labelFilter: [],
  sortBy: 'newest',
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
}))
