import { useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAgentsStore } from '@/stores/agents'
import { AgentProfileHeader } from '@/components/agents/AgentProfileHeader'
import { AgentPerformanceCard } from '@/components/agents/AgentPerformanceCard'
import { AgentActivityTimeline } from '@/components/agents/AgentActivityTimeline'
import { AgentConversationList } from '@/components/agents/AgentConversationList'
import { AgentFormModal } from '@/components/agents/AgentFormModal'

export function AgentProfilePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const agents = useAgentsStore((s) => s.agents)
  const cycleStatus = useAgentsStore((s) => s.cycleStatus)
  const editAgent = useAgentsStore((s) => s.editAgent)

  const agent = agents.find((a) => a.id === id)
  const [editOpen, setEditOpen] = useState(false)

  const handleToggleStatus = useCallback(() => {
    if (id) cycleStatus(id)
  }, [id, cycleStatus])

  const handleSave = useCallback((data: Parameters<typeof editAgent>[1]) => {
    if (id && data) {
      editAgent(id, data)
      setEditOpen(false)
    }
  }, [id, editAgent])

  if (!agent) {
    return (
      <div className="p-8 h-full flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-lg font-semibold text-ink mb-2">Agent tidak ditemukan</h1>
          <p className="text-sm text-steel mb-4">Agent dengan ID &quot;{id}&quot; tidak ada.</p>
          <button
            type="button"
            onClick={() => navigate('/agents')}
            className="h-9 px-4 text-sm font-medium bg-brand-blue text-white rounded-lg hover:bg-brand-blue-deep transition-colors"
          >
            Kembali ke Agent
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 h-full overflow-y-auto">
      <AgentProfileHeader agent={agent} onEdit={() => setEditOpen(true)} onToggleStatus={handleToggleStatus} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 mb-6">
        <AgentPerformanceCard agent={agent} />
        <AgentActivityTimeline />
      </div>

      <AgentConversationList />

      <AgentFormModal
        open={editOpen}
        onOpenChange={setEditOpen}
        editingAgent={agent}
        onSave={handleSave}
      />
    </div>
  )
}
