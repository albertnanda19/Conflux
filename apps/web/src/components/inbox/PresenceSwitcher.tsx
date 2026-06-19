import { useState, useRef, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { cn } from '@/lib/utils'
import { usePresenceStore } from '@/stores/ui'
import { inboxApi } from '@/lib/api/inbox'

const OPTIONS: { value: 'online' | 'busy' | 'offline'; label: string; dot: string }[] = [
  { value: 'online', label: 'Online', dot: 'bg-emerald-500' },
  { value: 'busy', label: 'Sibuk', dot: 'bg-amber-500' },
  { value: 'offline', label: 'Offline', dot: 'bg-gray-400' },
]

export function PresenceSwitcher() {
  const { presence, setPresence } = usePresenceStore()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const mutation = useMutation({ mutationFn: (p: 'online' | 'busy' | 'offline') => inboxApi.updateMyStatus(p) })

  const handleSelect = (p: 'online' | 'busy' | 'offline') => {
    setPresence(p)
    setOpen(false)
    mutation.mutate(p)
  }

  useEffect(() => {
    if (!open) return
    const handle = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  const current = OPTIONS.find((o) => o.value === presence)!

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-hairline hover:bg-surface-soft transition-colors"
      >
        <span className={cn('w-2 h-2 rounded-full', current.dot)} />
        <span className="text-xs font-medium text-ink hidden sm:block">{current.label}</span>
        <svg className={cn('w-3.5 h-3.5 text-steel transition-transform', open && 'rotate-180')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-40 bg-canvas border border-hairline rounded-xl shadow-lg z-50 py-1 animate-scaleIn">
          {OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className={cn('w-full px-3 py-2 text-xs text-left flex items-center gap-2 hover:bg-surface-soft', presence === opt.value && 'bg-surface font-medium')}
            >
              <span className={cn('w-2 h-2 rounded-full', opt.dot)} />
              <span className="text-ink">{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
