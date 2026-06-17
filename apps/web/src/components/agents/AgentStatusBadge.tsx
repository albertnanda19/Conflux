import { cn } from '@/lib/utils'
import type { AgentProfile } from '@/mock/agents'

interface AgentStatusBadgeProps {
  status: AgentProfile['status']
  size?: 'sm' | 'md'
}

const STATUS_CONFIG: Record<AgentProfile['status'], { bg: string; text: string; dot: string; label: string }> = {
  online: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Online' },
  busy: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', label: 'Busy' },
  offline: { bg: 'bg-gray-100', text: 'text-gray-500', dot: 'bg-gray-400', label: 'Offline' },
}

export function AgentStatusBadge({ status, size = 'sm' }: AgentStatusBadgeProps) {
  const config = STATUS_CONFIG[status]

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-full font-medium',
      size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs',
      config.bg, config.text,
    )}>
      <span className={cn(
        'rounded-full',
        size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2',
        config.dot,
        status === 'online' && 'animate-pulse',
      )} />
      {config.label}
    </span>
  )
}
