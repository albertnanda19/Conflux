import type { AgentPerformance } from '@/mock/analytics'
import { formatResponseTime } from '@/mock/analytics'
import { AGENT_AVATAR_COLORS } from '@/mock/analytics'

interface AgentRowProps {
  agent: AgentPerformance
  index: number
  expanded: boolean
  onToggle: () => void
}

function getResponseTimeColor(minutes: number): string {
  if (minutes < 3) return 'text-emerald-600 bg-emerald-50'
  if (minutes < 5) return 'text-amber-600 bg-amber-50'
  return 'text-red-500 bg-red-50'
}

function getConversionColor(rate: number): string {
  if (rate >= 20) return 'text-emerald-600'
  if (rate >= 15) return 'text-amber-600'
  return 'text-red-500'
}

export function AgentRow({ agent, index, expanded, onToggle }: AgentRowProps) {
  const avatarColor = AGENT_AVATAR_COLORS[index % AGENT_AVATAR_COLORS.length]
  const resolveRate = agent.conversationsHandled > 0
    ? ((agent.conversationsResolved / agent.conversationsHandled) * 100).toFixed(1)
    : '0'

  return (
    <>
      <tr
        onClick={onToggle}
        className="cursor-pointer hover:bg-surface-soft transition-colors border-b border-hairline-soft"
      >
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <span
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0"
              style={{ backgroundColor: avatarColor }}
            >
              {agent.avatar}
            </span>
            <span className="text-sm font-medium text-ink">{agent.name}</span>
          </div>
        </td>
        <td className="px-4 py-3 text-sm text-ink text-right">
          {agent.conversationsHandled.toLocaleString('id-ID')}
        </td>
        <td className="px-4 py-3 text-sm text-ink text-right">
          {agent.conversationsResolved.toLocaleString('id-ID')}
        </td>
        <td className="px-4 py-3 text-right">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${getResponseTimeColor(agent.avgResponseTimeMinutes)}`}>
            {formatResponseTime(agent.avgResponseTimeMinutes)}
          </span>
        </td>
        <td className="px-4 py-3 text-right">
          <span className={`text-sm font-semibold ${getConversionColor(agent.conversionRate)}`}>
            {agent.conversionRate.toFixed(1)}%
          </span>
        </td>
        <td className="px-4 py-3 text-sm text-ink text-right">
          {agent.onlineHoursToday.toFixed(1)}j
        </td>
      </tr>
      {expanded && (
        <tr className="bg-surface-soft border-b border-hairline-soft">
          <td colSpan={6} className="px-4 py-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-[10px] text-steel uppercase tracking-wide">Resolve Rate</p>
                <p className="text-sm font-semibold text-ink mt-1">{resolveRate}%</p>
              </div>
              <div>
                <p className="text-[10px] text-steel uppercase tracking-wide">Online Minggu Ini</p>
                <p className="text-sm font-semibold text-ink mt-1">{agent.onlineHoursWeek.toFixed(1)} jam</p>
              </div>
              <div>
                <p className="text-[10px] text-steel uppercase tracking-wide">Total Ditangani</p>
                <p className="text-sm font-semibold text-ink mt-1">{agent.conversationsHandled.toLocaleString('id-ID')}</p>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}
