import * as SwitchPrimitive from '@radix-ui/react-switch'
import { cn } from '@/lib/utils'

interface ToggleRowProps {
  label: string
  description?: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
}

export function ToggleRow({ label, description, checked, onCheckedChange, disabled }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-canvas border border-hairline-soft">
      <div className="min-w-0 mr-4">
        <p className="text-sm font-medium text-ink">{label}</p>
        {description && <p className="text-xs text-stone mt-0.5">{description}</p>}
      </div>
      <SwitchPrimitive.Root
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className={cn(
          'relative w-10 h-6 rounded-full transition-colors flex-shrink-0',
          checked ? 'bg-brand-blue-deep' : 'bg-hairline',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
      >
        <SwitchPrimitive.Thumb
          className={cn(
            'block w-5 h-5 rounded-full bg-white shadow-sm transition-transform',
            checked ? 'translate-x-[18px]' : 'translate-x-[2px]',
          )}
        />
      </SwitchPrimitive.Root>
    </div>
  )
}
