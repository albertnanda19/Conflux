import { cn } from '@/lib/utils'

type AvatarSize = 'sm' | 'md' | 'lg'

interface AgentAvatarProps {
  initials: string
  status: 'online' | 'busy' | 'offline'
  size?: AvatarSize
  colorIndex?: number
}

const BRAND_COLORS = [
  'bg-brand-blue text-white',
  'bg-coral text-white',
  'bg-brand-cyan text-white',
  'bg-brand-magenta text-white',
  'bg-purple-500 text-white',
  'bg-emerald-500 text-white',
]

const STATUS_DOT: Record<AgentAvatarProps['status'], string> = {
  online: 'bg-emerald-500 animate-pulse',
  busy: 'bg-amber-500',
  offline: 'bg-gray-400',
}

const SIZE_CLASSES: Record<AvatarSize, { circle: string; dot: string; text: string; dotPos: string }> = {
  sm: { circle: 'w-8 h-8', dot: 'w-2.5 h-2.5', text: 'text-xs', dotPos: '-bottom-0.5 -right-0.5' },
  md: { circle: 'w-10 h-10', dot: 'w-3 h-3', text: 'text-sm', dotPos: '-bottom-0.5 -right-0.5' },
  lg: { circle: 'w-14 h-14', dot: 'w-3.5 h-3.5', text: 'text-base', dotPos: 'bottom-0 right-0' },
}

export function AgentAvatar({ initials, status, size = 'md', colorIndex = 0 }: AgentAvatarProps) {
  const s = SIZE_CLASSES[size]
  const color = BRAND_COLORS[colorIndex % BRAND_COLORS.length]

  return (
    <div className="relative inline-flex flex-shrink-0 group">
      <div className={cn(s.circle, 'rounded-full flex items-center justify-center font-semibold transition-transform group-hover:scale-105', color)}>
        <span className={s.text}>{initials}</span>
      </div>
      <span className={cn('absolute rounded-full border-2 border-canvas transition-colors', s.dot, s.dotPos, STATUS_DOT[status])} />
    </div>
  )
}
