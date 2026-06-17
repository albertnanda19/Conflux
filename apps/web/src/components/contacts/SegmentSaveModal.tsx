import { useState } from 'react'

interface SegmentSaveModalProps {
  open: boolean
  onClose: () => void
  onSave: (name: string) => void
  filterSummary: string
}

export function SegmentSaveModal({ open, onClose, onSave, filterSummary }: SegmentSaveModalProps) {
  const [name, setName] = useState('')

  if (!open) return null

  const handleSave = () => {
    if (!name.trim()) return
    onSave(name.trim())
    setName('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-canvas rounded-2xl shadow-xl w-[400px]">
        <div className="px-6 pt-6 pb-4 border-b border-hairline">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-ink">Simpan Segmen</h2>
              <p className="text-sm text-steel mt-0.5">Simpan filter saat ini sebagai segmen.</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-steel hover:bg-surface hover:text-ink transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-steel block mb-1">Nama Segmen</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Hot Leads Data Science"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave()
              }}
              className="w-full h-9 px-3 text-sm bg-canvas border border-hairline rounded-lg text-ink placeholder:text-stone focus:outline-none focus:ring-2 focus:ring-brand-blue-200"
            />
          </div>

          {filterSummary && (
            <div className="p-3 bg-surface rounded-lg border border-hairline">
              <span className="text-xs text-steel block mb-1">Filter Aktif</span>
              <p className="text-xs text-ink">{filterSummary}</p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-hairline flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-4 text-sm font-medium text-steel hover:text-ink border border-hairline rounded-lg hover:bg-surface transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!name.trim()}
            className="h-9 px-5 text-sm font-medium bg-brand-blue text-white rounded-lg hover:bg-brand-blue-deep transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  )
}
