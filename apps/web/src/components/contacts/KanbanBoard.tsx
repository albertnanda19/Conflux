import { useRef, useCallback } from 'react'
import { useCrmStore } from '@/stores/crm'
import { KanbanCard } from './KanbanCard'
import { KanbanColumnHeader } from './KanbanColumnHeader'
import type { PipelineStatus } from '@/mock/inbox'
import { formatCurrency } from '@/mock/crm'

export function KanbanBoard() {
  const { columns, getFilteredContacts, moveContact } = useCrmStore()
  const contacts = getFilteredContacts()
  const dragOverColumnRef = useRef<string | null>(null)

  const clearDragHighlight = useCallback(() => {
    if (dragOverColumnRef.current) {
      const el = document.getElementById(`kanban-col-${dragOverColumnRef.current}`)
      el?.classList.remove('ring-2', 'ring-brand-blue-200', 'bg-brand-blue-50')
      dragOverColumnRef.current = null
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const handleDragEnter = useCallback((e: React.DragEvent, colId: string) => {
    e.preventDefault()
    if (dragOverColumnRef.current === colId) return
    clearDragHighlight()
    dragOverColumnRef.current = colId
    const el = document.getElementById(`kanban-col-${colId}`)
    el?.classList.add('ring-2', 'ring-brand-blue-200', 'bg-brand-blue-50')
  }, [clearDragHighlight])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    const related = e.relatedTarget as HTMLElement | null
    const current = e.currentTarget as HTMLElement
    if (related && current.contains(related)) return
    const colId = current.id.replace('kanban-col-', '')
    if (dragOverColumnRef.current === colId) {
      clearDragHighlight()
    }
  }, [clearDragHighlight])

  const handleDrop = useCallback((e: React.DragEvent, targetStatus: string) => {
    e.preventDefault()
    clearDragHighlight()
    const contactId = e.dataTransfer.getData('text/plain')
    if (contactId) {
      moveContact(contactId, targetStatus as PipelineStatus)
    }
  }, [clearDragHighlight, moveContact])

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 min-h-[calc(100vh-220px)]">
      {columns.map((col) => {
        const colContacts = contacts.filter((c) => c.pipelineStatus === col.id)
        const totalValue = colContacts.reduce((sum, c) => sum + c.programValue, 0)

        return (
          <div
            key={col.id}
            id={`kanban-col-${col.id}`}
            className="flex-shrink-0 w-72 bg-surface rounded-xl flex flex-col transition-colors"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
            onDragEnter={(e) => handleDragEnter(e, col.id)}
            onDragLeave={handleDragLeave}
          >
            <KanbanColumnHeader
              columnId={col.id}
              color={col.color}
              name={col.name}
              count={colContacts.length}
              totalValue={totalValue > 0 ? formatCurrency(totalValue) : ''}
            />

            <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2 min-h-[80px] rounded-b-xl">
              {colContacts.length === 0 ? (
                <div className="text-xs text-steel text-center py-6 italic border-2 border-dashed border-hairline rounded-lg">
                  Tidak ada lead
                </div>
              ) : (
                colContacts.map((contact) => (
                  <KanbanCard key={contact.id} contact={contact} />
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
