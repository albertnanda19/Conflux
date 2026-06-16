import { forwardRef } from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'
import { cn } from '@/lib/utils'

interface ToggleProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  label?: string
  className?: string
}

const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  ({ checked, onCheckedChange, disabled, label, className }, ref) => {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <SwitchPrimitive.Root
          ref={ref}
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          className={cn(
            'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue-deep focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            checked ? 'bg-brand-blue-deep' : 'bg-hairline',
          )}
        >
          <SwitchPrimitive.Thumb
            className={cn(
              'pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform',
              checked ? 'translate-x-4' : 'translate-x-0',
            )}
          />
        </SwitchPrimitive.Root>
        {label && (
          <label className="text-sm text-ink cursor-pointer" onClick={() => onCheckedChange?.(!checked)}>
            {label}
          </label>
        )}
      </div>
    )
  },
)
Toggle.displayName = 'Toggle'

export { Toggle }
export type { ToggleProps }
