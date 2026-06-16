import { useRef } from 'react'
import { cn } from '@/lib/utils'

interface AttachmentButtonProps {
  onFileSelect: (file: File) => void
  className?: string
}

export function AttachmentButton({ onFileSelect, className }: AttachmentButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileSelect(file)
      e.target.value = ''
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept="image/*,video/*,.pdf,.doc,.docx,.txt,.csv"
        onChange={handleChange}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={cn(
          'w-9 h-9 rounded-full flex items-center justify-center text-steel hover:bg-surface hover:text-ink transition-colors flex-shrink-0',
          className,
        )}
        title="Lampirkan file"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.939A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
        </svg>
      </button>
    </>
  )
}
