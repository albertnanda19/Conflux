import { StatCard } from '@/components/reports/StatCard'
import type { AgentProfile } from '@/mock/agents'

interface AgentStatsOverviewProps {
  agents: AgentProfile[]
}

export function AgentStatsOverview({ agents }: AgentStatsOverviewProps) {
  const total = agents.length
  const onlineCount = agents.filter((a) => a.status === 'online').length
  const avgResponse = agents.length > 0
    ? agents.reduce((sum, a) => {
        const match = a.avgResponseTime.match(/(\d+)m\s*(\d+)s/)
        return sum + (match ? parseInt(match[1]) * 60 + parseInt(match[2]) : 0)
      }, 0) / agents.length
    : 0
  const avgConversion = agents.length > 0
    ? Math.round(agents.reduce((sum, a) => sum + a.conversionRate, 0) / agents.length)
    : 0

  const minutes = Math.floor(avgResponse / 60)
  const seconds = Math.round(avgResponse % 60)
  const responseDisplay = avgResponse > 0 ? parseFloat(`${minutes}.${seconds.toString().padStart(2, '0')}`) : 0

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      <StatCard label="Total Agent" value={total} icon="👥" color="text-ink" bgColor="bg-surface" />
      <StatCard label="Online Saat Ini" value={onlineCount} icon="🟢" color="text-emerald-600" bgColor="bg-emerald-50" />
      <StatCard label="Avg Response Time" value={responseDisplay} icon="⏱️" color="text-brand-blue-deep" bgColor="bg-brand-blue-200" decimals={1} suffix="m" />
      <StatCard label="Avg Konversi" value={avgConversion} icon="📈" color="text-coral" bgColor="bg-coral/10" suffix="%" />
    </div>
  )
}
