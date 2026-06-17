import type { AgentProfile } from '@/mock/agents'
import { AnimatedNumber } from '@/components/reports/AnimatedNumber'

interface AgentPerformanceCardProps {
  agent: AgentProfile
}

const metrics = (agent: AgentProfile) => [
  { label: 'Total Percakapan', value: agent.totalConversations, icon: '💬', color: 'text-ink', bgColor: 'bg-surface' },
  { label: 'Diselesaikan', value: agent.resolvedConversations, icon: '✅', color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
  { label: 'Avg Response Time', value: parseFloat(agent.avgResponseTime.replace(/(\d+)m\s*(\d+)s/, (_, m, s) => `${parseInt(m)}.${s.padStart(2, '0')}`)) || 0, icon: '⏱️', color: 'text-brand-blue-deep', bgColor: 'bg-brand-blue-200', decimals: 1, suffix: 'm' },
  { label: 'Conversion Rate', value: agent.conversionRate, icon: '📈', color: agent.conversionRate >= 30 ? 'text-emerald-600' : agent.conversionRate >= 20 ? 'text-amber-600' : 'text-steel', bgColor: 'bg-brand-coral/10', suffix: '%' },
]

export function AgentPerformanceCard({ agent }: AgentPerformanceCardProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {metrics(agent).map((m, i) => (
        <div
          key={m.label}
          className="bg-canvas rounded-xl border border-hairline p-5 animate-fade-in"
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className={`w-8 h-8 rounded-lg ${m.bgColor} flex items-center justify-center text-sm`}>
              {m.icon}
            </span>
            <span className="text-[11px] text-steel">{m.label}</span>
          </div>
          <AnimatedNumber
            value={m.value}
            decimals={m.decimals}
            suffix={m.suffix}
            className={`text-2xl font-bold ${m.color}`}
          />
        </div>
      ))}
    </div>
  )
}
