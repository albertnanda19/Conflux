import { Toggle } from '@/components/ui/toggle'
import { PenIcon, EyeIcon, TrashIcon } from '@/icons'

interface TemplateCardData {
  id: string
  name: string
  category: string
  type: string
  content: string
  variables: string[]
  buttonText?: string
  isActive: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
}

const MOCK_TEMPLATE: TemplateCardData = {
  id: 't3',
  name: 'Undangan Webinar',
  category: 'undangan',
  type: 'interactive_button',
  content: 'Halo {nama}! 📣\n\nAcme Learning mengundang kamu ke webinar gratis:\n\n📌 "Kenalan sama Dunia {program}"\n📅 {tanggal_batch}\n⏰ 19:00 - 21:00 WIB\n\nDaftar sekarang dan dapatkan bonus materi eksklusif!',
  variables: ['nama', 'program', 'tanggal_batch'],
  buttonText: 'Daftar Sekarang',
  isActive: true,
  createdBy: 'Admin User',
  createdAt: '2026-05-27T00:00:00.000Z',
  updatedAt: '2026-06-13T00:00:00.000Z',
}

const TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  text: { label: 'Teks', color: 'bg-surface text-steel' },
  text_image: { label: 'Teks + Gambar', color: 'bg-brand-blue-200 text-brand-blue-deep' },
  text_document: { label: 'Teks + Dokumen', color: 'bg-amber-50 text-amber-700' },
  interactive_button: { label: 'Interaktif', color: 'bg-emerald-50 text-emerald-700' },
}

const CATEGORY_COLORS: Record<string, string> = {
  sapaan: 'bg-brand-blue-200 text-brand-blue-deep',
  promo: 'bg-pink-50 text-pink-700',
  undangan: 'bg-emerald-50 text-emerald-700',
  follow_up: 'bg-amber-50 text-amber-700',
  reminder: 'bg-purple-50 text-purple-700',
  closing: 'bg-coral text-white',
}

const CATEGORY_LABELS: Record<string, string> = {
  sapaan: 'Sapaan',
  promo: 'Promo',
  undangan: 'Undangan',
  follow_up: 'Follow Up',
  reminder: 'Reminder',
  closing: 'Closing',
}

function formatShortDate(date: string): string {
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(date))
}

interface TemplateCardProps {
  template?: TemplateCardData
  onToggleActive?: (id: string) => void
  onEdit?: (template: TemplateCardData) => void
  onPreview?: (template: TemplateCardData) => void
  onDelete?: (id: string) => void
}

export function TemplateCard({ template = MOCK_TEMPLATE, onToggleActive, onEdit, onPreview, onDelete }: TemplateCardProps) {
  const typeInfo = TYPE_CONFIG[template.type] ?? TYPE_CONFIG.text
  const categoryColor = CATEGORY_COLORS[template.category] ?? 'bg-surface text-steel'
  const contentPreview = template.content.split('\n').slice(0, 3).join('\n')

  return (
    <div className="card-base p-4 border border-hairline rounded-xl hover:bg-surface-soft/50 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${typeInfo.color}`}>
          {typeInfo.label}
        </span>
        <Toggle
          checked={template.isActive}
          onCheckedChange={() => onToggleActive?.(template.id)}
        />
      </div>

      <h3 className="text-sm font-semibold text-ink mb-1.5">{template.name}</h3>

      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${categoryColor}`}>
        {CATEGORY_LABELS[template.category] ?? template.category}
      </span>

      <pre className="mt-3 text-xs text-slate whitespace-pre-wrap line-clamp-3 font-sans leading-relaxed">
        {contentPreview}
      </pre>

      {template.variables.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {template.variables.map((v) => (
            <span
              key={v}
              className="inline-flex items-center px-1.5 py-0.5 rounded bg-brand-blue-200/50 text-brand-blue-deep text-[10px] font-medium"
            >
              {'{' + v + '}'}
            </span>
          ))}
        </div>
      )}

      {template.buttonText && (
        <div className="mt-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-emerald-300 bg-emerald-50 text-emerald-700 text-[10px] font-medium">
            Button: {template.buttonText}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-hairline-soft">
        <div className="text-[11px] text-steel">
          <span>Oleh {template.createdBy}</span>
          <span className="mx-1">•</span>
          <span>{formatShortDate(template.updatedAt)}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit?.(template)}
            className="p-1.5 rounded-lg text-steel hover:text-ink hover:bg-surface transition-colors"
            title="Edit"
          >
            <PenIcon size={13} />
          </button>
          <button
            onClick={() => onPreview?.(template)}
            className="p-1.5 rounded-lg text-steel hover:text-brand-blue-deep hover:bg-brand-blue-200/30 transition-colors"
            title="Preview"
          >
            <EyeIcon size={13} />
          </button>
          <button
            onClick={() => onDelete?.(template.id)}
            className="p-1.5 rounded-lg text-steel hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Hapus"
          >
            <TrashIcon size={12} />
          </button>
        </div>
      </div>
    </div>
  )
}
