import { useState, useMemo, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { useQuickReplies } from '@/hooks/inbox'
import type { QuickReply } from '@/types/inbox'

interface QuickReplyMenuProps {
  query: string
  onSelect: (content: string) => void
  onClose: () => void
}

export function QuickReplyMenu({ query, onSelect, onClose }: QuickReplyMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)
  const { data: quickReplies = [] } = useQuickReplies()

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return quickReplies.filter(
      (qr) =>
        qr.shortcut.toLowerCase().includes(q) ||
        qr.name.toLowerCase().includes(q) ||
        (qr.category ?? '').toLowerCase().includes(q),
    )
  }, [query, quickReplies])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((i) => (i + 1) % filtered.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((i) => (i - 1 + filtered.length) % filtered.length)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (filtered[selectedIndex]) {
          onSelect(filtered[selectedIndex].content)
        }
      } else if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [filtered, selectedIndex, onSelect, onClose])

  useEffect(() => {
    const item = listRef.current?.children[selectedIndex] as HTMLElement
    item?.scrollIntoView({ block: 'nearest' })
  }, [selectedIndex])

  if (filtered.length === 0) {
    return (
      <div className="absolute bottom-full left-0 mb-2 w-80 bg-canvas border border-hairline rounded-xl shadow-lg overflow-hidden z-50">
        <div className="px-4 py-6 text-center text-sm text-steel">
          Tidak ada template ditemukan
        </div>
      </div>
    )
  }

  return (
    <div className="absolute bottom-full left-0 mb-2 w-80 bg-canvas border border-hairline rounded-xl shadow-lg overflow-hidden z-50">
      <div className="px-3 py-2 border-b border-hairline-soft">
        <span className="text-[11px] font-semibold text-steel uppercase tracking-wide">Quick Reply</span>
      </div>
      <div ref={listRef} className="max-h-64 overflow-y-auto">
        {filtered.map((qr, i) => (
          <QuickReplyItem
            key={qr.id}
            reply={qr}
            isSelected={i === selectedIndex}
            onSelect={() => onSelect(qr.content)}
          />
        ))}
      </div>
    </div>
  )
}

function QuickReplyItem({
  reply,
  isSelected,
  onSelect,
}: {
  reply: QuickReply
  isSelected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'w-full px-3 py-2.5 text-left flex items-start gap-3 transition-colors',
        isSelected ? 'bg-surface' : 'hover:bg-surface-soft',
      )}
    >
      <span className="text-xs font-mono font-semibold text-brand-blue bg-brand-blue-200 rounded px-1.5 py-0.5 flex-shrink-0 mt-0.5">
        {reply.shortcut}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-ink truncate">{reply.name}</p>
        <p className="text-xs text-steel truncate mt-0.5">{reply.content.slice(0, 60)}...</p>
      </div>
    </button>
  )
}
