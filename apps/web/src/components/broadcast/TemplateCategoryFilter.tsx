import { cn } from '@/lib/utils'

type FilterValue = 'all' | 'sapaan' | 'promo' | 'undangan' | 'follow_up' | 'reminder' | 'closing'

interface CategoryCount {
  key: FilterValue
  label: string
  count: number
}

const MOCK_COUNTS: CategoryCount[] = [
  { key: 'all', label: 'Semua', count: 6 },
  { key: 'sapaan', label: 'Sapaan', count: 1 },
  { key: 'promo', label: 'Promo', count: 1 },
  { key: 'undangan', label: 'Undangan', count: 1 },
  { key: 'follow_up', label: 'Follow Up', count: 1 },
  { key: 'reminder', label: 'Reminder', count: 1 },
  { key: 'closing', label: 'Closing', count: 1 },
]

interface TemplateCategoryFilterProps {
  selected: FilterValue
  onSelect: (value: FilterValue) => void
  counts?: CategoryCount[]
}

export function TemplateCategoryFilter({ selected, onSelect, counts = MOCK_COUNTS }: TemplateCategoryFilterProps) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {counts.map((cat) => (
        <button
          key={cat.key}
          onClick={() => onSelect(cat.key)}
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border transition-colors',
            selected === cat.key
              ? 'bg-brand-blue text-white border-brand-blue'
              : 'bg-canvas text-steel border-hairline hover:text-ink',
          )}
        >
          {cat.label}
          {cat.count > 0 && (
            <span
              className={cn(
                'min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-semibold flex items-center justify-center',
                selected === cat.key
                  ? 'bg-white/25 text-white'
                  : 'bg-surface text-steel',
              )}
            >
              {cat.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
