import { type ActivityLog } from '@/mock/inbox'
import { formatRelativeTime } from '@/lib/utils'

interface ContactActivityTimelineProps {
  activityLog: ActivityLog[]
}

const ACTIVITY_ICONS: Record<ActivityLog['type'], string> = {
  status_change: '🔄',
  assignment: '👤',
  note_added: '📝',
  label_added: '🏷️',
  message_sent: '💬',
  ai_handoff: '🤖',
}

export function ContactActivityTimeline({ activityLog }: ContactActivityTimelineProps) {
  const sorted = [...activityLog].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="card-base p-5">
      <h2 className="text-sm font-semibold text-ink mb-4">Aktivitas</h2>

      <div className="relative">
        <div className="absolute left-[11px] top-2 bottom-2 w-px bg-hairline" />

        <div className="space-y-4">
          {sorted.map((log) => {
            const icon = ACTIVITY_ICONS[log.type] ?? '📌'
            return (
              <div key={log.id} className="relative flex items-start gap-3">
                <div className="relative z-10 w-6 h-6 rounded-full flex items-center justify-center text-[11px] bg-surface border border-hairline shrink-0">
                  {icon}
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-xs text-ink">{log.description}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-steel">{formatRelativeTime(log.createdAt)}</span>
                    {log.agentName && (
                      <span className="text-[11px] text-steel">oleh {log.agentName}</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
