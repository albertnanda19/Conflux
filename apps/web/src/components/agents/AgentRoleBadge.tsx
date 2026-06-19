import { cn } from '@/lib/utils'
import type { AgentRole } from '@/mock/agents'

interface AgentRoleBadgeProps {
  role: AgentRole
}

const ROLE_CONFIG: Record<AgentRole, { bg: string; text: string; label: string }> = {
  super_admin: { bg: 'bg-coral/10', text: 'text-coral', label: 'Super Admin' },
  admin: { bg: 'bg-brand-blue-200', text: 'text-brand-blue-deep', label: 'Admin' },
  supervisor: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Supervisor' },
  agent: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Agent' },
}

export function AgentRoleBadge({ role }: AgentRoleBadgeProps) {
  const config = ROLE_CONFIG[role]

  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold',
      config.bg, config.text,
    )}>
      {config.label}
    </span>
  )
}
