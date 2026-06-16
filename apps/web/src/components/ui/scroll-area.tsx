import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import { cn } from '@/lib/utils'

const ScrollArea = ScrollAreaPrimitive.Root
const ScrollViewport = ScrollAreaPrimitive.Viewport

function ScrollBar({ className, orientation = 'vertical', ...props }: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      orientation={orientation}
      className={cn(
        'flex touch-none select-none transition-colors',
        orientation === 'vertical' && 'h-full w-2 border-l border-l-transparent p-[1px]',
        orientation === 'horizontal' && 'h-2 flex-col border-t border-t-transparent p-[1px]',
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-hairline" />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
}

export { ScrollArea, ScrollViewport, ScrollBar }
