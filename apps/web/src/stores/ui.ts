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

type InboxState = {
  selectedConversationId: string | null
  detailPanelOpen: boolean
  selectConversation: (id: string | null) => void
  setDetailPanelOpen: (open: boolean) => void
}

export const useInboxStore = create<InboxState>((set) => ({
  selectedConversationId: null,
  detailPanelOpen: false,
  selectConversation: (id) => set({ selectedConversationId: id, detailPanelOpen: !!id }),
  setDetailPanelOpen: (open) => set({ detailPanelOpen: open }),
}))
