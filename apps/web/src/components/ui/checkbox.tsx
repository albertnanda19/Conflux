import { forwardRef } from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { cn } from '@/lib/utils'

const Checkbox = forwardRef<HTMLButtonElement, React.ComponentProps<typeof CheckboxPrimitive.Root>>(
  ({ className, ...props }, ref) => {
    return (
      <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
          'peer h-4 w-4 shrink-0 rounded-sm border border-hairline bg-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue-deep focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          'data-[state=checked]:bg-ink data-[state=checked]:border-ink data-[state=checked]:text-white',
          className,
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    )
  },
)
Checkbox.displayName = 'Checkbox'

export { Checkbox }
