import { useState, useEffect } from 'react'
import { useCrmStore } from '@/stores/crm'

interface DeleteColumnConfirmProps {
  open: boolean
  columnId: string
  columnName: string
  onClose: () => void
}

export function DeleteColumnConfirm({ open, columnId, columnName, onClose }: DeleteColumnConfirmProps) {
  const { columns, contacts, removeColumn } = useCrmStore()
  const [canDelete, setCanDelete] = useState(true)
  const [reason, setReason] = useState('')

  useEffect(() => {
    if (!open) return

    const contactsInColumn = contacts.filter((c) => c.pipelineStatus === columnId)
    if (contactsInColumn.length > 0) {
      setCanDelete(false)
      setReason(`Ada ${contactsInColumn.length} contact di kolom ini. Pindahkan ke kolom lain terlebih dahulu.`)
    } else if (columns.length <= 1) {
      setCanDelete(false)
      setReason('Tidak bisa menghapus kolom terakhir. Minimal harus ada 1 kolom.')
    } else {
      setCanDelete(true)
      setReason('')
    }
  }, [open, columnId, columns, contacts])

  if (!open) return null

  const handleDelete = () => {
    removeColumn(columnId)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-canvas rounded-2xl shadow-xl w-[380px]">
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-ink">Hapus Kolom</h2>
              <p className="text-sm text-steel">Tindakan ini tidak dapat dibatalkan.</p>
            </div>
          </div>

          <div className="p-3 bg-surface rounded-lg border border-hairline mb-4">
            <span className="text-sm text-steel">Kolom yang akan dihapus:</span>
            <p className="text-sm font-medium text-ink mt-0.5">{columnName}</p>
          </div>

          {reason && (
            <div className="p-3 bg-red-50 rounded-lg border border-red-200 mb-4">
              <p className="text-sm text-red-700">{reason}</p>
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
            onClick={handleDelete}
            disabled={!canDelete}
            className="h-9 px-5 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  )
}
