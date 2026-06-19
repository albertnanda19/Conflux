import { XIcon, TrashIcon } from '@/icons'
import type { AgentProfile } from '@/mock/agents'

interface AgentDeleteConfirmProps {
  agent: AgentProfile
  onConfirm: () => void
  onCancel: () => void
}

export function AgentDeleteConfirm({ agent, onConfirm, onCancel }: AgentDeleteConfirmProps) {
  const hasActive = agent.activeConversationCount > 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 animate-fade-in">
      <div className="bg-canvas rounded-xl border border-hairline shadow-lg p-5 w-[380px] animate-fade-in">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
            <TrashIcon size={18} className="text-red-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink">Hapus Agent?</h3>
            <p className="text-xs text-steel mt-0.5">
              <span className="font-semibold text-ink">{agent.name}</span> akan dihapus dari daftar agent.
            </p>
          </div>
        </div>

        {hasActive && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4">
            <p className="text-[11px] text-amber-700">
              ⚠️ Agent ini masih memiliki <span className="font-semibold">{agent.activeConversationCount} percakapan aktif</span>. Selesaikan atau transfer percakapan terlebih dahulu.
            </p>
          </div>
        )}

        {!hasActive && (
          <p className="text-xs text-steel mb-4">
            Tindakan ini tidak dapat dibatalkan.
          </p>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-steel border border-hairline rounded-full hover:bg-surface hover:text-ink transition-colors"
          >
            <XIcon size={14} />
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={hasActive}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-50 text-red-600 border border-red-200 rounded-full hover:bg-red-100 hover:text-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-red-50"
          >
            <TrashIcon size={14} />
            Hapus
          </button>
        </div>
      </div>
    </div>
  )
}
