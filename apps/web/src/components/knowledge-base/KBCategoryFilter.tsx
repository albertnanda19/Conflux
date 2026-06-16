import { cn } from '@/lib/utils'
import { KB_CATEGORIES } from '@/mock/ai-settings'

interface KBCategoryFilterProps {
  selected: string
  onSelect: (category: string) => void
  counts: Record<string, number>
}

export function KBCategoryFilter({ selected, onSelect, counts }: KBCategoryFilterProps) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {KB_CATEGORIES.map((cat) => {
        const count = cat === 'Semua' ? counts.all : (counts[cat] ?? 0)
        const isActive = selected === cat

        return (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border',
              isActive
                ? 'bg-brand-blue-deep text-white border-brand-blue-deep'
                : 'bg-canvas text-steel border-hairline hover:bg-surface hover:text-charcoal',
            )}
          >
            {cat}
            <span className={cn(
              'text-[10px] font-semibold min-w-[18px] h-[18px] rounded-full flex items-center justify-center',
              isActive ? 'bg-white/20 text-white' : 'bg-surface text-steel',
            )}>
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
