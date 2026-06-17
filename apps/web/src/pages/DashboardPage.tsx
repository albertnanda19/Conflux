import { StatCard } from '@/components/reports/StatCard'
import { ChartCard } from '@/components/reports/ChartCard'
import { ChartSuspense, LeadTrendChart, ChannelDistributionChart, ConversionByProgramChart, TopAgentChart } from '@/components/reports/LazyChart'
import {
  MOCK_ANALYTICS_OVERVIEW,
  MOCK_CONVERSATION_TRENDS,
  MOCK_LEAD_SOURCE_CHANNELS,
  MOCK_LEAD_SOURCE_BY_PROGRAM,
  MOCK_AGENT_PERFORMANCE,
} from '@/mock/analytics'

const overview = MOCK_ANALYTICS_OVERVIEW

export function DashboardPage() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink mb-1">Dashboard</h1>
        <p className="text-steel text-sm">Ringkasan performa sales & marketing Anda.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard
          label="Total Lead"
          value={overview.totalLeads}
          change={overview.totalLeadsChange}
          icon="📊"
          color="text-brand-blue"
          bgColor="bg-brand-blue-200/30"
        />
        <StatCard
          label="Conversion Rate"
          value={overview.conversionRate}
          change={overview.conversionRateChange}
          icon="🎯"
          color="text-emerald-600"
          bgColor="bg-emerald-50"
          decimals={1}
          suffix="%"
        />
        <StatCard
          label="Avg Response Time"
          value={overview.avgResponseTime}
          change={overview.avgResponseTimeChange}
          icon="⚡"
          color="text-amber-600"
          bgColor="bg-amber-50"
          decimals={1}
          suffix="m"
        />
        <StatCard
          label="Percakapan Aktif"
          value={overview.activeConversations}
          change={overview.activeConversationsChange}
          icon="💬"
          color="text-brand-purple"
          bgColor="bg-purple-50"
        />
        <StatCard
          label="Agent Online"
          value={overview.agentsOnline}
          change={overview.agentsOnlineChange}
          icon="👤"
          color="text-brand-cyan"
          bgColor="bg-cyan-50"
        />
        <StatCard
          label="AI Handle Rate"
          value={overview.aiHandledPercent}
          change={overview.aiHandledChange}
          icon="🤖"
          color="text-brand-blue-deep"
          bgColor="bg-brand-blue-200/30"
          decimals={1}
          suffix="%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Tren Lead Masuk" subtitle="30 hari terakhir">
          <ChartSuspense>
            <LeadTrendChart data={MOCK_CONVERSATION_TRENDS} />
          </ChartSuspense>
        </ChartCard>
        <ChartCard title="Distribusi Channel" subtitle="Breakdown per channel">
          <ChartSuspense>
            <ChannelDistributionChart data={MOCK_LEAD_SOURCE_CHANNELS} />
          </ChartSuspense>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Lead per Program & Channel" subtitle="Distribusi program">
          <ChartSuspense>
            <ConversionByProgramChart data={MOCK_LEAD_SOURCE_BY_PROGRAM} />
          </ChartSuspense>
        </ChartCard>
        <ChartCard title="Top Agent" subtitle="Percakapan ditangani">
          <ChartSuspense>
            <TopAgentChart data={MOCK_AGENT_PERFORMANCE} />
          </ChartSuspense>
        </ChartCard>
      </div>
    </div>
  )
}
