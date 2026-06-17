import { useState, useMemo } from 'react'
import { TemplateCategoryFilter } from '@/components/broadcast/TemplateCategoryFilter'
import { TemplateCard } from '@/components/broadcast/TemplateCard'
import { TemplateCreateModal } from '@/components/broadcast/TemplateCreateModal'
import { TemplatePreviewModal } from '@/components/broadcast/TemplatePreviewModal'
import { Button } from '@/components/ui/button'
import { MagnifierIcon } from '@/icons'

interface TemplateData {
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

const MOCK_TEMPLATES: TemplateData[] = [
  {
    id: 't1',
    name: 'Sapaan Program',
    category: 'sapaan',
    type: 'text',
    content: 'Halo {nama}! 👋\n\nTerima kasih sudah menghubungi Acme Learning. Ada yang bisa kami bantu mengenai program {program}?',
    variables: ['nama', 'program'],
    isActive: true,
    createdBy: 'Admin User',
    createdAt: '2026-05-20T00:00:00.000Z',
    updatedAt: '2026-06-01T00:00:00.000Z',
  },
  {
    id: 't2',
    name: 'Promo Harga',
    category: 'promo',
    type: 'text_image',
    content: 'Halo {nama}! 🎉\n\nSpesial untuk kamu, program {program} lagi ada diskon spesial!\n\n💰 Harga normal: Rp 6.000.000\n🏷 Harga promo: {harga}\n\nBerlaku sampai akhir bulan. Jangan sampai kehabisan!',
    variables: ['nama', 'program', 'harga'],
    isActive: true,
    createdBy: 'Admin User',
    createdAt: '2026-05-22T00:00:00.000Z',
    updatedAt: '2026-06-05T00:00:00.000Z',
  },
  {
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
  },
  {
    id: 't4',
    name: 'Follow Up H+3',
    category: 'follow_up',
    type: 'text',
    content: 'Halo {nama}! 👋\n\nBeberapa hari lalu kamu sudah bicara dengan {agent_nama} tentang program {program}. Apakah ada pertanyaan lagi yang bisa kami bantu?',
    variables: ['nama', 'agent_nama', 'program'],
    isActive: true,
    createdBy: 'Admin User',
    createdAt: '2026-05-25T00:00:00.000Z',
    updatedAt: '2026-06-10T00:00:00.000Z',
  },
  {
    id: 't5',
    name: 'Reminder Jadwal',
    category: 'reminder',
    type: 'text_image',
    content: 'Halo {nama}! ⏰\n\nIni pengingat untuk kamu:\n\n📅 {tanggal_batch}\n⏰ 19:00 WIB\n💻 Via Zoom\n\nJangan sampai terlewat ya!',
    variables: ['nama', 'tanggal_batch'],
    isActive: false,
    createdBy: 'Admin User',
    createdAt: '2026-05-30T00:00:00.000Z',
    updatedAt: '2026-06-08T00:00:00.000Z',
  },
  {
    id: 't6',
    name: 'Closing Daftar',
    category: 'closing',
    type: 'interactive_button',
    content: 'Halo {nama}! 🎯\n\nSetelah ngobrol sama {agent_nama}, apakah kamu sudah yakin untuk daftar {program}?\n\nJangan lewatkan kesempatan ini!',
    variables: ['nama', 'agent_nama', 'program'],
    buttonText: 'Ya, Daftar Sekarang!',
    isActive: true,
    createdBy: 'Admin User',
    createdAt: '2026-06-01T00:00:00.000Z',
    updatedAt: '2026-06-12T00:00:00.000Z',
  },
]

type CategoryFilterValue = 'all' | 'sapaan' | 'promo' | 'undangan' | 'follow_up' | 'reminder' | 'closing'

export function TemplatesPage() {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilterValue>('all')
  const [search, setSearch] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [previewTemplate, setPreviewTemplate] = useState<TemplateData | null>(null)

  const filtered = useMemo(() => {
    let result = MOCK_TEMPLATES

    if (categoryFilter !== 'all') {
      result = result.filter((t) => t.category === categoryFilter)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.content.toLowerCase().includes(q),
      )
    }

    return result
  }, [categoryFilter, search])

  return (
    <div className="p-8 h-full">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-ink mb-2">Template Pesan</h1>
          <p className="text-steel text-sm">Kelola template untuk broadcast dan quick reply.</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setShowCreateModal(true)}>
          + Buat Template
        </Button>
      </div>

      <div className="mb-4">
        <TemplateCategoryFilter selected={categoryFilter} onSelect={(v) => setCategoryFilter(v)} />
      </div>

      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="text-sm text-steel">
          {filtered.length} template{filtered.length !== 1 ? 's' : ''}
        </div>
        <div className="relative">
          <MagnifierIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone pointer-events-none" />
          <input
            type="text"
            placeholder="Cari template..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-52 rounded-full border border-hairline bg-surface pl-9 pr-3 text-sm text-ink placeholder:text-stone focus:outline-none focus:border-brand-blue-deep"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-2 card-base text-center py-12 border border-hairline rounded-xl">
            <p className="text-sm text-steel">Belum ada template. Klik &ldquo;+ Buat Template&rdquo; untuk memulai.</p>
          </div>
        ) : (
          filtered.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onPreview={(t) => setPreviewTemplate(t)}
            />
          ))
        )}
      </div>

      <TemplateCreateModal open={showCreateModal} onClose={() => setShowCreateModal(false)} />

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
