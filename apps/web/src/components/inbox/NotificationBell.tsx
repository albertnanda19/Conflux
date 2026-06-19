import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useNotificationStore } from '@/stores/notifications'
import { NotificationDropdown } from './NotificationDropdown'

export function NotificationBell() {
  const { unreadCount, markAllAsRead } = useNotificationStore()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleToggle = () => {
    setOpen((prev) => {
      const next = !prev
      if (next && unreadCount > 0) markAllAsRead()
      return next
    })
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={handleToggle}
        className={cn(
          'w-9 h-9 rounded-full flex items-center justify-center transition-colors relative',
          open ? 'bg-surface text-ink' : 'text-steel hover:bg-surface-soft hover:text-ink',
        )}
        title="Notifikasi"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-coral text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && <NotificationDropdown onClose={() => setOpen(false)} />}
    </div>
  )
}
