import { useReportsStore, type DateRangePreset } from '@/stores/reports'
import { cn } from '@/lib/utils'

const PRESETS: { value: DateRangePreset; label: string }[] = [
  { value: '7d', label: '7 Hari' },
  { value: '30d', label: '30 Hari' },
  { value: '90d', label: '90 Hari' },
]

export function DateRangePicker() {
  const { dateRangePreset, setDateRangePreset } = useReportsStore()

  return (
    <div className="flex items-center gap-1 bg-surface rounded-full p-0.5 border border-hairline">
      {PRESETS.map((preset) => (
        <button
          key={preset.value}
          onClick={() => setDateRangePreset(preset.value)}
          className={cn(
            'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
            dateRangePreset === preset.value
              ? 'bg-brand-blue text-white'
              : 'text-steel hover:text-ink'
          )}
        >
          {preset.label}
        </button>
      ))}
    </div>
  )
}
