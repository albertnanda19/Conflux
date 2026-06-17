interface TimelineEvent {
  timestamp: string
  event: string
  count?: number
}

const MOCK_EVENTS: TimelineEvent[] = [
  { timestamp: '2026-06-04T08:00:00.000Z', event: 'Campaign dimulai' },
  { timestamp: '2026-06-04T08:15:00.000Z', event: 'Batch 1 terkirim', count: 800 },
  { timestamp: '2026-06-04T14:00:00.000Z', event: 'Batch 2 terkirim', count: 850 },
  { timestamp: '2026-06-05T08:00:00.000Z', event: 'Batch 3 terkirim', count: 800 },
  { timestamp: '2026-06-05T16:00:00.000Z', event: 'Campaign selesai' },
]

const EVENT_ICONS: Record<string, string> = {
  'Campaign dimulai': '🚀',
  'Campaign dibuat': '📝',
  'Dijadwalkan': '⏰',
  'Campaign selesai': '✅',
  'Campaign dibatalkan': '❌',
}

function getEventIcon(event: string): string {
  if (event.startsWith('Batch')) return '📤'
  return EVENT_ICONS[event] ?? '📌'
}

function formatTimestamp(ts: string): string {
  const date = new Date(ts)
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  }).format(date)
}

interface CampaignTimelineProps {
  events?: TimelineEvent[]
}

export function CampaignTimeline({ events = MOCK_EVENTS }: CampaignTimelineProps) {
  return (
    <div className="bg-canvas rounded-xl border border-hairline p-5">
      <h4 className="text-xs font-semibold text-ink mb-4">Timeline</h4>

      <div className="relative">
        <div className="absolute left-[11px] top-2 bottom-2 w-px bg-hairline" />

        <div className="space-y-4">
          {events.map((evt, idx) => {
            const isLast = idx === events.length - 1
            const icon = getEventIcon(evt.event)
            return (
              <div key={idx} className="relative flex items-start gap-3 pl-0">
                <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center text-[11px] border ${
                  isLast ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-surface border-hairline'
                }`}>
                  {icon}
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-xs font-medium text-ink">{evt.event}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-steel">{formatTimestamp(evt.timestamp)}</span>
                    {evt.count !== undefined && (
                      <span className="text-[11px] font-medium text-brand-blue">{evt.count.toLocaleString('id-ID')} pesan</span>
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
