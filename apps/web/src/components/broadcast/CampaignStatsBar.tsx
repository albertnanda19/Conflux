interface StatItem {
  key: string
  label: string
  icon: string
  value: number
  color: string
}

const MOCK_STATS: StatItem[] = [
  { key: 'total', label: 'Total Campaign', icon: '📢', value: 5, color: 'text-ink' },
  { key: 'running', label: 'Berjalan', icon: '🟢', value: 1, color: 'text-emerald-600' },
  { key: 'scheduled', label: 'Terjadwal', icon: '⏰', value: 1, color: 'text-amber-600' },
  { key: 'completed', label: 'Selesai', icon: '✅', value: 1, color: 'text-brand-blue' },
]

interface CampaignStatsBarProps {
  stats?: StatItem[]
}

export function CampaignStatsBar({ stats = MOCK_STATS }: CampaignStatsBarProps) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.key}
          className="bg-surface border border-hairline rounded-xl px-4 py-3 flex items-center gap-3"
        >
          <span className="text-xl">{stat.icon}</span>
          <div>
            <p className={`text-2xl font-semibold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-steel">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
