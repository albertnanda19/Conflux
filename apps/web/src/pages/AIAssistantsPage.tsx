import { useMemo, useState, useCallback } from 'react'
import { useAIAssistantsStore } from '@/stores/ai-assistants'
import { useAIAssistants, useAIAssistantMutations } from '@/hooks/ai-assistants'
import { AIAssistantStats } from '@/components/ai-assistants/AIAssistantStats'
import { AIAssistantCard } from '@/components/ai-assistants/AIAssistantCard'
import { AIAssistantFormModal } from '@/components/ai-assistants/AIAssistantFormModal'
import type { AIAssistant } from '@/types/ai'

export function AIAssistantsPage() {
  const searchQuery = useAIAssistantsStore((s) => s.searchQuery)
  const statusFilter = useAIAssistantsStore((s) => s.statusFilter)
  const setSearchQuery = useAIAssistantsStore((s) => s.setSearchQuery)
  const setStatusFilter = useAIAssistantsStore((s) => s.setStatusFilter)

  const { data: filtered = [], isLoading } = useAIAssistants({ search: searchQuery, status: statusFilter })
  const { data: allAssistants = [] } = useAIAssistants({})
  const { create, update, remove } = useAIAssistantMutations()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<AIAssistant | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AIAssistant | null>(null)

  const stats = useMemo(() => ({
    total: allAssistants.length,
    active: allAssistants.filter((a) => a.status === 'active').length,
    draft: allAssistants.filter((a) => a.status === 'draft').length,
    unassigned: allAssistants.filter((a) => !a.assignedAgentId).length,
  }), [allAssistants])

  const handleEdit = useCallback((assistant: AIAssistant) => {
    setEditing(assistant)
    setFormOpen(true)
  }, [])

  const handleDelete = useCallback((assistant: AIAssistant) => {
    setDeleteTarget(assistant)
  }, [])

  const confirmDelete = useCallback(() => {
    if (deleteTarget) {
      remove.mutate(deleteTarget.id)
      setDeleteTarget(null)
    }
  }, [deleteTarget, remove])

  const handleSave = useCallback((data: { name: string; description: string; avatar: string; persona: { name: string; language: string; tone: 'formal' | 'semi-formal' | 'casual'; systemPrompt: string } }) => {
    if (editing) {
      update.mutate({ id: editing.id, patch: data })
    } else {
      create.mutate({ ...data, status: 'draft' })
    }
    setEditing(null)
  }, [editing, create, update])

  return (
    <div className="p-8 h-full">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-ink mb-1">AI Assistant</h1>
          <p className="text-steel text-sm">
            Kelola AI Assistant yang bisa di-assign ke agent untuk menangani chat secara otomatis.
          </p>
        </div>
        <button
          onClick={() => { setEditing(null); setFormOpen(true) }}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-brand-blue-deep rounded-full hover:bg-brand-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Buat AI Assistant
        </button>
      </div>

      <AIAssistantStats stats={[
        { label: 'Total AI Assistant', value: stats.total, color: 'bg-surface text-ink' },
        { label: 'Aktif', value: stats.active, color: 'bg-emerald-50 text-emerald-600' },
        { label: 'Draft', value: stats.draft, color: 'bg-stone/10 text-stone' },
        { label: 'Belum Di-assign', value: stats.unassigned, color: 'bg-amber-50 text-amber-600' },
      ]} />

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari AI Assistant..."
            className="w-full h-10 pl-10 pr-4 text-sm text-ink bg-canvas border border-hairline-soft rounded-full focus:outline-none focus:ring-2 focus:ring-brand-blue-deep focus:ring-offset-1 placeholder:text-stone"
          />
        </div>
        <div className="flex gap-1 p-1 bg-surface-soft rounded-full">
          {(['all', 'active', 'draft', 'paused'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
                statusFilter === f
                  ? 'bg-brand-blue-deep text-white shadow-sm'
                  : 'text-steel hover:text-ink'
              }`}
            >
              {f === 'all' ? 'Semua' : f === 'active' ? 'Aktif' : f === 'draft' ? 'Draft' : 'Jeda'}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-surface-soft animate-pulse" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((assistant, i) => (
            <AIAssistantCard
              key={assistant.id}
              assistant={assistant}
              onEdit={handleEdit}
              onDelete={handleDelete}
              index={i}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
          <div className="w-14 h-14 rounded-full bg-surface flex items-center justify-center text-2xl mb-4">
            🤖
          </div>
          <p className="text-sm font-medium text-ink mb-1">Belum ada AI Assistant</p>
          <p className="text-xs text-steel mb-4">Buat AI Assistant pertama untuk mulai mengotomasi percakapan.</p>
          <button
            onClick={() => { setEditing(null); setFormOpen(true) }}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand-blue-deep rounded-full hover:bg-brand-blue-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Buat AI Assistant
          </button>
        </div>
      )}

      <AIAssistantFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        editingAssistant={editing}
        onSave={handleSave}
      />

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-canvas rounded-2xl shadow-xl w-full max-w-sm mx-4 border border-hairline p-6 text-center animate-in zoom-in-95 fade-in duration-200">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-xl mx-auto mb-4">
              🗑️
            </div>
            <h3 className="text-base font-semibold text-ink mb-1">Hapus AI Assistant?</h3>
            <p className="text-sm text-steel mb-1">
              <span className="font-medium">{deleteTarget.name}</span> akan dihapus permanen.
            </p>
            <p className="text-xs text-stone mb-5">Agent yang di-assign ke AI Assistant ini akan kehilangan asisten mereka.</p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="h-9 px-4 text-sm font-medium text-steel hover:text-ink rounded-full hover:bg-surface transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="h-9 px-5 text-sm font-semibold text-white bg-red-500 rounded-full hover:bg-red-600 transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
