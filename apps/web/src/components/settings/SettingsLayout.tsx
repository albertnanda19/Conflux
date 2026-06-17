import type { ReactNode } from 'react'
import { Separator } from '@/components/ui/separator'

interface SettingsLayoutProps {
  title: string
  subtitle?: string
  actionButton?: ReactNode
  children: ReactNode
}

export function SettingsLayout({ title, subtitle, actionButton, children }: SettingsLayoutProps) {
  return (
    <div className="flex gap-10">
      <div className="flex-1 min-w-0 space-y-8">
        {children}
      </div>

      <div className="w-64 flex-shrink-0">
        <div className="sticky top-8">
          <div className="flex items-start justify-between">
            <h2 className="text-lg font-semibold text-ink">{title}</h2>
            {actionButton}
          </div>
          <Separator className="my-4" />
          {subtitle && <p className="text-sm text-steel">{subtitle}</p>}
        </div>
      </div>
    </div>
  )
}
