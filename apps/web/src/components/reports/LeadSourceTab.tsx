import { StatCard } from './StatCard'
import { ChartCard } from './ChartCard'
import { ChartSuspense, SourceBreakdownChart, OriginDistributionChart, ConversionByProgramChart, MultiChannelTrendChart } from './LazyChart'
import {
  MOCK_LEAD_SOURCE_CHANNELS,
  MOCK_LEAD_SOURCE_ORIGINS,
  MOCK_LEAD_SOURCE_BY_PROGRAM,
  MOCK_LEAD_MONTHLY_TREND,
} from '@/mock/analytics'

export function LeadSourceTab() {
  const totalLeads = MOCK_LEAD_SOURCE_CHANNELS.reduce((s, d) => s + d.count, 0)
  const totalConverted = MOCK_LEAD_SOURCE_CHANNELS.reduce((s, d) => s + d.converted, 0)
  const avgConversion = MOCK_LEAD_SOURCE_CHANNELS.reduce((s, d) => s + d.conversionRate, 0) / MOCK_LEAD_SOURCE_CHANNELS.length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard
          label="Total Lead"
          value={totalLeads}
          icon="📊"
          color="text-brand-blue"
          bgColor="bg-brand-blue-200/30"
        />
        <StatCard
          label="Total Converted"
          value={totalConverted}
          icon="✅"
          color="text-emerald-600"
          bgColor="bg-emerald-50"
        />
        <StatCard
          label="Avg Conversion Rate"
          value={avgConversion}
          icon="🎯"
          color="text-amber-600"
          bgColor="bg-amber-50"
          decimals={1}
          suffix="%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Breakdown per Channel" subtitle="Lead masuk & converted">
          <ChartSuspense>
            <SourceBreakdownChart data={MOCK_LEAD_SOURCE_CHANNELS} />
          </ChartSuspense>
        </ChartCard>
        <ChartCard title="Distribusi Sumber" subtitle="Asal lead masuk">
          <ChartSuspense>
            <OriginDistributionChart data={MOCK_LEAD_SOURCE_ORIGINS} />
          </ChartSuspense>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Lead per Program & Channel" subtitle="Distribusi program">
          <ChartSuspense>
            <ConversionByProgramChart data={MOCK_LEAD_SOURCE_BY_PROGRAM} />
          </ChartSuspense>
        </ChartCard>
        <ChartCard title="Tren Multi-Channel" subtitle="6 bulan terakhir">
          <ChartSuspense>
            <MultiChannelTrendChart data={MOCK_LEAD_MONTHLY_TREND} />
          </ChartSuspense>
        </ChartCard>
      </div>
    </div>
  )
}
