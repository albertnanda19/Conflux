import { useMemo, useState, useCallback } from 'react'
import { useAgentsStore } from '@/stores/agents'
import { AgentStatsOverview } from '@/components/agents/AgentStatsOverview'
import { AgentFilters } from '@/components/agents/AgentFilters'
import { AgentTable } from '@/components/agents/AgentTable'
import { AgentFormModal } from '@/components/agents/AgentFormModal'
import { AgentDeleteConfirm } from '@/components/agents/AgentDeleteConfirm'
import type { AgentProfile } from '@/mock/agents'

export function AgentsPage() {
  const agents = useAgentsStore((s) => s.agents)
  const searchQuery = useAgentsStore((s) => s.searchQuery)
  const roleFilter = useAgentsStore((s) => s.roleFilter)
  const statusFilter = useAgentsStore((s) => s.statusFilter)
  const sortBy = useAgentsStore((s) => s.sortBy)
  const getFilteredAgents = useAgentsStore((s) => s.getFilteredAgents)
  const addAgent = useAgentsStore((s) => s.addAgent)
  const editAgent = useAgentsStore((s) => s.editAgent)
  const removeAgent = useAgentsStore((s) => s.removeAgent)

  const filteredAgents = useMemo(() => getFilteredAgents(), [agents, searchQuery, roleFilter, statusFilter, sortBy, getFilteredAgents])

  const [formOpen, setFormOpen] = useState(false)
  const [editingAgent, setEditingAgent] = useState<AgentProfile | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AgentProfile | null>(null)

  const handleEdit = useCallback((agent: AgentProfile) => {
    setEditingAgent(agent)
    setFormOpen(true)
  }, [])

  const handleDelete = useCallback((agent: AgentProfile) => {
    setDeleteTarget(agent)
  }, [])

  const confirmDelete = useCallback(() => {
    if (deleteTarget) {
      removeAgent(deleteTarget.id)
      setDeleteTarget(null)
    }
  }, [deleteTarget, removeAgent])

  const handleSave = useCallback((data: { name: string; email: string; phone: string; role: 'super_admin' | 'admin' | 'supervisor' | 'agent'; team: string; timezone: string; maxConversations: number; status: 'online' | 'busy' | 'offline' }) => {
    if (editingAgent) {
      editAgent(editingAgent.id, data)
    } else {
      addAgent({ ...data, activeConversationCount: 0 })
    }
    setEditingAgent(null)
  }, [editingAgent, editAgent, addAgent])

  return (
    <div className="p-8 h-full">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-ink mb-1">Kelola Agent</h1>
          <p className="text-steel text-sm">
            Kelola tim sales, role, dan kapasitas percakapan.
          </p>
        </div>
        <button
          onClick={() => { setEditingAgent(null); setFormOpen(true) }}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-ink rounded-full hover:bg-charcoal transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Tambah Agent
        </button>
      </div>

      <AgentStatsOverview agents={filteredAgents} />
      <AgentFilters resultCount={filteredAgents.length} />

      <div className="card-base mt-4">
        {filteredAgents.length > 0 ? (
          <AgentTable agents={filteredAgents} onEdit={handleEdit} onDelete={handleDelete} />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-surface flex items-center justify-center text-2xl mb-4">
              👥
            </div>
            <p className="text-sm font-medium text-ink mb-1">Belum ada agent</p>
            <p className="text-xs text-steel mb-4">Tambahkan agent pertama untuk mulai mengelola tim.</p>
            <button
              onClick={() => { setEditingAgent(null); setFormOpen(true) }}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-ink rounded-full hover:bg-charcoal transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Tambah Agent
            </button>
          </div>
        )}
      </div>

      <AgentFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        editingAgent={editingAgent}
        onSave={handleSave}
      />

      {deleteTarget && (
        <AgentDeleteConfirm
          agent={deleteTarget}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}
