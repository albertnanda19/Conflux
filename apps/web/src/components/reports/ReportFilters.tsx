import { DateRangePicker } from './DateRangePicker'
import { useReportsStore } from '@/stores/reports'
import { MOCK_AGENT_PERFORMANCE } from '@/mock/analytics'

const CHANNELS = ['WhatsApp', 'Instagram', 'Facebook']

export function ReportFilters() {
  const { selectedAgent, setSelectedAgent, selectedChannel, setSelectedChannel } = useReportsStore()

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <DateRangePicker />

      <select
        value={selectedAgent ?? ''}
        onChange={(e) => setSelectedAgent(e.target.value || null)}
        className="h-8 px-3 rounded-full border border-hairline bg-canvas text-xs text-ink focus:outline-none focus:border-brand-blue-deep appearance-none cursor-pointer"
      >
        <option value="">Semua Agent</option>
        {MOCK_AGENT_PERFORMANCE.map((a) => (
          <option key={a.id} value={a.id}>{a.name}</option>
        ))}
      </select>

      <select
        value={selectedChannel ?? ''}
        onChange={(e) => setSelectedChannel(e.target.value || null)}
        className="h-8 px-3 rounded-full border border-hairline bg-canvas text-xs text-ink focus:outline-none focus:border-brand-blue-deep appearance-none cursor-pointer"
      >
        <option value="">Semua Channel</option>
        {CHANNELS.map((ch) => (
          <option key={ch} value={ch}>{ch}</option>
        ))}
      </select>
    </div>
  )
}
