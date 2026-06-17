import { useState } from 'react'
import { KanbanBoard } from '@/components/contacts/KanbanBoard'
import { PipelineFilters } from '@/components/contacts/PipelineFilters'
import { ColumnCustomizeModal } from '@/components/contacts/ColumnCustomizeModal'

export function PipelinePage() {
  const [columnModalOpen, setColumnModalOpen] = useState(false)

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="mb-6 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-ink mb-1">Pipeline</h1>
            <p className="text-steel text-sm">Drag & drop lead antar kolom untuk update status.</p>
          </div>
          <button
            type="button"
            onClick={() => setColumnModalOpen(true)}
            className="h-9 px-4 text-sm font-medium text-steel hover:text-ink border border-hairline rounded-lg hover:bg-surface transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Kustomisasi Kolom
          </button>
        </div>

        <PipelineFilters />
      </div>

      <KanbanBoard />

      <ColumnCustomizeModal
        open={columnModalOpen}
        onClose={() => setColumnModalOpen(false)}
      />
    </div>
  )
}
