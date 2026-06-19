import { cn, formatRelativeTime } from '@/lib/utils'
import { useNotificationStore } from '@/stores/notifications'
import { type NotificationType } from '@/types/notifications'

interface NotificationDropdownProps {
  onClose: () => void
}

const NOTIF_ICON: Record<NotificationType, { icon: string; color: string }> = {
  new_message: { icon: '💬', color: 'text-brand-blue' },
  new_assignment: { icon: '👤', color: 'text-emerald-500' },
  ai_handoff: { icon: '🤖', color: 'text-cyan-600' },
  stale_message: { icon: '⏰', color: 'text-amber-500' },
}

export function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const { notifications, markAsRead, markAllAsRead, soundEnabled, browserPushEnabled, setSoundEnabled, setBrowserPushEnabled } = useNotificationStore()

  const handleNotifClick = (id: string) => {
    markAsRead(id)
    onClose()
  }

  const handleTogglePush = (next: boolean) => {
    if (next && typeof Notification !== 'undefined' && Notification.permission === 'default') {
      void Notification.requestPermission()
    }
    setBrowserPushEnabled(next)
  }

  return (
    <div className="absolute top-full right-0 mt-2 w-96 bg-canvas border border-hairline rounded-xl shadow-lg z-50 overflow-hidden">
      <div className="px-4 py-3 flex items-center justify-between border-b border-hairline-soft">
        <span className="text-sm font-semibold text-ink">Notifikasi</span>
        <button
          onClick={markAllAsRead}
          className="text-[11px] font-medium text-brand-blue hover:text-brand-blue-deep transition-colors"
        >
          Tandai semua sudah dibaca
        </button>
      </div>
      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="py-10 text-center text-sm text-steel">Tidak ada notifikasi</div>
        ) : (
          notifications.map((notif) => {
            const { icon, color } = NOTIF_ICON[notif.type]
            return (
              <button
                key={notif.id}
                onClick={() => handleNotifClick(notif.id)}
                className={cn(
                  'w-full px-4 py-3 text-left flex gap-3 hover:bg-surface-soft transition-colors border-b border-hairline-soft last:border-b-0',
                  !notif.read && 'bg-brand-blue/3',
                )}
              >
                <span className="text-lg flex-shrink-0 mt-0.5">{icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={cn('text-xs font-semibold', color)}>{notif.title}</p>
                    {!notif.read && <span className="w-2 h-2 rounded-full bg-coral flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-slate mt-0.5 line-clamp-2">{notif.body}</p>
                  <p className="text-[10px] text-stone mt-1">{formatRelativeTime(notif.createdAt)}</p>
                </div>
              </button>
            )
          })
        )}
      </div>
      <div className="px-4 py-2.5 border-t border-hairline-soft space-y-2">
        <ToggleRow label="Suara notifikasi" checked={soundEnabled} onChange={setSoundEnabled} />
        <ToggleRow label="Notifikasi browser" checked={browserPushEnabled} onChange={handleTogglePush} />
      </div>
    </div>
  )
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-ink">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={cn('relative w-9 h-5 rounded-full transition-colors flex-shrink-0', checked ? 'bg-brand-blue' : 'bg-hairline')}
      >
        <span className={cn('absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform', checked ? 'translate-x-4' : 'translate-x-0')} />
      </button>
    </div>
  )
}
