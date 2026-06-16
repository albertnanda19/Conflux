import { useState, useRef, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { EmojiPicker } from './EmojiPicker'
import { AttachmentButton } from './AttachmentButton'
import { QuickReplyMenu } from './QuickReplyMenu'

interface MessageInputProps {
  onSend: (content: string) => void
  onFileSelect?: (file: File) => void
  placeholder?: string
}

export function MessageInput({ onSend, onFileSelect, placeholder = 'Ketik pesan...' }: MessageInputProps) {
  const [value, setValue] = useState('')
  const [showQuickReply, setShowQuickReply] = useState(false)
  const [quickReplyQuery, setQuickReplyQuery] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const isQuickReplyMode = value.startsWith('/')

  useEffect(() => {
    if (isQuickReplyMode) {
      setShowQuickReply(true)
      setQuickReplyQuery(value)
    } else {
      setShowQuickReply(false)
      setQuickReplyQuery('')
    }
  }, [value, isQuickReplyMode])

  const handleSend = useCallback(() => {
    if (!value.trim()) return
    onSend(value.trim())
    setValue('')
    setShowQuickReply(false)
  }, [value, onSend])

  const handleQuickReplySelect = useCallback((content: string) => {
    setValue(content)
    setShowQuickReply(false)
    textareaRef.current?.focus()
  }, [])

  const handleEmojiSelect = useCallback((emoji: string) => {
    setValue((prev) => prev + emoji)
    textareaRef.current?.focus()
  }, [])

  const handleFileSelect = useCallback((file: File) => {
    onFileSelect?.(file)
  }, [onFileSelect])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend],
  )

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 96)}px`
    }
  }, [value])

  return (
    <div className="px-4 py-3 border-t border-hairline flex-shrink-0 relative">
      {showQuickReply && (
        <QuickReplyMenu
          query={quickReplyQuery}
          onSelect={handleQuickReplySelect}
          onClose={() => setShowQuickReply(false)}
        />
      )}
      <div className="flex items-end gap-2">
        <EmojiPicker onSelect={handleEmojiSelect} />
        {onFileSelect && <AttachmentButton onFileSelect={handleFileSelect} />}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            className="w-full resize-none rounded-lg border border-hairline bg-canvas px-3 py-2.5 text-sm text-ink placeholder:text-stone focus:outline-none focus:border-brand-blue-deep max-h-24"
          />
          <span className="absolute bottom-1.5 right-2.5 text-[10px] text-stone pointer-events-none">
            Kirim dengan Enter
          </span>
        </div>
        <button
          type="button"
          onClick={handleSend}
          disabled={!value.trim()}
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors',
            value.trim()
              ? 'bg-brand-blue text-white hover:bg-brand-blue-deep'
              : 'bg-surface text-stone cursor-not-allowed',
          )}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
