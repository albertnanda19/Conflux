import { cn } from '@/lib/utils'

interface PillTab {
  id: string
  label: string
}

interface SettingsPillTabsProps {
  tabs: PillTab[]
  activeTab: string
  onTabChange: (id: string) => void
}

export function SettingsPillTabs({ tabs, activeTab, onTabChange }: SettingsPillTabsProps) {
  return (
    <div className="flex gap-2 p-1 bg-surface rounded-xl">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-lg transition-all',
            activeTab === tab.id
              ? 'bg-canvas text-ink shadow-sm'
              : 'text-steel hover:text-ink',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
