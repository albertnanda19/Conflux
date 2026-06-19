import { create } from 'zustand'
import type { Notification } from '@/types/notifications'
import { inboxApi } from '@/lib/api/inbox'

function loadPref(key: string, fallback: boolean): boolean {
  try {
    const v = localStorage.getItem(key)
    return v === null ? fallback : v === 'true'
  } catch {
    return fallback
  }
}

function savePref(key: string, value: boolean) {
  try {
    localStorage.setItem(key, String(value))
  } catch {
    // abaikan
  }
}

type NotificationState = {
  notifications: Notification[]
  unreadCount: number
  soundEnabled: boolean
  browserPushEnabled: boolean
  setSoundEnabled: (v: boolean) => void
  setBrowserPushEnabled: (v: boolean) => void
  setAll: (list: Notification[], unreadCount: number) => void
  loadFromServer: () => Promise<void>
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  addNotification: (notif: Notification) => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  soundEnabled: loadPref('notif_sound', true),
  browserPushEnabled: loadPref('notif_push', false),
  setSoundEnabled: (v) => { savePref('notif_sound', v); set({ soundEnabled: v }) },
  setBrowserPushEnabled: (v) => { savePref('notif_push', v); set({ browserPushEnabled: v }) },
  setAll: (list, unreadCount) => set({ notifications: list, unreadCount }),
  loadFromServer: async () => {
    try {
      const res = await inboxApi.listNotifications()
      set({ notifications: res.data, unreadCount: res.unreadCount })
    } catch {
      // abaikan: gagal muat notif tak boleh blok UI
    }
  },
  markAsRead: (id) => {
    set((s) => {
      const updated = s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
      return { notifications: updated, unreadCount: updated.filter((n) => !n.read).length }
    })
    inboxApi.markNotificationRead(id).catch(() => {})
  },
  markAllAsRead: () => {
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }))
    inboxApi.markAllNotificationsRead().catch(() => {})
  },
  addNotification: (notif) =>
    set((s) => {
      if (s.notifications.some((n) => n.id === notif.id)) return s
      const notifications = [notif, ...s.notifications].slice(0, 50)
      return { notifications, unreadCount: notifications.filter((n) => !n.read).length }
    }),
}))
