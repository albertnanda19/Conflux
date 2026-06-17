import { useState, useCallback } from 'react'
import type { AIAssistant } from '@/mock/ai-assistants'
import { useAgentsStore } from '@/stores/agents'
import { AgentAvatar } from '@/components/agents/AgentAvatar'
import { AgentRoleBadge } from '@/components/agents/AgentRoleBadge'
import { AgentStatusBadge } from '@/components/agents/AgentStatusBadge'

interface AssignAgentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  assistant: AIAssistant
  onAssign: (agentId: string) => void
  onUnassign: () => void
}

export function AssignAgentModal({ open, onOpenChange, assistant, onAssign, onUnassign }: AssignAgentModalProps) {
  const agents = useAgentsStore((s) => s.agents)
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(assistant.assignedAgentId)

  const currentAgent = assistant.assignedAgentId
    ? agents.find((a) => a.id === assistant.assignedAgentId)
    : null

  const availableAgents = agents.filter(
    (a) => a.id !== assistant.assignedAgentId && a.role !== 'super_admin',
  )

  const handleConfirm = useCallback(() => {
    if (selectedAgentId && selectedAgentId !== assistant.assignedAgentId) {
      onAssign(selectedAgentId)
      onOpenChange(false)
    }
  }, [selectedAgentId, assistant.assignedAgentId, onAssign, onOpenChange])

  const handleUnassign = useCallback(() => {
    setSelectedAgentId(null)
    onUnassign()
    onOpenChange(false)
  }, [onUnassign, onOpenChange])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
      <div className="relative bg-canvas rounded-2xl shadow-xl w-full max-w-md mx-4 border border-hairline overflow-hidden animate-in zoom-in-95 fade-in duration-200">
        <div className="px-6 py-4 border-b border-hairline-soft">
          <h2 className="text-base font-semibold text-ink">Assign AI Assistant ke Agent</h2>
          <p className="text-xs text-steel mt-0.5">{assistant.name} akan menangani chat ketika agent offline/busy.</p>
        </div>

        <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
          {currentAgent && (
            <div className="mb-4">
              <p className="text-xs font-medium text-steel uppercase tracking-wider mb-2">Saat ini di-assign ke</p>
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-soft border border-hairline-soft">
                <div className="flex items-center gap-3">
                  <AgentAvatar initials={currentAgent.initials} status={currentAgent.status} size="sm" />
                  <div>
                    <p className="text-sm font-medium text-ink">{currentAgent.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <AgentRoleBadge role={currentAgent.role} />
                      <AgentStatusBadge status={currentAgent.status} />
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleUnassign}
                  className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors"
                >
                  Lepas
                </button>
              </div>
            </div>
          )}

          <div>
            <p className="text-xs font-medium text-steel uppercase tracking-wider mb-2">
              {currentAgent ? 'Ganti ke agent lain' : 'Pilih agent'}
            </p>
            {availableAgents.length === 0 ? (
              <p className="text-sm text-stone text-center py-6">Semua agent sudah memiliki AI Assistant.</p>
            ) : (
              <div className="space-y-2">
                {availableAgents.map((agent) => (
                  <button
                    key={agent.id}
                    onClick={() => setSelectedAgentId(agent.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      selectedAgentId === agent.id
                        ? 'border-brand-blue-deep bg-brand-blue-50 ring-1 ring-brand-blue-deep'
                        : 'border-hairline-soft hover:border-brand-blue-200'
                    }`}
                  >
                    <AgentAvatar initials={agent.initials} status={agent.status} size="sm" />
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-ink">{agent.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <AgentRoleBadge role={agent.role} />
                        <AgentStatusBadge status={agent.status} />
                      </div>
                    </div>
                    {selectedAgentId === agent.id && (
                      <svg className="w-5 h-5 text-brand-blue-deep flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-hairline-soft bg-surface-soft/30">
          <button
            onClick={() => onOpenChange(false)}
            className="h-9 px-4 text-sm font-medium text-steel hover:text-ink rounded-full hover:bg-surface transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedAgentId || selectedAgentId === assistant.assignedAgentId}
            className="h-9 px-5 text-sm font-semibold text-white bg-brand-blue-deep rounded-full hover:bg-brand-blue-700 transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            {selectedAgentId === assistant.assignedAgentId ? 'Sudah di-assign' : 'Assign'}
          </button>
        </div>
      </div>
    </div>
  )
}
