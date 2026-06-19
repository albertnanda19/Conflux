import { useState, useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAgentsStore } from '@/stores/agents'
import { useAIAssistants, useAIAssistantMutations } from '@/hooks/ai-assistants'
import { AgentProfileHeader } from '@/components/agents/AgentProfileHeader'
import { AgentPerformanceCard } from '@/components/agents/AgentPerformanceCard'
import { AgentActivityTimeline } from '@/components/agents/AgentActivityTimeline'
import { AgentConversationList } from '@/components/agents/AgentConversationList'
import { AgentFormModal } from '@/components/agents/AgentFormModal'
import { AIAssistantAssignmentCard } from '@/components/ai-assistants/AIAssistantAssignmentCard'
import { AssignAIAssistantModal } from '@/components/ai-assistants/AssignAIAssistantModal'

export function AgentProfilePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const agents = useAgentsStore((s) => s.agents)
  const cycleStatus = useAgentsStore((s) => s.cycleStatus)
  const editAgent = useAgentsStore((s) => s.editAgent)
  const { data: assistants = [] } = useAIAssistants({})
  const { assign } = useAIAssistantMutations()

  const agent = agents.find((a) => a.id === id)
  const [editOpen, setEditOpen] = useState(false)
  const [assignOpen, setAssignOpen] = useState(false)

  const assignedAssistant = useMemo(() => {
    if (!agent?.aiAssistantId) return null
    return assistants.find((a) => a.id === agent.aiAssistantId) ?? null
  }, [agent?.aiAssistantId, assistants])

  const handleAssign = useCallback((assistantId: string) => {
    if (!id || !agent) return
    assign.mutate({ id: assistantId, agentId: id })
    editAgent(id, { aiAssistantId: assistantId })
    setAssignOpen(false)
  }, [id, agent, assign, editAgent])

  const handleUnassign = useCallback(() => {
    if (!id || !agent?.aiAssistantId) return
    assign.mutate({ id: agent.aiAssistantId, agentId: null })
    editAgent(id, { aiAssistantId: null })
    setAssignOpen(false)
  }, [id, agent?.aiAssistantId, assign, editAgent])

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
      <AgentProfileHeader agent={agent} assistant={assignedAssistant} onEdit={() => setEditOpen(true)} onToggleStatus={handleToggleStatus} />

      <div className="mb-6 animate-fade-in" style={{ animationDelay: '60ms' }}>
        <AIAssistantAssignmentCard
          assistant={assignedAssistant}
          onAssign={() => setAssignOpen(true)}
        />
      </div>

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

      <AssignAIAssistantModal
        open={assignOpen}
        onOpenChange={setAssignOpen}
        currentAssistantId={agent.aiAssistantId ?? null}
        assistants={assistants}
        onAssign={handleAssign}
        onUnassign={handleUnassign}
      />
    </div>
  )
}
