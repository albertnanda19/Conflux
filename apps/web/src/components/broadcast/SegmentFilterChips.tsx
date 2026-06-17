import { XIcon } from '@/icons'

interface ActiveFilter {
  id: string
  label: string
  value: string
}

const MOCK_FILTERS: ActiveFilter[] = [
  { id: 'f1', label: 'Program', value: 'Data Science' },
  { id: 'f2', label: 'Sumber', value: 'Instagram Ads' },
  { id: 'f3', label: 'Status', value: 'New Lead' },
]

interface SegmentFilterChipsProps {
  filters?: ActiveFilter[]
  onRemove?: (id: string) => void
  onClearAll?: () => void
}

export function SegmentFilterChips({ filters = MOCK_FILTERS, onRemove, onClearAll }: SegmentFilterChipsProps) {
  if (filters.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {filters.map((filter) => (
        <span
          key={filter.id}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-blue-200/40 text-brand-blue-deep text-[11px] font-medium border border-brand-blue-200"
        >
          <span className="text-steel font-normal">{filter.label}:</span>
          {filter.value}
          <button
            onClick={() => onRemove?.(filter.id)}
            className="ml-0.5 p-0.5 rounded-full hover:bg-brand-blue-200 transition-colors"
          >
            <XIcon size={10} />
          </button>
        </span>
      ))}
      {filters.length > 1 && (
        <button
          onClick={onClearAll}
          className="text-[11px] text-steel hover:text-ink font-medium transition-colors"
        >
          Hapus semua
        </button>
      )}
    </div>
  )
}
