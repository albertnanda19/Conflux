interface BulkActionBarProps {
  selectedCount: number
  onClearSelection: () => void
  onAssign: () => void
  onChangeStatus: () => void
  onAddLabel: () => void
  onDelete: () => void
}

export function BulkActionBar({
  selectedCount,
  onClearSelection,
  onAssign,
  onChangeStatus,
  onAddLabel,
  onDelete,
}: BulkActionBarProps) {
  if (selectedCount === 0) return null

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-brand-blue-50 border border-brand-blue-200 rounded-lg">
      <span className="text-sm font-medium text-brand-blue-deep">
        {selectedCount} kontak dipilih
      </span>

      <div className="flex items-center gap-2 ml-auto">
        <button
          type="button"
          onClick={onAssign}
          className="h-8 px-3 text-xs font-medium text-ink border border-hairline rounded-lg bg-canvas hover:bg-surface transition-colors"
        >
          Ubah Agent
        </button>
        <button
          type="button"
          onClick={onChangeStatus}
          className="h-8 px-3 text-xs font-medium text-ink border border-hairline rounded-lg bg-canvas hover:bg-surface transition-colors"
        >
          Ubah Status
        </button>
        <button
          type="button"
          onClick={onAddLabel}
          className="h-8 px-3 text-xs font-medium text-ink border border-hairline rounded-lg bg-canvas hover:bg-surface transition-colors"
        >
          Tambah Label
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="h-8 px-3 text-xs font-medium text-red-600 border border-red-200 rounded-lg bg-canvas hover:bg-red-50 transition-colors"
        >
          Hapus
        </button>
        <button
          type="button"
          onClick={onClearSelection}
          className="w-8 h-8 flex items-center justify-center text-steel hover:text-ink rounded-lg hover:bg-surface transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
