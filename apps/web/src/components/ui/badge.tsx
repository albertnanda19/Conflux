import { type HTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-surface text-steel',
        success: 'bg-emerald-50 text-emerald-700',
        warning: 'bg-amber-50 text-amber-700',
        error: 'bg-red-50 text-red-600',
        info: 'bg-brand-blue-200 text-brand-blue-deep',
        new: 'bg-coral text-white',
        whatsapp: 'bg-emerald-50 text-emerald-700',
        instagram: 'bg-pink-50 text-pink-700',
        facebook: 'bg-brand-blue-200 text-brand-blue-deep',
        ai: 'bg-cyan-50 text-cyan-700',
        open: 'bg-brand-blue-200 text-brand-blue-deep',
        pending: 'bg-amber-50 text-amber-700',
        resolved: 'bg-emerald-50 text-emerald-700',
        snoozed: 'bg-gray-100 text-gray-600',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <span
        className={cn(badgeVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Badge.displayName = 'Badge'

export { Badge, badgeVariants }
