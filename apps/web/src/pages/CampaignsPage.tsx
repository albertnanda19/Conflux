import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCampaignStore } from '@/stores/campaign'
import { CampaignStatsBar } from '@/components/broadcast/CampaignStatsBar'
import { CampaignStatusFilter } from '@/components/broadcast/CampaignStatusFilter'
import { CampaignCard } from '@/components/broadcast/CampaignCard'
import { Button } from '@/components/ui/button'
import { MagnifierIcon } from '@/icons'

type SortOption = 'newest' | 'oldest' | 'most_recipients'

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Terbaru' },
  { value: 'oldest', label: 'Terlama' },
  { value: 'most_recipients', label: 'Terbanyak Penerima' },
]

export function CampaignsPage() {
  const navigate = useNavigate()
  const campaigns = useCampaignStore((s) => s.campaigns)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOption>('newest')
  const [showSortDropdown, setShowSortDropdown] = useState(false)

  const campaignStats = useMemo(() => [
    { key: 'total', label: 'Total Campaign', icon: '📢', value: campaigns.length, color: 'text-ink' },
    { key: 'running', label: 'Berjalan', icon: '🟢', value: campaigns.filter((c) => c.status === 'running').length, color: 'text-emerald-600' },
    { key: 'scheduled', label: 'Terjadwal', icon: '⏰', value: campaigns.filter((c) => c.status === 'scheduled').length, color: 'text-amber-600' },
    { key: 'completed', label: 'Selesai', icon: '✅', value: campaigns.filter((c) => c.status === 'completed').length, color: 'text-brand-blue' },
  ], [campaigns])

  const filtered = useMemo(() => {
    let result = campaigns

    if (statusFilter !== 'all') {
      result = result.filter((c) => c.status === statusFilter)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          (c.templateName ?? '').toLowerCase().includes(q),
      )
    }

    const sorted = [...result]
    if (sort === 'newest') {
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else if (sort === 'oldest') {
      sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    } else {
      sorted.sort((a, b) => b.totalRecipients - a.totalRecipients)
    }

    return sorted
  }, [campaigns, statusFilter, search, sort])

  return (
    <div className="p-8 h-full">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-ink mb-2">Campaign</h1>
          <p className="text-steel text-sm">Kelola dan pantau campaign broadcast.</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => navigate('/campaigns/new')}>
          + Buat Campaign
        </Button>
      </div>

      <CampaignStatsBar stats={campaignStats} />

      <div className="mt-6 mb-4 flex items-center justify-between gap-4">
        <CampaignStatusFilter selected={statusFilter as 'all' | 'draft' | 'scheduled' | 'running' | 'completed' | 'cancelled'} onSelect={(v) => setStatusFilter(v)} />

        <div className="flex items-center gap-2">
          <div className="relative">
            <MagnifierIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone pointer-events-none" />
            <input
              type="text"
              placeholder="Cari campaign..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-52 rounded-full border border-hairline bg-surface pl-9 pr-3 text-sm text-ink placeholder:text-stone focus:outline-none focus:border-brand-blue-deep"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="h-9 px-3 rounded-full border border-hairline bg-surface text-xs font-medium text-steel hover:text-ink transition-colors flex items-center gap-1.5"
            >
              {SORT_OPTIONS.find((o) => o.value === sort)?.label}
              <span className="text-[10px]">▾</span>
            </button>
            {showSortDropdown && (
              <div className="absolute top-full right-0 mt-1 w-44 bg-canvas border border-hairline rounded-xl shadow-lg z-50 py-1">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setSort(opt.value); setShowSortDropdown(false) }}
                    className="w-full px-3 py-2 text-xs text-left text-ink hover:bg-surface-soft"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="card-base text-center py-12 border border-hairline rounded-xl">
            <p className="text-sm text-steel">Belum ada campaign. Klik &ldquo;+ Buat Campaign&rdquo; untuk memulai.</p>
          </div>
        ) : (
          filtered.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onClick={() => navigate(`/campaigns/${campaign.id}`)}
            />
          ))
        )}
      </div>
    </div>
  )
}
