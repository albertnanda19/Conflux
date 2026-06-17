import { useState, useMemo } from 'react'
import { useCampaignStore } from '@/stores/campaign'
import { TemplateCategoryFilter } from '@/components/broadcast/TemplateCategoryFilter'
import { TemplateCard } from '@/components/broadcast/TemplateCard'
import { TemplateCreateModal } from '@/components/broadcast/TemplateCreateModal'
import { TemplateEditModal } from '@/components/broadcast/TemplateEditModal'
import { TemplatePreviewModal } from '@/components/broadcast/TemplatePreviewModal'
import { Button } from '@/components/ui/button'
import { MagnifierIcon } from '@/icons'
import type { Template } from '@/mock/campaign'

type CategoryFilterValue = 'all' | 'sapaan' | 'promo' | 'undangan' | 'follow_up' | 'reminder' | 'closing'

interface PreviewTemplate {
  name: string
  category: string
  type: string
  content: string
  buttonText?: string
}

export function TemplatesPage() {
  const templates = useCampaignStore((s) => s.templates)
  const toggleTemplateActive = useCampaignStore((s) => s.toggleTemplateActive)
  const deleteTemplate = useCampaignStore((s) => s.deleteTemplate)
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilterValue>('all')
  const [search, setSearch] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [previewTemplate, setPreviewTemplate] = useState<PreviewTemplate | null>(null)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)

  const filtered = useMemo(() => {
    let result = templates

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
  }, [templates, categoryFilter, search])

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
              onToggleActive={(id) => toggleTemplateActive(id)}
              onPreview={(t) => setPreviewTemplate(t)}
              onEdit={(t) => setEditingTemplate(t as unknown as Template)}
              onDelete={(id) => deleteTemplate(id)}
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

      {editingTemplate && (
        <TemplateEditModal
          open={!!editingTemplate}
          template={editingTemplate}
          onClose={() => setEditingTemplate(null)}
        />
      )}
    </div>
  )
}
