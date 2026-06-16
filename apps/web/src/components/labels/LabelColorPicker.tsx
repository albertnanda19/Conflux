import { cn } from '@/lib/utils'

const PRESET_COLORS = [
  '#4A7AFF', '#E84393', '#FF6B5A', '#10B981',
  '#7C3AED', '#25D366', '#F59E0B', '#EF4444',
  '#06B6D4', '#8B5CF6', '#EC4899', '#3B82F6',
]

interface LabelColorPickerProps {
  value: string
  onChange: (color: string) => void
}

export function LabelColorPicker({ value, onChange }: LabelColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {PRESET_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          className={cn(
            'w-7 h-7 rounded-full transition-all',
            value === color ? 'ring-2 ring-offset-2 ring-ink scale-110' : 'hover:scale-110',
          )}
          style={{ backgroundColor: color }}
        />
      ))}
      <div className="relative">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-7 h-7 rounded-full cursor-pointer border border-hairline"
          title="Custom color"
        />
      </div>
    </div>
  )
}
