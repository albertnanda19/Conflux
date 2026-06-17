import type { ReactNode } from 'react'

interface ChartCardProps {
  title: string
  subtitle?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
}

export function ChartCard({ title, subtitle, actions, children, className = '' }: ChartCardProps) {
  return (
    <div className={`bg-canvas rounded-xl border border-hairline p-5 animate-fade-in ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-xs font-semibold text-ink">{title}</h4>
          {subtitle && <p className="text-[11px] text-steel mt-0.5">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  )
}
