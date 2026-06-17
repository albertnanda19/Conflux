import { MOCK_AGENTS } from '@/mock/inbox'
import { SOURCE_OPTIONS } from '@/mock/crm'
import { useCrmStore } from '@/stores/crm'

interface ContactFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusChange: (value: string) => void
  sourceFilter: string
  onSourceChange: (value: string) => void
  agentFilter: string
  onAgentChange: (value: string) => void
  resultCount: number
}

export function ContactFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sourceFilter,
  onSourceChange,
  agentFilter,
  onAgentChange,
  resultCount,
}: ContactFiltersProps) {
  const columns = useCrmStore((s) => s.columns)
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-steel" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari nama, email, atau telepon..."
            className="w-full h-9 pl-9 pr-3 text-sm bg-canvas border border-hairline rounded-lg text-ink placeholder:text-stone focus:outline-none focus:ring-2 focus:ring-brand-blue-200 transition-colors"
          />
        </div>

        <span className="text-xs text-steel">{resultCount} kontak</span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <svg className="w-4 h-4 text-steel" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>

        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="h-8 px-3 text-xs bg-canvas border border-hairline rounded-lg text-ink appearance-none cursor-pointer hover:border-brand-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue-200"
        >
          <option value="">Semua Status</option>
          {columns.map((col) => (
            <option key={col.id} value={col.id}>{col.name}</option>
          ))}
        </select>

        <select
          value={sourceFilter}
          onChange={(e) => onSourceChange(e.target.value)}
          className="h-8 px-3 text-xs bg-canvas border border-hairline rounded-lg text-ink appearance-none cursor-pointer hover:border-brand-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue-200"
        >
          <option value="">Semua Sumber</option>
          {SOURCE_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        <select
          value={agentFilter}
          onChange={(e) => onAgentChange(e.target.value)}
          className="h-8 px-3 text-xs bg-canvas border border-hairline rounded-lg text-ink appearance-none cursor-pointer hover:border-brand-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue-200"
        >
          <option value="">Semua Agent</option>
          {MOCK_AGENTS.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
