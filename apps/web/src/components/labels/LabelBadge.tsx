import { cn } from '@/lib/utils'

interface LabelBadgeProps {
  name: string
  color: string
  size?: 'sm' | 'md'
  className?: string
}

export function LabelBadge({ name, color, size = 'sm', className }: LabelBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full whitespace-nowrap',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
        className,
      )}
      style={{
        color,
        backgroundColor: `${color}18`,
        borderWidth: '1px',
        borderColor: `${color}30`,
      }}
    >
      {name}
    </span>
  )
}
