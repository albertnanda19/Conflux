import { lazy, Suspense, useState, useEffect, useRef } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const Picker = lazy(() => import('@emoji-mart/react'))

const dataPromise = import('@emoji-mart/data').then((mod) => mod.default)

interface EmojiPickerProps {
  onSelect: (emoji: string) => void
  className?: string
}

export function EmojiPicker({ onSelect, className }: EmojiPickerProps) {
  const [open, setOpen] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)
  const preloadTriggered = useRef(false)

  useEffect(() => {
    if (preloadTriggered.current) return
    preloadTriggered.current = true
    dataPromise.then(() => setDataLoaded(true))
  }, [])

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen && !dataLoaded) return
        setOpen(nextOpen)
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'w-9 h-9 rounded-full flex items-center justify-center text-steel hover:bg-surface hover:text-ink transition-colors flex-shrink-0',
            className,
          )}
          title="Emoji"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
          </svg>
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="start"
        sideOffset={8}
        className="w-auto p-0 border-0 shadow-lg"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        {dataLoaded ? (
          <Suspense
            fallback={
              <div className="w-[352px] h-[400px] flex items-center justify-center bg-canvas rounded-lg">
                <div className="w-5 h-5 border-2 border-ink border-t-transparent rounded-full animate-spin" />
              </div>
            }
          >
            <Picker
              data={() => dataPromise}
              onEmojiSelect={(emoji: { native: string }) => {
                onSelect(emoji.native)
                setOpen(false)
              }}
              theme="light"
              previewPosition="none"
              skinTonePosition="none"
              maxFrequentRows={2}
              perLine={9}
            />
          </Suspense>
        ) : (
          <div className="w-[352px] h-[400px] flex items-center justify-center bg-canvas rounded-lg">
            <div className="w-5 h-5 border-2 border-ink border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
