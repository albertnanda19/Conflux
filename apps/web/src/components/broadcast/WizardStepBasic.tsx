export interface WizardBasicData {
  name: string
  description: string
  goal: string
}

const GOAL_OPTIONS = [
  { value: 'promotion', label: 'Promosi Program' },
  { value: 'follow_up', label: 'Follow Up' },
  { value: 'event_invitation', label: 'Undangan Event' },
  { value: 're_engagement', label: 'Re-engagement' },
]

const CHANNEL_OPTIONS = [
  { value: 'whatsapp', label: 'WhatsApp', icon: '💬' },
]

interface WizardStepBasicProps {
  data: WizardBasicData
  onChange: (data: WizardBasicData) => void
}

export function WizardStepBasic({ data, onChange }: WizardStepBasicProps) {
  function update(field: keyof WizardBasicData, value: string) {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-medium text-ink mb-1.5">Nama Campaign</label>
        <input
          type="text"
          value={data.name}
          onChange={(e) => update('name', e.target.value)}
          placeholder="Contoh: Promo Data Science Batch 12"
          className="w-full h-10 px-3 rounded-xl border border-hairline bg-canvas text-sm text-ink placeholder:text-stone focus:outline-none focus:border-brand-blue-deep"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-ink mb-1.5">Deskripsi</label>
        <textarea
          value={data.description}
          onChange={(e) => update('description', e.target.value)}
          placeholder="Jelaskan tujuan campaign ini..."
          rows={3}
          className="w-full px-3 py-2.5 rounded-xl border border-hairline bg-canvas text-sm text-ink placeholder:text-stone focus:outline-none focus:border-brand-blue-deep resize-none"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-ink mb-1.5">Tujuan Campaign</label>
        <select
          value={data.goal}
          onChange={(e) => update('goal', e.target.value)}
          className="w-full h-10 px-3 rounded-xl border border-hairline bg-canvas text-sm text-ink focus:outline-none focus:border-brand-blue-deep"
        >
          {GOAL_OPTIONS.map((g) => (
            <option key={g.value} value={g.value}>{g.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-ink mb-1.5">Channel</label>
        <div className="flex items-center gap-2 h-10 px-3 rounded-xl border border-hairline bg-surface-soft text-sm text-ink">
          <span>{CHANNEL_OPTIONS[0].icon}</span>
          <span className="font-medium">{CHANNEL_OPTIONS[0].label}</span>
          <span className="ml-auto text-[10px] text-steel bg-surface rounded-full px-2 py-0.5">Satu-satunya channel yang tersedia</span>
        </div>
      </div>
    </div>
  )
}
