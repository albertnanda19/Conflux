import { useState } from 'react'
import { useCrmStore } from '@/stores/crm'

interface AddColumnModalProps {
  open: boolean
  onClose: () => void
}

const PRESET_COLORS = ['#4A7AFF', '#FF6B5A', '#E84393', '#7C3AED', '#10B981', '#F59E0B', '#888888', '#06B6D4']

export function AddColumnModal({ open, onClose }: AddColumnModalProps) {
  const addColumn = useCrmStore((s) => s.addColumn)
  const [name, setName] = useState('')
  const [color, setColor] = useState(PRESET_COLORS[0])

  if (!open) return null

  const handleAdd = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    addColumn(trimmed, color)
    setName('')
    setColor(PRESET_COLORS[0])
    onClose()
  }

  const handleClose = () => {
    setName('')
    setColor(PRESET_COLORS[0])
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
      <div className="relative bg-canvas rounded-2xl shadow-xl w-[400px]">
        <div className="px-6 pt-6 pb-4 border-b border-hairline">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-ink">Tambah Kolom Baru</h2>
              <p className="text-sm text-steel mt-0.5">Buat kolom pipeline baru.</p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-steel hover:bg-surface hover:text-ink transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">
          {name.trim() && (
            <div className="p-3 bg-surface rounded-lg border border-hairline flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-sm font-medium text-ink">{name.trim()}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Nama Kolom</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAdd() }}
              placeholder="Contoh: Follow Up, Negotiasi, dll."
              autoFocus
              className="w-full h-9 px-3 text-sm bg-canvas border border-hairline rounded-lg text-ink placeholder:text-steel focus:outline-none focus:ring-2 focus:ring-brand-blue-200 focus:border-brand-blue-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Warna</label>
            <div className="flex items-center gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full border-2 transition-all ${color === c ? 'border-ink scale-110' : 'border-transparent hover:scale-110'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-hairline flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="h-9 px-4 text-sm font-medium text-steel hover:text-ink border border-hairline rounded-lg hover:bg-surface transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleAdd}
            disabled={!name.trim()}
            className="h-9 px-5 text-sm font-medium bg-brand-blue text-white rounded-lg hover:bg-brand-blue-deep transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Tambah
          </button>
        </div>
      </div>
    </div>
  )
}
