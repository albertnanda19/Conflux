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
  const [pendingFile, setPendingFile] = useState<{ file: File; previewUrl?: string } | null>(null)
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
    const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    setPendingFile({ file, previewUrl })
  }, [])

  const handleSendFile = useCallback(() => {
    if (!pendingFile) return
    onFileSelect?.(pendingFile.file)
    if (pendingFile.previewUrl) URL.revokeObjectURL(pendingFile.previewUrl)
    setPendingFile(null)
    setValue('')
  }, [pendingFile, onFileSelect])

  const handleCancelFile = useCallback(() => {
    if (pendingFile?.previewUrl) URL.revokeObjectURL(pendingFile.previewUrl)
    setPendingFile(null)
  }, [pendingFile])

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
      {pendingFile && (
        <div className="mb-2 flex items-center gap-3 p-2 rounded-xl border border-hairline bg-surface-soft">
          {pendingFile.previewUrl ? (
            <img src={pendingFile.previewUrl} alt="preview" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-brand-blue-200 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-brand-blue-deep" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-ink truncate">{pendingFile.file.name}</p>
            <p className="text-[10px] text-steel">{(pendingFile.file.size / (1024 * 1024)).toFixed(1)} MB</p>
          </div>
          <button onClick={handleSendFile} className="px-3 py-1.5 text-[11px] font-medium bg-brand-blue text-white rounded-full hover:bg-brand-blue-deep transition-colors flex-shrink-0">Kirim</button>
          <button onClick={handleCancelFile} className="w-7 h-7 rounded-full flex items-center justify-center text-steel hover:bg-surface flex-shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
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
