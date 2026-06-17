import { useState } from 'react'
import { useCrmStore } from '@/stores/crm'

interface ColumnCustomizeModalProps {
  open: boolean
  onClose: () => void
}

const PRESET_COLORS = ['#4A7AFF', '#FF6B5A', '#E84393', '#7C3AED', '#10B981', '#F59E0B', '#888888', '#06B6D4']

export function ColumnCustomizeModal({ open, onClose }: ColumnCustomizeModalProps) {
  const { columns, renameColumn, addColumn, removeColumn } = useCrmStore()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState(PRESET_COLORS[0])

  if (!open) return null

  const handleStartEdit = (id: string, currentName: string) => {
    setEditingId(id)
    setEditValue(currentName)
  }

  const handleSaveEdit = (id: string) => {
    if (!editValue.trim()) return
    renameColumn(id, editValue.trim())
    setEditingId(null)
  }

  const handleAdd = () => {
    if (!newName.trim()) return
    addColumn(newName.trim(), newColor)
    setNewName('')
    setNewColor(PRESET_COLORS[0])
    setShowAdd(false)
  }

  const handleDelete = (id: string) => {
    removeColumn(id)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-canvas rounded-2xl shadow-xl w-[420px] max-h-[80vh] flex flex-col">
        <div className="px-6 pt-6 pb-4 border-b border-hairline">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-ink">Kustomisasi Kolom</h2>
              <p className="text-sm text-steel mt-0.5">Ubah nama, tambah, atau hapus kolom pipeline.</p>
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

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
          {columns.map((col) => (
            <div
              key={col.id}
              className="flex items-center gap-3 p-3 bg-surface rounded-lg border border-hairline group"
            >
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: col.color }}
              />

              {editingId === col.id ? (
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit(col.id)
                    if (e.key === 'Escape') setEditingId(null)
                  }}
                  autoFocus
                  className="flex-1 h-7 px-2 text-sm bg-canvas border border-brand-blue-200 rounded text-ink focus:outline-none focus:ring-2 focus:ring-brand-blue-200"
                />
              ) : (
                <span className="flex-1 text-sm font-medium text-ink">{col.name}</span>
              )}

              <div className="flex items-center gap-1">
                {editingId === col.id ? (
                  <button
                    type="button"
                    onClick={() => handleSaveEdit(col.id)}
                    className="w-7 h-7 rounded flex items-center justify-center text-emerald-600 hover:bg-emerald-50 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleStartEdit(col.id, col.name)}
                    className="w-7 h-7 rounded flex items-center justify-center text-steel hover:bg-canvas hover:text-ink transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(col.id)}
                  className="w-7 h-7 rounded flex items-center justify-center text-steel hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}

          {showAdd ? (
            <div className="p-3 bg-brand-blue-50 rounded-lg border border-brand-blue-200 space-y-3">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nama kolom baru"
                autoFocus
                className="w-full h-8 px-3 text-sm bg-canvas border border-hairline rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-brand-blue-200"
              />
              <div className="flex items-center gap-2">
                <span className="text-xs text-steel">Warna:</span>
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setNewColor(c)}
                    className={`w-5 h-5 rounded-full border-2 transition-all ${newColor === c ? 'border-ink scale-110' : 'border-transparent hover:scale-110'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={!newName.trim()}
                  className="h-8 px-4 text-sm font-medium bg-brand-blue text-white rounded-lg hover:bg-brand-blue-deep transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Tambah
                </button>
                <button
                  type="button"
                  onClick={() => { setShowAdd(false); setNewName('') }}
                  className="h-8 px-4 text-sm text-steel hover:text-ink transition-colors"
                >
                  Batal
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowAdd(true)}
              className="w-full p-3 border-2 border-dashed border-hairline rounded-lg text-sm text-steel hover:border-brand-blue-200 hover:text-brand-blue transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Tambah Kolom Baru
            </button>
          )}
        </div>

        <div className="px-6 py-4 border-t border-hairline flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-4 text-sm font-medium text-steel hover:text-ink border border-hairline rounded-lg hover:bg-surface transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}
