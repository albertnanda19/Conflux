import { useState, useRef, useEffect } from 'react'
import { useCrmStore } from '@/stores/crm'
import { AddColumnModal } from './AddColumnModal'
import { DeleteColumnConfirm } from './DeleteColumnConfirm'

interface KanbanColumnHeaderProps {
  columnId: string
  color: string
  name: string
  count: number
  totalValue: string
}

export function KanbanColumnHeader({ columnId, color, name, count, totalValue }: KanbanColumnHeaderProps) {
  const renameColumn = useCrmStore((s) => s.renameColumn)
  const [menuOpen, setMenuOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(name)
  const [addColumnOpen, setAddColumnOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  useEffect(() => {
    if (editing) inputRef.current?.select()
  }, [editing])

  const handleStartRename = () => {
    setEditValue(name)
    setEditing(true)
    setMenuOpen(false)
  }

  const handleSaveRename = () => {
    const trimmed = editValue.trim()
    if (trimmed && trimmed !== name) {
      renameColumn(columnId, trimmed)
    }
    setEditing(false)
  }

  const handleCancelRename = () => {
    setEditValue(name)
    setEditing(false)
  }

  return (
    <>
    <div className="px-4 pt-4 pb-3 flex items-center gap-2">
      <div
        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: color }}
      />

      {editing ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSaveRename()
            if (e.key === 'Escape') handleCancelRename()
          }}
          onBlur={handleSaveRename}
          className="flex-1 h-6 px-2 text-sm font-medium bg-canvas border border-brand-blue-200 rounded text-ink focus:outline-none focus:ring-2 focus:ring-brand-blue-200"
        />
      ) : (
        <span className="text-sm font-medium text-ink">{name}</span>
      )}

      <span className="text-xs text-steel bg-canvas rounded-full px-2 py-0.5">
        {count}
      </span>
      <div className="ml-auto flex items-center gap-2">
        {totalValue && (
          <span className="text-[11px] text-steel">
            {totalValue}
          </span>
        )}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-6 h-6 rounded flex items-center justify-center text-steel hover:bg-canvas hover:text-ink transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="5" r="1" fill="currentColor" stroke="none" />
              <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
              <circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" />
            </svg>
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-44 bg-canvas border border-hairline rounded-lg shadow-lg py-1 z-50">
              <button
                type="button"
                onClick={handleStartRename}
                className="w-full px-3 py-2 text-left text-sm text-ink hover:bg-surface flex items-center gap-2"
              >
                <svg className="w-3.5 h-3.5 text-steel" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Ubah Nama Kolom
              </button>
              <button
                type="button"
                onClick={() => { setMenuOpen(false); setAddColumnOpen(true) }}
                className="w-full px-3 py-2 text-left text-sm text-ink hover:bg-surface flex items-center gap-2"
              >
                <svg className="w-3.5 h-3.5 text-steel" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Tambah Kolom
              </button>
              <div className="h-px bg-hairline my-1" />
              <button
                type="button"
                onClick={() => { setMenuOpen(false); setDeleteOpen(true) }}
                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Hapus Kolom
              </button>
            </div>
          )}
        </div>
      </div>
    </div>

    <AddColumnModal open={addColumnOpen} onClose={() => setAddColumnOpen(false)} />
    <DeleteColumnConfirm open={deleteOpen} columnId={columnId} columnName={name} onClose={() => setDeleteOpen(false)} />
    </>
  )
}
