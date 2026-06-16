import { useState, useMemo } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { getLabels } from '@/mock/labels'

interface LabelPickerProps {
  selectedIds: string[]
  onToggle: (labelId: string) => void
  onCreateNew?: () => void
  trigger?: React.ReactNode
}

export function LabelPicker({ selectedIds, onToggle, onCreateNew, trigger }: LabelPickerProps) {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)

  const allLabels = getLabels()

  const filtered = useMemo(() => {
    if (!search.trim()) return allLabels
    const q = search.toLowerCase()
    return allLabels.filter((l) => l.name.toLowerCase().includes(q))
  }, [search, allLabels])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger ?? (
          <button
            type="button"
            className="px-2.5 py-1 text-[11px] font-medium text-steel hover:text-ink hover:bg-surface-soft rounded-full border border-hairline transition-colors"
          >
            + Label
          </button>
        )}
      </PopoverTrigger>
      <PopoverContent align="start" sideOffset={4} className="w-56 p-0">
        <div className="p-2 border-b border-hairline-soft">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari label..."
            className="w-full px-2.5 py-1.5 rounded-md border border-hairline bg-canvas text-xs text-ink placeholder:text-stone focus:outline-none focus:border-brand-blue-deep"
          />
        </div>
        <div className="max-h-52 overflow-y-auto py-1">
          {filtered.map((label) => (
            <button
              key={label.id}
              onClick={() => onToggle(label.id)}
              className={cn(
                'w-full px-2.5 py-1.5 text-left flex items-center gap-2 text-xs hover:bg-surface-soft transition-colors',
              )}
            >
              <span
                className="w-3 h-3 rounded-full flex-shrink-0 border"
                style={{ backgroundColor: label.color }}
              />
              <span className="text-ink flex-1 truncate">{label.name}</span>
              {selectedIds.includes(label.id) && (
                <svg className="w-3.5 h-3.5 text-brand-blue flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="px-3 py-4 text-xs text-steel text-center">Tidak ada label</p>
          )}
        </div>
        {onCreateNew && (
          <div className="p-2 border-t border-hairline-soft">
            <button
              onClick={() => { onCreateNew(); setOpen(false) }}
              className="w-full px-2.5 py-1.5 text-xs text-brand-blue font-medium text-left hover:bg-surface-soft rounded-md transition-colors"
            >
              + Buat label baru
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
