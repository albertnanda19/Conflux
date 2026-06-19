import { useState, useCallback } from 'react'
import { PenIcon, XIcon, TrashIcon } from '@/icons'
import { type Label } from '@/types/inbox'
import { useLabels, useLabelMutations } from '@/hooks/inbox'
import { LabelTable } from '@/components/labels/LabelTable'
import { LabelManagerModal } from '@/components/labels/LabelManagerModal'

export function LabelsPage() {
  const { data: labels = [], isLoading } = useLabels()
  const { create, update, remove } = useLabelMutations()
  const [showModal, setShowModal] = useState(false)
  const [editingLabel, setEditingLabel] = useState<Label | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Label | null>(null)

  const handleSave = useCallback((name: string, color: string) => {
    if (editingLabel) {
      update.mutate({ id: editingLabel.id, body: { name, color } })
    } else {
      create.mutate({ name, color })
    }
    setEditingLabel(null)
  }, [editingLabel, create, update])

  const handleEdit = useCallback((label: Label) => {
    setEditingLabel(label)
    setShowModal(true)
  }, [])

  const handleDelete = useCallback((label: Label) => {
    setDeleteTarget(label)
  }, [])

  const confirmDelete = useCallback(() => {
    if (deleteTarget) {
      remove.mutate(deleteTarget.id)
      setDeleteTarget(null)
    }
  }, [deleteTarget, remove])

  return (
    <div className="flex-1 flex flex-col h-full bg-canvas min-w-0 overflow-hidden">
      <div className="h-14 px-6 flex items-center justify-between border-b border-hairline flex-shrink-0">
        <div>
          <h1 className="text-sm font-semibold text-ink">Label Management</h1>
          <p className="text-[11px] text-steel">Kelola label untuk mengkategorikan percakapan</p>
        </div>
        <button
          onClick={() => { setEditingLabel(null); setShowModal(true) }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-ink border border-hairline rounded-full hover:bg-surface transition-colors"
        >
          <PenIcon size={14} />
          Tambah Label
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <p className="px-4 py-10 text-sm text-steel text-center">Memuat label...</p>
        ) : (
          <LabelTable labels={labels} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </div>

      <LabelManagerModal
        open={showModal}
        onOpenChange={setShowModal}
        editingLabel={editingLabel}
        onSave={handleSave}
      />

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30">
          <div className="bg-canvas rounded-xl border border-hairline shadow-lg p-5 w-[380px]">
            <h3 className="text-sm font-semibold text-ink mb-1">Hapus Label?</h3>
            <p className="text-xs text-steel mb-4">
              Label <span className="font-semibold text-ink">{deleteTarget.name}</span> akan dihapus permanen. Percakapan yang menggunakan label ini tidak akan terhapus.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-steel border border-hairline rounded-full hover:bg-surface hover:text-ink transition-colors"
              >
                <XIcon size={14} />
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-50 text-red-600 border border-red-200 rounded-full hover:bg-red-100 hover:text-red-700 transition-colors"
              >
                <TrashIcon size={14} />
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
