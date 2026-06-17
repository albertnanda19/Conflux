import { useState, useRef, useEffect } from 'react'

export interface SavedSegment {
  id: string
  name: string
  filters: {
    status: string
    source: string
    agent: string
    search: string
  }
  createdAt: string
}

interface SegmentManagerProps {
  savedSegments: SavedSegment[]
  activeSegmentId: string | null
  onSelectSegment: (segment: SavedSegment | null) => void
  onDeleteSegment: (id: string) => void
}

export function SegmentManager({
  savedSegments,
  activeSegmentId,
  onSelectSegment,
  onDeleteSegment,
}: SegmentManagerProps) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const activeSegment = savedSegments.find((s) => s.id === activeSegmentId)

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`h-8 px-3 text-xs font-medium border rounded-lg transition-colors flex items-center gap-1.5 ${
          activeSegment
            ? 'bg-brand-blue-50 border-brand-blue-200 text-brand-blue-deep'
            : 'bg-canvas border-hairline text-steel hover:text-ink hover:border-brand-blue-200'
        }`}
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        {activeSegment ? activeSegment.name : 'Segmen'}
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-canvas rounded-lg border border-hairline shadow-md z-20 py-1">
          {activeSegment && (
            <button
              type="button"
              onClick={() => {
                onSelectSegment(null)
                setOpen(false)
              }}
              className="w-full px-3 py-2 text-xs text-left text-steel hover:bg-surface hover:text-ink transition-colors"
            >
              Tampilkan Semua
            </button>
          )}

          {savedSegments.length > 0 && (
            <>
              <div className="px-3 py-1.5 text-[10px] font-semibold text-steel uppercase tracking-wider">
                Segmen Tersimpan
              </div>
              {savedSegments.map((seg) => (
                <div
                  key={seg.id}
                  className={`flex items-center gap-2 px-3 py-2 text-xs cursor-pointer transition-colors group ${
                    activeSegmentId === seg.id
                      ? 'bg-brand-blue-50 text-brand-blue-deep'
                      : 'text-ink hover:bg-surface'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      onSelectSegment(seg)
                      setOpen(false)
                    }}
                    className="flex-1 text-left truncate"
                  >
                    {seg.name}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteSegment(seg.id)
                    }}
                    className="w-5 h-5 flex items-center justify-center text-steel hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </>
          )}

          {savedSegments.length === 0 && !activeSegment && (
            <div className="px-3 py-3 text-xs text-steel text-center">
              Belum ada segmen tersimpan.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
