import { useState } from 'react'
import { XIcon } from '@/icons'
import { SegmentFilterChips } from './SegmentFilterChips'
import { SegmentPreview } from './SegmentPreview'

interface FilterRow {
  id: string
  type: 'programs' | 'sources' | 'pipelineStatuses' | 'labels' | 'dateRange' | 'unrepliedOnly'
  label: string
  value: string
}

const PROGRAM_OPTIONS = ['Data Science', 'UX Design', 'Full-Stack Web Dev', 'Mobile Dev', 'Cloud Computing']
const SOURCE_OPTIONS = [
  { value: 'whatsapp_organic', label: 'WhatsApp Organik' },
  { value: 'instagram_ads', label: 'Instagram Ads' },
  { value: 'facebook_ads', label: 'Facebook Ads' },
  { value: 'website', label: 'Website' },
  { value: 'referral', label: 'Referral' },
]
const PIPELINE_OPTIONS = [
  { value: 'new_lead', label: 'New Lead' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'proposal_sent', label: 'Proposal Sent' },
  { value: 'closed_won', label: 'Closed Won' },
  { value: 'closed_lost', label: 'Closed Lost' },
]
const LABEL_OPTIONS = [
  { value: 'l1', label: 'Hot Lead' },
  { value: 'l2', label: 'VIP' },
  { value: 'l3', label: 'Needs Follow Up' },
  { value: 'l5', label: 'Instagram Lead' },
]

const FILTER_TYPE_OPTIONS = [
  { value: 'programs', label: 'Program' },
  { value: 'sources', label: 'Sumber Lead' },
  { value: 'pipelineStatuses', label: 'Status Pipeline' },
  { value: 'labels', label: 'Label' },
  { value: 'dateRange', label: 'Rentang Tanggal' },
  { value: 'unrepliedOnly', label: 'Belum Dibalas' },
]

function getOptionsForType(type: string): { value: string; label: string }[] {
  switch (type) {
    case 'programs':
      return PROGRAM_OPTIONS.map((p) => ({ value: p, label: p }))
    case 'sources':
      return SOURCE_OPTIONS
    case 'pipelineStatuses':
      return PIPELINE_OPTIONS
    case 'labels':
      return LABEL_OPTIONS
    default:
      return []
  }
}

interface SegmentBuilderProps {
  initialFilters?: FilterRow[]
}

export function SegmentBuilder({ initialFilters = [] }: SegmentBuilderProps) {
  const [filters, setFilters] = useState<FilterRow[]>(initialFilters)
  const [showAddRow, setShowAddRow] = useState(false)
  const [newFilterType, setNewFilterType] = useState('programs')
  const [newFilterValue, setNewFilterValue] = useState('')

  const activeFilterTypes = filters.map((f) => f.type)
  const availableTypes = FILTER_TYPE_OPTIONS.filter((t) => !activeFilterTypes.includes(t.value as FilterRow['type']))
  const selectedTypeConfig = getOptionsForType(newFilterType)
  const isDateOrBool = newFilterType === 'dateRange' || newFilterType === 'unrepliedOnly'

  function handleAddFilter() {
    if (!newFilterType) return

    if (newFilterType === 'unrepliedOnly') {
      const exists = filters.some((f) => f.type === 'unrepliedOnly')
      if (!exists) {
        setFilters((prev) => [...prev, { id: `f-${Date.now()}`, type: 'unrepliedOnly', label: 'Belum Dibalas', value: 'true' }])
      }
      setShowAddRow(false)
      setNewFilterType('programs')
      setNewFilterValue('')
      return
    }

    if (newFilterType === 'dateRange') {
      setFilters((prev) => [...prev, { id: `f-${Date.now()}`, type: 'dateRange', label: 'Rentang Tanggal', value: '30 hari terakhir' }])
      setShowAddRow(false)
      setNewFilterType('programs')
      setNewFilterValue('')
      return
    }

    if (!newFilterValue) return
    setFilters((prev) => [...prev, { id: `f-${Date.now()}`, type: newFilterType as FilterRow['type'], label: FILTER_TYPE_OPTIONS.find((t) => t.value === newFilterType)?.label ?? newFilterType, value: newFilterValue }])
    setNewFilterValue('')
    setShowAddRow(false)
    setNewFilterType('programs')
  }

  function handleRemoveFilter(id: string) {
    setFilters((prev) => prev.filter((f) => f.id !== id))
  }

  function handleClearAll() {
    setFilters([])
  }

  return (
    <div className="bg-canvas rounded-xl border border-hairline p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-ink">Segmen Penerima</h4>
        <span className="text-[11px] text-steel">{filters.length} filter aktif</span>
      </div>

      {filters.length > 0 && (
        <div className="mb-4">
          <SegmentFilterChips
            filters={filters.map((f) => ({ id: f.id, label: f.label, value: f.value }))}
            onRemove={handleRemoveFilter}
            onClearAll={handleClearAll}
          />
        </div>
      )}

      {showAddRow ? (
        <div className="bg-surface/60 rounded-xl p-4 border border-hairline-soft mb-4">
          <div className="flex items-center gap-3">
            <select
              value={newFilterType}
              onChange={(e) => { setNewFilterType(e.target.value); setNewFilterValue('') }}
              className="h-9 px-3 rounded-xl border border-hairline bg-canvas text-xs text-ink focus:outline-none focus:border-brand-blue-deep min-w-[140px]"
            >
              {FILTER_TYPE_OPTIONS.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>

            {isDateOrBool ? (
              <div className="flex-1">
                {newFilterType === 'dateRange' ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      className="h-9 px-2 rounded-xl border border-hairline bg-canvas text-xs text-ink focus:outline-none focus:border-brand-blue-deep flex-1"
                    />
                    <span className="text-[11px] text-steel">s/d</span>
                    <input
                      type="date"
                      className="h-9 px-2 rounded-xl border border-hairline bg-canvas text-xs text-ink focus:outline-none focus:border-brand-blue-deep flex-1"
                    />
                  </div>
                ) : (
                  <span className="text-xs text-steel">Semua kontak yang belum membalas pesan</span>
                )}
              </div>
            ) : (
              <select
                value={newFilterValue}
                onChange={(e) => setNewFilterValue(e.target.value)}
                className="h-9 px-3 rounded-xl border border-hairline bg-canvas text-xs text-ink focus:outline-none focus:border-brand-blue-deep flex-1"
              >
                <option value="">Pilih nilai...</option>
                {selectedTypeConfig.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            )}

            <button
              onClick={handleAddFilter}
              disabled={!isDateOrBool && !newFilterValue}
              className="h-9 px-4 rounded-full bg-ink text-white text-xs font-medium hover:bg-ink/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Tambah
            </button>
            <button
              onClick={() => { setShowAddRow(false); setNewFilterValue('') }}
              className="p-1.5 rounded-lg text-steel hover:text-ink hover:bg-surface transition-colors"
            >
              <XIcon size={14} />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddRow(true)}
          disabled={availableTypes.length === 0}
          className="w-full h-9 rounded-full border border-dashed border-hairline text-xs font-medium text-steel hover:text-ink hover:border-brand-blue-deep transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          + Tambah Filter
        </button>
      )}

      <div className="mt-4">
        <SegmentPreview />
      </div>
    </div>
  )
}
