import { useCrmStore } from '@/stores/crm'
import { MOCK_AGENTS } from '@/mock/inbox'
import { PROGRAM_OPTIONS, SOURCE_OPTIONS } from '@/mock/crm'

export function PipelineFilters() {
  const { agentFilter, programFilter, sourceFilter, setAgentFilter, setProgramFilter, setSourceFilter, resetFilters } = useCrmStore()

  const hasActiveFilter = agentFilter || programFilter || sourceFilter

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-steel" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <span className="text-sm text-steel font-medium">Filter:</span>
      </div>

      <select
        value={agentFilter ?? ''}
        onChange={(e) => setAgentFilter(e.target.value || null)}
        className="h-8 px-3 text-sm bg-canvas border border-hairline rounded-lg text-ink appearance-none cursor-pointer hover:border-brand-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue-200"
      >
        <option value="">Semua Agent</option>
        {MOCK_AGENTS.map((a) => (
          <option key={a.id} value={a.id}>{a.name}</option>
        ))}
      </select>

      <select
        value={programFilter ?? ''}
        onChange={(e) => setProgramFilter(e.target.value || null)}
        className="h-8 px-3 text-sm bg-canvas border border-hairline rounded-lg text-ink appearance-none cursor-pointer hover:border-brand-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue-200"
      >
        <option value="">Semua Program</option>
        {PROGRAM_OPTIONS.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      <select
        value={sourceFilter ?? ''}
        onChange={(e) => setSourceFilter((e.target.value || null) as 'whatsapp' | 'instagram' | 'facebook' | null)}
        className="h-8 px-3 text-sm bg-canvas border border-hairline rounded-lg text-ink appearance-none cursor-pointer hover:border-brand-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue-200"
      >
        <option value="">Semua Sumber</option>
        {SOURCE_OPTIONS.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>

      {hasActiveFilter && (
        <button
          type="button"
          onClick={resetFilters}
          className="h-8 px-3 text-xs font-medium text-coral hover:bg-coral/10 rounded-lg transition-colors flex items-center gap-1"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Reset
        </button>
      )}
    </div>
  )
}
