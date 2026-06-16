import { create } from 'zustand'
import { MOCK_NOTIFICATIONS, type Notification } from '@/mock/notifications'

type NotificationState = {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  addNotification: (notif: Notification) => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: MOCK_NOTIFICATIONS,
  unreadCount: MOCK_NOTIFICATIONS.filter((n) => !n.read).length,
  markAsRead: (id) =>
    set((s) => {
      const updated = s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
      return { notifications: updated, unreadCount: updated.filter((n) => !n.read).length }
    }),
  markAllAsRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),
  addNotification: (notif) =>
    set((s) => ({
      notifications: [notif, ...s.notifications],
      unreadCount: s.unreadCount + 1,
    })),
}))
