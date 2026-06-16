import { forwardRef, useState } from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { cn } from '@/lib/utils'

interface AvatarProps {
  src?: string
  alt?: string
  fallback?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  sm: 'h-7 w-7 text-[10px]',
  md: 'h-9 w-9 text-xs',
  lg: 'h-11 w-11 text-sm',
  xl: 'h-16 w-16 text-lg',
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = 'md' }, ref) => {
    const [imgError, setImgError] = useState(false)
    const initials = fallback || alt?.split(' ').map((n) => n[0]).join('').slice(0, 2) || '?'

    return (
      <AvatarPrimitive.Root
        ref={ref}
        className={cn(
          'relative flex-shrink-0 flex items-center justify-center rounded-full bg-surface overflow-hidden',
          sizeClasses[size],
          className,
        )}
      >
        {src && !imgError ? (
          <AvatarPrimitive.Image
            src={src}
            alt={alt || ''}
            className="h-full w-full object-cover"
            onLoadingStatusChange={(status) => {
              if (status === 'error') setImgError(true)
            }}
          />
        ) : null}
        <AvatarPrimitive.Fallback
          delayMs={src && !imgError ? 600 : 0}
          className="flex items-center justify-center w-full h-full font-semibold text-ink"
        >
          {initials}
        </AvatarPrimitive.Fallback>
      </AvatarPrimitive.Root>
    )
  },
)
Avatar.displayName = 'Avatar'

export { Avatar }
export type { AvatarProps }
