interface StatItem {
  key: string
  label: string
  value: number
  total: number
  icon: string
  color: string
  bgColor: string
}

const MOCK_STATS: StatItem[] = [
  { key: 'sent', label: 'Terkirim', value: 2380, total: 2450, icon: '📤', color: 'text-brand-blue', bgColor: 'bg-brand-blue-200/30' },
  { key: 'read', label: 'Dibaca', value: 1890, total: 2450, icon: '👁', color: 'text-brand-cyan', bgColor: 'bg-brand-cyan/10' },
  { key: 'replied', label: 'Dibalas', value: 620, total: 2450, icon: '💬', color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
  { key: 'failed', label: 'Gagal', value: 70, total: 2450, icon: '⚠️', color: 'text-red-500', bgColor: 'bg-red-50' },
]

interface CampaignReportStatsProps {
  stats?: StatItem[]
}

export function CampaignReportStats({ stats = MOCK_STATS }: CampaignReportStatsProps) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {stats.map((stat) => {
        const pct = stat.total > 0 ? ((stat.value / stat.total) * 100).toFixed(1) : '0'
        return (
          <div key={stat.key} className="bg-canvas rounded-xl border border-hairline p-4">
            <div className="flex items-center justify-between mb-2">
              <span className={`w-8 h-8 rounded-lg ${stat.bgColor} flex items-center justify-center text-sm`}>
                {stat.icon}
              </span>
              <span className={`text-[11px] font-semibold ${stat.color}`}>{pct}%</span>
            </div>
            <p className={`text-xl font-bold ${stat.color}`}>
              {stat.value.toLocaleString('id-ID')}
            </p>
            <p className="text-[11px] text-steel mt-0.5">{stat.label}</p>
          </div>
        )
      })}
    </div>
  )
}
