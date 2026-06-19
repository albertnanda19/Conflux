import { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { MOCK_CRM_CONTACTS, DEFAULT_PIPELINE_COLUMNS } from '@/mock/crm'
import { getAgents, type AgentProfile } from '@/mock/agents'
import { LABELS, type Label } from '@/mock/inbox'
import { ContactFilters } from '@/components/contacts/ContactFilters'
import { ContactTable } from '@/components/contacts/ContactTable'
import { BulkActionBar } from '@/components/contacts/BulkActionBar'
import { SegmentManager, type SavedSegment } from '@/components/contacts/SegmentManager'
import { SegmentSaveModal } from '@/components/contacts/SegmentSaveModal'
import { ImportContactsModal } from '@/components/contacts/ImportContactsModal'

const PAGE_SIZE = 10

const MOCK_SEGMENTS: SavedSegment[] = [
  {
    id: 'seg1',
    name: 'Hot Leads — Data Science',
    filters: { status: 'qualified', source: '', agent: '', search: '' },
    createdAt: '2026-06-15T08:00:00.000Z',
  },
  {
    id: 'seg2',
    name: 'Belum Ditugaskan',
    filters: { status: '', source: '', agent: 'none', search: '' },
    createdAt: '2026-06-16T10:00:00.000Z',
  },
]

export function ContactsPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sourceFilter, setSourceFilter] = useState('')
  const [agentFilter, setAgentFilter] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(1)

  const [savedSegments, setSavedSegments] = useState<SavedSegment[]>(MOCK_SEGMENTS)
  const [activeSegmentId, setActiveSegmentId] = useState<string | null>(null)
  const [saveModalOpen, setSaveModalOpen] = useState(false)
  const [importModalOpen, setImportModalOpen] = useState(false)
  const [contacts, setContacts] = useState(MOCK_CRM_CONTACTS)

  const [bulkStatusOpen, setBulkStatusOpen] = useState(false)
  const [bulkAssignOpen, setBulkAssignOpen] = useState(false)
  const [bulkLabelOpen, setBulkLabelOpen] = useState(false)
  const [pendingLabelIds, setPendingLabelIds] = useState<Set<string>>(new Set())

  const hasActiveFilters = search || statusFilter || sourceFilter || agentFilter

  const getFilterSummary = useCallback(() => {
    const parts: string[] = []
    if (search) parts.push(`Pencarian: "${search}"`)
    if (statusFilter) parts.push(`Status: ${statusFilter}`)
    if (sourceFilter) parts.push(`Sumber: ${sourceFilter}`)
    if (agentFilter) parts.push(`Agent: ${agentFilter}`)
    return parts.join(' · ') || 'Semua kontak'
  }, [search, statusFilter, sourceFilter, agentFilter])

  const handleSaveSegment = (name: string) => {
    const segment: SavedSegment = {
      id: `seg_${Date.now()}`,
      name,
      filters: { status: statusFilter, source: sourceFilter, agent: agentFilter, search },
      createdAt: new Date().toISOString(),
    }
    setSavedSegments((prev) => [...prev, segment])
    setActiveSegmentId(segment.id)
  }

  const handleSelectSegment = (segment: SavedSegment | null) => {
    if (!segment) {
      setActiveSegmentId(null)
      setSearch('')
      setStatusFilter('')
      setSourceFilter('')
      setAgentFilter('')
      return
    }
    setActiveSegmentId(segment.id)
    setSearch(segment.filters.search)
    setStatusFilter(segment.filters.status)
    setSourceFilter(segment.filters.source)
    setAgentFilter(segment.filters.agent === 'none' ? '' : segment.filters.agent)
    setPage(1)
  }

  const handleDeleteSegment = (id: string) => {
    setSavedSegments((prev) => prev.filter((s) => s.id !== id))
    if (activeSegmentId === id) setActiveSegmentId(null)
  }

  const handleExport = () => {
    const header = 'Nama,Phone,Email,Program,Status,Source,Agent'
    const rows = filteredContacts.map((c) => {
      const agentName = c.assignedAgentId
        ? contacts.find((ct) => ct.id === c.assignedAgentId)?.name ?? ''
        : ''
      return `"${c.name}","${c.phone ?? ''}","${c.email ?? ''}","${c.programInterest}","${c.pipelineStatus}","${c.source}","${agentName}"`
    })
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `kontak_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (rows: { name: string; phone: string; email: string; program: string }[]) => {
    const newContacts = rows.map((r, i) => ({
      id: `imported_${Date.now()}_${i}`,
      name: r.name,
      phone: r.phone || undefined,
      email: r.email || undefined,
      channelIdentifiers: [] as { channel: 'whatsapp' | 'instagram' | 'facebook'; identifier: string }[],
      pipelineStatus: 'new_lead' as const,
      source: 'whatsapp' as const,
      labels: [],
      activityLog: [{ id: `al_imp_${i}`, type: 'message_sent' as const, description: 'Diimport dari CSV', createdAt: new Date().toISOString() }],
      createdAt: new Date().toISOString(),
      programInterest: r.program || 'Belum Ditentukan',
      assignedAgentId: null,
    }))
    setContacts((prev) => [...newContacts, ...prev])
  }

  const filteredContacts = useMemo(() => {
    let result = contacts

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.phone?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q),
      )
    }

    if (statusFilter) {
      result = result.filter((c) => c.pipelineStatus === statusFilter)
    }

    if (sourceFilter) {
      result = result.filter((c) => c.source === sourceFilter)
    }

    if (agentFilter) {
      result = result.filter((c) => c.assignedAgentId === agentFilter)
    }

    return result
  }, [contacts, search, statusFilter, sourceFilter, agentFilter])

  const totalPages = Math.max(1, Math.ceil(filteredContacts.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginatedContacts = filteredContacts.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(paginatedContacts.map((c) => c.id)))
    } else {
      setSelectedIds(new Set())
    }
  }

  const handleSelectOne = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  const handleClearSelection = () => setSelectedIds(new Set())

  const handleBulkDelete = () => {
    setContacts((prev) => prev.filter((c) => !selectedIds.has(c.id)))
    handleClearSelection()
  }

  const handleBulkChangeStatus = (newStatus: string) => {
    setContacts((prev) =>
      prev.map((c) =>
        selectedIds.has(c.id) ? { ...c, pipelineStatus: newStatus as typeof c.pipelineStatus } : c,
      ),
    )
    setBulkStatusOpen(false)
    handleClearSelection()
  }

  const handleBulkAssign = (agent: AgentProfile | null) => {
    setContacts((prev) =>
      prev.map((c) =>
        selectedIds.has(c.id) ? { ...c, assignedAgentId: agent ? agent.id : null } : c,
      ),
    )
    setBulkAssignOpen(false)
    handleClearSelection()
  }

  const handleBulkAddLabel = () => {
    const labelsToAdd = LABELS.filter((l) => pendingLabelIds.has(l.id))
    setContacts((prev) =>
      prev.map((c) => {
        if (!selectedIds.has(c.id)) return c
        const existingIds = new Set(c.labels.map((l: Label) => l.id))
        const merged = [...c.labels, ...labelsToAdd.filter((l) => !existingIds.has(l.id))]
        return { ...c, labels: merged }
      }),
    )
    setBulkLabelOpen(false)
    setPendingLabelIds(new Set())
    handleClearSelection()
  }

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="mb-6 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-ink mb-1">Kontak</h1>
            <p className="text-steel text-sm">Daftar lead dan calon peserta.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setImportModalOpen(true)}
              className="h-9 px-4 text-sm font-medium text-steel hover:text-ink border border-hairline rounded-lg hover:bg-surface transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Import CSV
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="h-9 px-4 text-sm font-medium text-steel hover:text-ink border border-hairline rounded-lg hover:bg-surface transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <SegmentManager
            savedSegments={savedSegments}
            activeSegmentId={activeSegmentId}
            onSelectSegment={handleSelectSegment}
            onDeleteSegment={handleDeleteSegment}
          />

          {hasActiveFilters && !activeSegmentId && (
            <button
              type="button"
              onClick={() => setSaveModalOpen(true)}
              className="h-8 px-3 text-xs font-medium text-brand-blue-deep border border-brand-blue-200 bg-brand-blue-50 rounded-lg hover:bg-brand-blue-100 transition-colors flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Simpan sebagai Segmen
            </button>
          )}
        </div>

        <ContactFilters
          search={search}
          onSearchChange={(v) => { setSearch(v); setActiveSegmentId(null) }}
          statusFilter={statusFilter}
          onStatusChange={(v) => { setStatusFilter(v); setActiveSegmentId(null) }}
          sourceFilter={sourceFilter}
          onSourceChange={(v) => { setSourceFilter(v); setActiveSegmentId(null) }}
          agentFilter={agentFilter}
          onAgentChange={(v) => { setAgentFilter(v); setActiveSegmentId(null) }}
          resultCount={filteredContacts.length}
        />
      </div>

      <BulkActionBar
        selectedCount={selectedIds.size}
        onClearSelection={handleClearSelection}
        onAssign={() => setBulkAssignOpen(true)}
        onChangeStatus={() => setBulkStatusOpen(true)}
        onAddLabel={() => { setPendingLabelIds(new Set()); setBulkLabelOpen(true) }}
        onDelete={handleBulkDelete}
      />

      <div className="flex-1 min-h-0 overflow-auto mt-3">
        {paginatedContacts.length === 0 ? (
          <div className="card-base text-center py-12">
            <p className="text-sm text-steel">Tidak ada kontak yang cocok dengan filter.</p>
          </div>
        ) : (
          <ContactTable
            contacts={paginatedContacts}
            selectedIds={selectedIds}
            onSelectAll={handleSelectAll}
            onSelectOne={handleSelectOne}
            onSelectContact={(id) => navigate(`/contacts/${id}`)}
          />
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 flex-shrink-0">
          <span className="text-xs text-steel">
            Halaman {safePage} dari {totalPages} ({filteredContacts.length} kontak)
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="h-8 px-3 text-xs font-medium text-ink border border-hairline rounded-lg hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Sebelumnya
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                className={`w-8 h-8 text-xs font-medium rounded-lg transition-colors ${
                  p === safePage
                    ? 'bg-brand-blue text-white'
                    : 'text-ink border border-hairline hover:bg-surface'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              className="h-8 px-3 text-xs font-medium text-ink border border-hairline rounded-lg hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Berikutnya
            </button>
          </div>
        </div>
      )}

      <SegmentSaveModal
        open={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        onSave={handleSaveSegment}
        filterSummary={getFilterSummary()}
      />

      <ImportContactsModal
        open={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImport={handleImport}
      />

      {bulkStatusOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setBulkStatusOpen(false)} />
          <div className="relative bg-canvas rounded-2xl shadow-xl w-full max-w-xs mx-4 border border-hairline p-5 animate-in zoom-in-95 fade-in duration-200">
            <h3 className="text-sm font-semibold text-ink mb-1">Ubah Status</h3>
            <p className="text-xs text-steel mb-4">{selectedIds.size} kontak dipilih</p>
            <div className="space-y-1.5">
              {DEFAULT_PIPELINE_COLUMNS.map((col) => (
                <button
                  key={col.id}
                  onClick={() => handleBulkChangeStatus(col.id)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-surface transition-colors"
                >
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: col.color }} />
                  <span className="text-sm text-ink">{col.name}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setBulkStatusOpen(false)}
              className="mt-4 w-full h-8 text-xs font-medium text-steel hover:text-ink rounded-lg hover:bg-surface transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {bulkAssignOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setBulkAssignOpen(false)} />
          <div className="relative bg-canvas rounded-2xl shadow-xl w-full max-w-xs mx-4 border border-hairline p-5 animate-in zoom-in-95 fade-in duration-200">
            <h3 className="text-sm font-semibold text-ink mb-1">Assign ke Agent</h3>
            <p className="text-xs text-steel mb-4">{selectedIds.size} kontak dipilih</p>
            <div className="space-y-1.5 max-h-64 overflow-y-auto">
              <button
                onClick={() => handleBulkAssign(null)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-surface transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-hairline flex items-center justify-center text-xs font-semibold text-steel flex-shrink-0">—</div>
                <span className="text-sm text-steel">Lepas Assignment</span>
              </button>
              {getAgents().map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => handleBulkAssign(agent)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-surface transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                    {agent.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-ink truncate">{agent.name}</p>
                    <p className="text-xs text-steel capitalize">{agent.role}</p>
                  </div>
                  <span className={`ml-auto w-2 h-2 rounded-full flex-shrink-0 ${agent.status === 'online' ? 'bg-emerald-500' : agent.status === 'busy' ? 'bg-amber-500' : 'bg-hairline'}`} />
                </button>
              ))}
            </div>
            <button
              onClick={() => setBulkAssignOpen(false)}
              className="mt-4 w-full h-8 text-xs font-medium text-steel hover:text-ink rounded-lg hover:bg-surface transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {bulkLabelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setBulkLabelOpen(false)} />
          <div className="relative bg-canvas rounded-2xl shadow-xl w-full max-w-xs mx-4 border border-hairline p-5 animate-in zoom-in-95 fade-in duration-200">
            <h3 className="text-sm font-semibold text-ink mb-1">Tambah Label</h3>
            <p className="text-xs text-steel mb-4">{selectedIds.size} kontak dipilih</p>
            <div className="space-y-1.5">
              {LABELS.map((label) => {
                const selected = pendingLabelIds.has(label.id)
                return (
                  <button
                    key={label.id}
                    onClick={() => setPendingLabelIds((prev) => {
                      const next = new Set(prev)
                      if (next.has(label.id)) next.delete(label.id)
                      else next.add(label.id)
                      return next
                    })}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${selected ? 'bg-brand-blue-50' : 'hover:bg-surface'}`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: label.color }} />
                    <span className="text-sm text-ink flex-1">{label.name}</span>
                    {selected && (
                      <svg className="w-4 h-4 text-brand-blue-deep flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                )
              })}
            </div>
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={() => setBulkLabelOpen(false)}
                className="flex-1 h-8 text-xs font-medium text-steel hover:text-ink rounded-lg hover:bg-surface transition-colors border border-hairline"
              >
                Batal
              </button>
              <button
                onClick={handleBulkAddLabel}
                disabled={pendingLabelIds.size === 0}
                className="flex-1 h-8 text-xs font-semibold text-white bg-brand-blue-deep rounded-lg hover:bg-brand-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Tambahkan ({pendingLabelIds.size})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
