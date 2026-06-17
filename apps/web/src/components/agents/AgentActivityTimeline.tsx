import { cn } from '@/lib/utils'

interface ActivityItem {
  id: string
  type: 'assignment' | 'message' | 'status_change' | 'login' | 'handoff' | 'resolved'
  description: string
  createdAt: string
}

const ACTIVITY_ICONS: Record<ActivityItem['type'], { icon: string; color: string }> = {
  assignment: { icon: '👤', color: 'bg-brand-blue-200 text-brand-blue-deep' },
  message: { icon: '💬', color: 'bg-emerald-50 text-emerald-600' },
  status_change: { icon: '🔄', color: 'bg-amber-50 text-amber-600' },
  login: { icon: '🟢', color: 'bg-emerald-50 text-emerald-600' },
  handoff: { icon: '🤖', color: 'bg-purple-50 text-purple-600' },
  resolved: { icon: '✅', color: 'bg-emerald-50 text-emerald-700' },
}

const MOCK_ACTIVITIES: ActivityItem[] = [
  { id: 'act1', type: 'login', description: 'Login ke sistem', createdAt: new Date(Date.now() - 30 * 60000).toISOString() },
  { id: 'act2', type: 'assignment', description: 'Ditugaskan ke percakapan dengan Budi Santoso', createdAt: new Date(Date.now() - 25 * 60000).toISOString() },
  { id: 'act3', type: 'message', description: 'Mengirim pesan ke Siti Rahayu (WhatsApp)', createdAt: new Date(Date.now() - 20 * 60000).toISOString() },
  { id: 'act4', type: 'handoff', description: 'AI menyerahkan percakapan dari Ahmad Fauzi', createdAt: new Date(Date.now() - 15 * 60000).toISOString() },
  { id: 'act5', type: 'resolved', description: 'Menyelesaikan percakapan dengan Dewi Lestari', createdAt: new Date(Date.now() - 10 * 60000).toISOString() },
  { id: 'act6', type: 'status_change', description: 'Status berubah dari Offline ke Online', createdAt: new Date(Date.now() - 5 * 60000).toISOString() },
]

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'baru saja'
  if (mins < 60) return `${mins}m lalu`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}j lalu`
  return `${Math.floor(hours / 24)}h lalu`
}

export function AgentActivityTimeline() {
  return (
    <div className="space-y-0">
      {MOCK_ACTIVITIES.map((item, idx) => {
        const config = ACTIVITY_ICONS[item.type]
        return (
          <div
            key={item.id}
            className="relative flex gap-3 animate-fade-in"
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            {idx < MOCK_ACTIVITIES.length - 1 && (
              <div className="absolute left-[15px] top-8 w-px h-[calc(100%-8px)] bg-hairline" />
            )}
            <div className={cn('w-[30px] h-[30px] rounded-full flex items-center justify-center text-xs flex-shrink-0 relative z-10', config.color)}>
              {config.icon}
            </div>
            <div className="pb-4 min-w-0">
              <p className="text-sm text-ink leading-snug">{item.description}</p>
              <p className="text-[11px] text-steel mt-0.5">{relativeTime(item.createdAt)}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
