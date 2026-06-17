import { useState } from 'react'
import { EyeIcon } from '@/icons'
import { TemplatePreviewModal } from './TemplatePreviewModal'
import { TemplateCreateModal } from './TemplateCreateModal'

interface MockTemplate {
  id: string
  name: string
  category: string
  type: string
  content: string
  variables: string[]
  buttonText?: string
  isActive: boolean
}

const MOCK_TEMPLATES: MockTemplate[] = [
  {
    id: 't1', name: 'Sapaan Program', category: 'sapaan', type: 'text',
    content: 'Halo {nama}! 👋\n\nTerima kasih sudah menghubungi Acme Learning.',
    variables: ['nama', 'program'], isActive: true,
  },
  {
    id: 't2', name: 'Promo Harga', category: 'promo', type: 'text_image',
    content: 'Halo {nama}! 🎉\n\nSpesial untuk kamu, berikut harga program {program}:',
    variables: ['nama', 'program', 'tanggal_batch'], isActive: true,
  },
  {
    id: 't3', name: 'Undangan Webinar', category: 'undangan', type: 'interactive_button',
    content: 'Halo {nama}! 📣\n\nAcme Learning mengundang kamu ke webinar gratis:\n\n📌 "Kenalan sama Dunia {program}"',
    variables: ['nama', 'program', 'tanggal_batch'], buttonText: 'Daftar Sekarang', isActive: true,
  },
  {
    id: 't4', name: 'Follow Up H+3', category: 'follow_up', type: 'text',
    content: 'Halo {nama}! 😊\n\nKami dari Acme Learning mau follow up percakapan kita kemarin.',
    variables: ['nama', 'program'], isActive: true,
  },
  {
    id: 't5', name: 'Reminder Jadwal', category: 'reminder', type: 'text_image',
    content: 'Halo {nama}! ⏰\n\nIni pengingat untuk program {program} yang akan dimulai.',
    variables: ['nama', 'program', 'tanggal_batch'], isActive: true,
  },
  {
    id: 't6', name: 'Closing Daftar', category: 'closing', type: 'interactive_button',
    content: 'Halo {nama}! 🚀\n\nKami lihat kamu sudah sangat tertarik dengan program {program}.',
    variables: ['nama', 'program'], buttonText: 'Ya, Saya Daftar!', isActive: true,
  },
]

const CATEGORY_COLORS: Record<string, string> = {
  sapaan: 'bg-brand-blue-200 text-brand-blue-deep',
  promo: 'bg-pink-50 text-pink-700',
  undangan: 'bg-emerald-50 text-emerald-700',
  follow_up: 'bg-amber-50 text-amber-700',
  reminder: 'bg-purple-50 text-purple-700',
  closing: 'bg-coral text-white',
}

const CATEGORY_LABELS: Record<string, string> = {
  sapaan: 'Sapaan', promo: 'Promo', undangan: 'Undangan',
  follow_up: 'Follow Up', reminder: 'Reminder', closing: 'Closing',
}

interface WizardStepTemplateProps {
  selectedTemplateId: string | null
  onSelect: (id: string | null) => void
}

export function WizardStepTemplate({ selectedTemplateId, onSelect }: WizardStepTemplateProps) {
  const [showCreate, setShowCreate] = useState(false)
  const [previewTemplate, setPreviewTemplate] = useState<MockTemplate | null>(null)
  const selected = MOCK_TEMPLATES.find((t) => t.id === selectedTemplateId)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-xs text-steel">Pilih template yang sudah ada, atau buat template baru.</p>
        <button
          onClick={() => setShowCreate(true)}
          className="h-8 px-3 rounded-full border border-brand-blue-deep text-xs font-medium text-brand-blue-deep hover:bg-brand-blue-200/20 transition-colors"
        >
          + Buat Template Baru
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {MOCK_TEMPLATES.filter((t) => t.isActive).map((template) => {
          const isSelected = template.id === selectedTemplateId
          return (
            <button
              key={template.id}
              onClick={() => onSelect(template.id)}
              className={`text-left p-3 rounded-xl border transition-colors ${
                isSelected
                  ? 'border-brand-blue bg-brand-blue-200/10 ring-1 ring-brand-blue'
                  : 'border-hairline hover:bg-surface-soft/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-semibold ${CATEGORY_COLORS[template.category] ?? 'bg-surface text-steel'}`}>
                  {CATEGORY_LABELS[template.category] ?? template.category}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); setPreviewTemplate(template) }}
                  className="p-1 rounded text-steel hover:text-brand-blue-deep transition-colors"
                >
                  <EyeIcon size={12} />
                </button>
              </div>
              <p className="text-xs font-semibold text-ink mb-1">{template.name}</p>
              <p className="text-[11px] text-steel line-clamp-2 leading-relaxed">
                {template.content.split('\n').slice(0, 2).join(' ')}
              </p>
              {template.variables.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {template.variables.map((v) => (
                    <span key={v} className="px-1.5 py-0.5 rounded bg-brand-blue-200/30 text-brand-blue-deep text-[9px] font-medium">
                      {`{${v}}`}
                    </span>
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {selected && (
        <div className="bg-surface/50 rounded-xl border border-hairline-soft p-4 flex items-center gap-3">
          <span className="text-lg">✅</span>
          <div>
            <p className="text-xs font-medium text-ink">Terpilih: {selected.name}</p>
            <p className="text-[11px] text-steel">
              {selected.variables.length} variabel · {selected.type === 'interactive_button' ? 'Interaktif' : selected.type === 'text_image' ? 'Teks + Gambar' : 'Teks'}
            </p>
          </div>
          <button
            onClick={() => onSelect(null)}
            className="ml-auto text-[11px] text-steel hover:text-red-500 transition-colors"
          >
            Batal pilih
          </button>
        </div>
      )}

      <TemplateCreateModal open={showCreate} onClose={() => setShowCreate(false)} />

      {previewTemplate && (
        <TemplatePreviewModal
          open={!!previewTemplate}
          template={{
            name: previewTemplate.name,
            category: previewTemplate.category,
            type: previewTemplate.type,
            content: previewTemplate.content,
            buttonText: previewTemplate.buttonText,
          }}
          onClose={() => setPreviewTemplate(null)}
        />
      )}
    </div>
  )
}
