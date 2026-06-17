import { useState } from 'react'
import { StatCard } from './StatCard'
import { ChartCard } from './ChartCard'
import { ChartSuspense, AgentComparisonChart } from './LazyChart'
import { AgentRow } from './AgentRow'
import { MOCK_AGENT_PERFORMANCE, type AgentPerformance } from '@/mock/analytics'

type SortKey = 'name' | 'conversationsHandled' | 'conversationsResolved' | 'avgResponseTimeMinutes' | 'conversionRate' | 'onlineHoursToday'
type SortDir = 'asc' | 'desc'

function computeSummary(agents: AgentPerformance[]) {
  const total = agents.length
  const avgResponse = agents.reduce((s, a) => s + a.avgResponseTimeMinutes, 0) / total
  const avgConversion = agents.reduce((s, a) => s + a.conversionRate, 0) / total
  return { total, avgResponse, avgConversion }
}

export function AgentPerformanceTab() {
  const [sortKey, setSortKey] = useState<SortKey>('conversationsHandled')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir(key === 'name' ? 'asc' : 'desc')
    }
  }

  const sorted = [...MOCK_AGENT_PERFORMANCE].sort((a, b) => {
    const aVal = a[sortKey]
    const bVal = b[sortKey]
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    }
    return sortDir === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number)
  })

  const summary = computeSummary(MOCK_AGENT_PERFORMANCE)

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <span className="text-stone ml-1">↕</span>
    return <span className="text-ink ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard
          label="Total Agent"
          value={summary.total}
          icon="👥"
          color="text-brand-blue"
          bgColor="bg-brand-blue-200/30"
        />
        <StatCard
          label="Avg Response Time"
          value={summary.avgResponse}
          icon="⚡"
          color="text-amber-600"
          bgColor="bg-amber-50"
          decimals={1}
          suffix="m"
        />
        <StatCard
          label="Avg Conversion Rate"
          value={summary.avgConversion}
          icon="🎯"
          color="text-emerald-600"
          bgColor="bg-emerald-50"
          decimals={1}
          suffix="%"
        />
      </div>

      <div className="bg-canvas rounded-xl border border-hairline overflow-hidden animate-fade-in">
        <div className="px-5 py-3 border-b border-hairline-soft">
          <h4 className="text-xs font-semibold text-ink">Performa Agent</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-soft border-b border-hairline">
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-steel uppercase tracking-wider">
                  <button onClick={() => handleSort('name')} className="flex items-center gap-1 hover:text-ink transition-colors">
                    Agent <SortIcon col="name" />
                  </button>
                </th>
                <th className="px-4 py-2.5 text-right text-[11px] font-semibold text-steel uppercase tracking-wider">
                  <button onClick={() => handleSort('conversationsHandled')} className="flex items-center gap-1 hover:text-ink transition-colors ml-auto">
                    Ditangani <SortIcon col="conversationsHandled" />
                  </button>
                </th>
                <th className="px-4 py-2.5 text-right text-[11px] font-semibold text-steel uppercase tracking-wider">
                  <button onClick={() => handleSort('conversationsResolved')} className="flex items-center gap-1 hover:text-ink transition-colors ml-auto">
                    Diselesaikan <SortIcon col="conversationsResolved" />
                  </button>
                </th>
                <th className="px-4 py-2.5 text-right text-[11px] font-semibold text-steel uppercase tracking-wider">
                  <button onClick={() => handleSort('avgResponseTimeMinutes')} className="flex items-center gap-1 hover:text-ink transition-colors ml-auto">
                    Response Time <SortIcon col="avgResponseTimeMinutes" />
                  </button>
                </th>
                <th className="px-4 py-2.5 text-right text-[11px] font-semibold text-steel uppercase tracking-wider">
                  <button onClick={() => handleSort('conversionRate')} className="flex items-center gap-1 hover:text-ink transition-colors ml-auto">
                    Conversion <SortIcon col="conversionRate" />
                  </button>
                </th>
                <th className="px-4 py-2.5 text-right text-[11px] font-semibold text-steel uppercase tracking-wider">
                  <button onClick={() => handleSort('onlineHoursToday')} className="flex items-center gap-1 hover:text-ink transition-colors ml-auto">
                    Online <SortIcon col="onlineHoursToday" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((agent, i) => (
                <AgentRow
                  key={agent.id}
                  agent={agent}
                  index={i}
                  expanded={expandedId === agent.id}
                  onToggle={() => setExpandedId((prev) => (prev === agent.id ? null : agent.id))}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ChartCard title="Perbandingan Agent" subtitle="Ditangani vs Diselesaikan vs Conversion">
        <ChartSuspense>
          <AgentComparisonChart data={MOCK_AGENT_PERFORMANCE} />
        </ChartSuspense>
      </ChartCard>
    </div>
  )
}
