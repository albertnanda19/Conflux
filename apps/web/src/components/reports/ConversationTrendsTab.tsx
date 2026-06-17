import { StatCard } from './StatCard'
import { ChartCard } from './ChartCard'
import { ChartSuspense, ConversationVolumeChart, HeatmapChart, PeakHoursChart } from './LazyChart'
import { MOCK_CONVERSATION_TRENDS, MOCK_HEATMAP_DATA } from '@/mock/analytics'

export function ConversationTrendsTab() {
  const totalConversations = MOCK_CONVERSATION_TRENDS.reduce((s, d) => s + d.count, 0)
  const avgPerDay = Math.round(totalConversations / MOCK_CONVERSATION_TRENDS.length)

  const hourTotals = Array.from({ length: 24 }, (_, h) => ({
    hour: h,
    count: MOCK_HEATMAP_DATA.filter((d) => d.hour === h).reduce((s, d) => s + d.count, 0),
  }))
  const peakHour = hourTotals.sort((a, b) => b.count - a.count)[0]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard
          label="Total Percakapan (30 Hari)"
          value={totalConversations}
          icon="💬"
          color="text-brand-blue"
          bgColor="bg-brand-blue-200/30"
        />
        <StatCard
          label="Rata-rata/Hari"
          value={avgPerDay}
          icon="📈"
          color="text-emerald-600"
          bgColor="bg-emerald-50"
        />
        <StatCard
          label="Jam Sibuk"
          value={peakHour.hour}
          icon="🔥"
          color="text-amber-600"
          bgColor="bg-amber-50"
          suffix={`:00`}
        />
      </div>

      <ChartCard title="Volume Percakapan Harian" subtitle="30 hari terakhir + rata-rata 7 hari">
        <ChartSuspense>
          <ConversationVolumeChart data={MOCK_CONVERSATION_TRENDS} />
        </ChartSuspense>
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ChartCard title="Heatmap Jam Sibuk" subtitle="Percakapan per jam × hari">
            <ChartSuspense>
              <HeatmapChart data={MOCK_HEATMAP_DATA} />
            </ChartSuspense>
          </ChartCard>
        </div>
        <div>
          <ChartCard title="Top 10 Jam Sibuk" subtitle="Berdasarkan total percakapan">
            <ChartSuspense>
              <PeakHoursChart data={MOCK_HEATMAP_DATA} />
            </ChartSuspense>
          </ChartCard>
        </div>
      </div>
    </div>
  )
}
