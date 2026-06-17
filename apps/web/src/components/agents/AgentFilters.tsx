import { useAgentsStore } from '@/stores/agents'
import type { AgentRole, AgentProfile } from '@/mock/agents'

interface AgentFiltersProps {
  resultCount: number
}

const ROLE_OPTIONS: { value: AgentRole; label: string }[] = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'admin', label: 'Admin' },
  { value: 'supervisor', label: 'Supervisor' },
  { value: 'agent', label: 'Agent' },
]

const STATUS_OPTIONS: { value: AgentProfile['status']; label: string }[] = [
  { value: 'online', label: 'Online' },
  { value: 'busy', label: 'Busy' },
  { value: 'offline', label: 'Offline' },
]

const SORT_OPTIONS = [
  { value: 'name', label: 'Nama' },
  { value: 'status', label: 'Status' },
  { value: 'conversations', label: 'Percakapan' },
  { value: 'conversion', label: 'Konversi' },
]

const SELECT_CLASS = 'h-8 px-3 text-xs bg-canvas border border-hairline rounded-lg text-ink appearance-none cursor-pointer hover:border-brand-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue-200'

export function AgentFilters({ resultCount }: AgentFiltersProps) {
  const searchQuery = useAgentsStore((s) => s.searchQuery)
  const roleFilter = useAgentsStore((s) => s.roleFilter)
  const statusFilter = useAgentsStore((s) => s.statusFilter)
  const sortBy = useAgentsStore((s) => s.sortBy)
  const setSearchQuery = useAgentsStore((s) => s.setSearchQuery)
  const setRoleFilter = useAgentsStore((s) => s.setRoleFilter)
  const setStatusFilter = useAgentsStore((s) => s.setStatusFilter)
  const setSortBy = useAgentsStore((s) => s.setSortBy)

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-steel" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama atau email..."
            className="w-full h-9 pl-9 pr-3 text-sm bg-canvas border border-hairline rounded-lg text-ink placeholder:text-stone focus:outline-none focus:ring-2 focus:ring-brand-blue-200 transition-colors"
          />
        </div>
        <span className="text-xs text-steel">{resultCount} agent</span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <svg className="w-4 h-4 text-steel" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>

        <select
          value={roleFilter ?? ''}
          onChange={(e) => setRoleFilter((e.target.value || null) as AgentRole | null)}
          className={SELECT_CLASS}
        >
          <option value="">Semua Role</option>
          {ROLE_OPTIONS.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>

        <select
          value={statusFilter ?? ''}
          onChange={(e) => setStatusFilter((e.target.value || null) as AgentProfile['status'] | null)}
          className={SELECT_CLASS}
        >
          <option value="">Semua Status</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className={SELECT_CLASS}
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>Urut: {s.label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
