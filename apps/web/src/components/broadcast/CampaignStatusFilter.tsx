import { cn } from '@/lib/utils'

type FilterValue = 'all' | 'draft' | 'scheduled' | 'running' | 'completed' | 'cancelled'

const FILTER_TABS: { value: FilterValue; label: string }[] = [
  { value: 'all', label: 'Semua' },
  { value: 'draft', label: 'Draft' },
  { value: 'scheduled', label: 'Terjadwal' },
  { value: 'running', label: 'Berjalan' },
  { value: 'completed', label: 'Selesai' },
  { value: 'cancelled', label: 'Dibatalkan' },
]

interface CampaignStatusFilterProps {
  selected: FilterValue
  onSelect: (value: FilterValue) => void
}

export function CampaignStatusFilter({ selected, onSelect }: CampaignStatusFilterProps) {
  return (
    <div className="flex gap-1.5">
      {FILTER_TABS.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onSelect(tab.value)}
          className={cn(
            'px-3 py-1 text-xs font-medium rounded-full border transition-colors',
            selected === tab.value
              ? 'bg-brand-blue text-white border-brand-blue'
              : 'bg-canvas text-steel border-hairline hover:text-ink',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
