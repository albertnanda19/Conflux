interface MockContact {
  id: string
  name: string
  phone: string
  channel: string
  pipelineStatus: string
}

const MOCK_MATCHED_CONTACTS: MockContact[] = [
  { id: '1', name: 'Budi Santoso', phone: '0812-3456-7890', channel: 'WhatsApp', pipelineStatus: 'New Lead' },
  { id: '2', name: 'Rina Wati', phone: '0856-7890-1234', channel: 'Instagram', pipelineStatus: 'Contacted' },
  { id: '3', name: 'Dedi Kurniawan', phone: '0878-9012-3456', channel: 'WhatsApp', pipelineStatus: 'Qualified' },
  { id: '4', name: 'Sari Dewi', phone: '0823-4567-8901', channel: 'Facebook', pipelineStatus: 'New Lead' },
  { id: '5', name: 'Andi Saputra', phone: '0834-5678-9012', channel: 'Website', pipelineStatus: 'Contacted' },
]

const MOCK_BREAKDOWN = {
  byChannel: [
    { label: 'WhatsApp', count: 1820, color: 'bg-emerald-500' },
    { label: 'Instagram', count: 650, color: 'bg-pink-500' },
    { label: 'Facebook', count: 430, color: 'bg-brand-blue' },
  ],
  byPipeline: [
    { label: 'New Lead', count: 1450 },
    { label: 'Contacted', count: 890 },
    { label: 'Qualified', count: 560 },
  ],
}

interface SegmentPreviewProps {
  totalCount?: number
  contacts?: MockContact[]
  breakdown?: typeof MOCK_BREAKDOWN
}

const PIPELINE_COLORS: Record<string, string> = {
  'New Lead': 'bg-brand-blue-200 text-brand-blue-deep',
  'Contacted': 'bg-amber-50 text-amber-700',
  'Qualified': 'bg-emerald-50 text-emerald-700',
  'Proposal Sent': 'bg-purple-50 text-purple-700',
}

export function SegmentPreview({
  totalCount = 2900,
  contacts = MOCK_MATCHED_CONTACTS,
  breakdown = MOCK_BREAKDOWN,
}: SegmentPreviewProps) {
  const maxChannelCount = Math.max(...breakdown.byChannel.map((c) => c.count))

  return (
    <div className="bg-surface/60 rounded-xl border border-hairline p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-ink">Preview Segmen</h4>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-brand-blue">{totalCount.toLocaleString('id-ID')}</span>
          <span className="text-xs text-steel">kontak cocok</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-[11px] font-medium text-steel mb-2 uppercase tracking-wide">Per Channel</p>
          <div className="space-y-2">
            {breakdown.byChannel.map((ch) => (
              <div key={ch.label}>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[11px] text-ink">{ch.label}</span>
                  <span className="text-[11px] font-medium text-ink">{ch.count.toLocaleString('id-ID')}</span>
                </div>
                <div className="h-1.5 bg-hairline rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${ch.color}`}
                    style={{ width: `${(ch.count / maxChannelCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[11px] font-medium text-steel mb-2 uppercase tracking-wide">Per Pipeline</p>
          <div className="space-y-1.5">
            {breakdown.byPipeline.map((p) => (
              <div key={p.label} className="flex items-center justify-between">
                <span className="text-[11px] text-ink">{p.label}</span>
                <span className="text-[11px] font-semibold text-ink">{p.count.toLocaleString('id-ID')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-hairline-soft pt-3">
        <p className="text-[11px] font-medium text-steel mb-2 uppercase tracking-wide">Sample Kontak</p>
        <div className="space-y-1.5">
          {contacts.slice(0, 5).map((c) => (
            <div key={c.id} className="flex items-center justify-between py-1.5 px-3 bg-canvas rounded-lg border border-hairline-soft">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-surface flex items-center justify-center text-[10px] font-semibold text-steel">
                  {c.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <p className="text-[11px] font-medium text-ink leading-tight">{c.name}</p>
                  <p className="text-[10px] text-steel">{c.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-steel">{c.channel}</span>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${PIPELINE_COLORS[c.pipelineStatus] ?? 'bg-surface text-steel'}`}>
                  {c.pipelineStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
