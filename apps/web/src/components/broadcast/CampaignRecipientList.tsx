import { useState } from 'react'
import { MagnifierIcon } from '@/icons'

interface Recipient {
  id: string
  name: string
  phone: string
  status: 'sent' | 'delivered' | 'read' | 'replied' | 'failed'
  reason?: string
}

const MOCK_RECIPIENTS: Recipient[] = [
  { id: 'r1', name: 'Budi Santoso', phone: '0812-3456-7890', status: 'replied' },
  { id: 'r2', name: 'Rina Wati', phone: '0856-7890-1234', status: 'read' },
  { id: 'r3', name: 'Dedi Kurniawan', phone: '0878-9012-3456', status: 'delivered' },
  { id: 'r4', name: 'Sari Dewi', phone: '0823-4567-8901', status: 'replied' },
  { id: 'r5', name: 'Andi Saputra', phone: '0834-5678-9012', status: 'sent' },
  { id: 'r6', name: 'Maya Putri', phone: '0811-2345-6789', status: 'failed', reason: 'Nomor tidak aktif' },
  { id: 'r7', name: 'Rudi Hartono', phone: '0845-6789-0123', status: 'failed', reason: 'Bukan nomor WhatsApp' },
  { id: 'r8', name: 'Lina Marlina', phone: '0856-7890-1235', status: 'read' },
  { id: 'r9', name: 'Tono Sugiarto', phone: '0878-9012-3457', status: 'delivered' },
  { id: 'r10', name: 'Dewi Lestari', phone: '0823-4567-8902', status: 'sent' },
  { id: 'r11', name: 'Hendra Wijaya', phone: '0834-5678-9013', status: 'replied' },
  { id: 'r12', name: 'Ratna Sari', phone: '0811-2345-6790', status: 'read' },
]

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  sent: { label: 'Terkirim', color: 'bg-brand-blue-200 text-brand-blue-deep' },
  delivered: { label: 'Terkirim', color: 'bg-emerald-50 text-emerald-700' },
  read: { label: 'Dibaca', color: 'bg-emerald-50 text-emerald-700' },
  replied: { label: 'Dibalas', color: 'bg-emerald-100 text-emerald-800' },
  failed: { label: 'Gagal', color: 'bg-red-50 text-red-600' },
}

const STATUS_FILTERS = ['all', 'sent', 'delivered', 'read', 'replied', 'failed'] as const

const ITEMS_PER_PAGE = 10

interface CampaignRecipientListProps {
  recipients?: Recipient[]
}

export function CampaignRecipientList({ recipients = MOCK_RECIPIENTS }: CampaignRecipientListProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [page, setPage] = useState(1)

  const filtered = recipients.filter((r) => {
    const matchSearch = !search.trim() || r.name.toLowerCase().includes(search.toLowerCase()) || r.phone.includes(search)
    const matchStatus = statusFilter === 'all' || r.status === statusFilter
    return matchSearch && matchStatus
  })

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  return (
    <div className="bg-canvas rounded-xl border border-hairline p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xs font-semibold text-ink">Daftar Penerima</h4>
        <span className="text-[11px] text-steel">{filtered.length} kontak</span>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <MagnifierIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone pointer-events-none" />
          <input
            type="text"
            placeholder="Cari nama atau nomor..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="h-8 w-full rounded-full border border-hairline bg-surface pl-8 pr-3 text-[11px] text-ink placeholder:text-stone focus:outline-none focus:border-brand-blue-deep"
          />
        </div>
        <div className="flex gap-1">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1) }}
              className={`px-2 py-1 text-[10px] font-medium rounded-full border transition-colors ${
                statusFilter === s
                  ? 'bg-ink text-white border-ink'
                  : 'bg-canvas text-steel border-hairline hover:text-ink'
              }`}
            >
              {s === 'all' ? 'Semua' : STATUS_CONFIG[s]?.label ?? s}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-hairline-soft">
              <th className="pb-2 text-[10px] font-semibold text-steel uppercase tracking-wide">Nama</th>
              <th className="pb-2 text-[10px] font-semibold text-steel uppercase tracking-wide">Telepon</th>
              <th className="pb-2 text-[10px] font-semibold text-steel uppercase tracking-wide">Status</th>
              <th className="pb-2 text-[10px] font-semibold text-steel uppercase tracking-wide">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((r) => {
              const st = STATUS_CONFIG[r.status]
              return (
                <tr key={r.id} className="border-b border-hairline-soft last:border-0">
                  <td className="py-2.5 text-[11px] font-medium text-ink">{r.name}</td>
                  <td className="py-2.5 text-[11px] text-steel">{r.phone}</td>
                  <td className="py-2.5">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${st.color}`}>
                      {st.label}
                    </span>
                  </td>
                  <td className="py-2.5 text-[11px] text-steel">{r.reason ?? '—'}</td>
                </tr>
              )
            })}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-[11px] text-steel">Tidak ada data ditemukan.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-hairline-soft">
          <span className="text-[11px] text-steel">
            Halaman {page} dari {totalPages}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="h-7 px-2.5 text-[11px] font-medium rounded-full border border-hairline text-steel hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="h-7 px-2.5 text-[11px] font-medium rounded-full border border-hairline text-steel hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
