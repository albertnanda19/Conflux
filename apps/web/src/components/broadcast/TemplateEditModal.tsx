import { useState, useEffect } from 'react'
import { useCampaignStore } from '@/stores/campaign'
import { XIcon } from '@/icons'
import { TemplatePreviewModal } from './TemplatePreviewModal'
import type { Template } from '@/mock/campaign'

interface TemplateEditModalProps {
  open: boolean
  template: Template
  onClose: () => void
}

const CATEGORIES = [
  { value: 'sapaan', label: 'Sapaan' },
  { value: 'promo', label: 'Promo' },
  { value: 'undangan', label: 'Undangan' },
  { value: 'follow_up', label: 'Follow Up' },
  { value: 'reminder', label: 'Reminder' },
  { value: 'closing', label: 'Closing' },
]

const TYPES = [
  { value: 'text', label: 'Teks' },
  { value: 'text_image', label: 'Teks + Gambar' },
  { value: 'text_document', label: 'Teks + Dokumen' },
  { value: 'interactive_button', label: 'Interaktif' },
]

const VARIABLE_HINTS = [
  { key: 'nama', label: 'Nama Kontak' },
  { key: 'program', label: 'Program' },
  { key: 'tanggal_batch', label: 'Tanggal Batch' },
  { key: 'harga', label: 'Harga' },
  { key: 'agent_nama', label: 'Nama Agent' },
]

function extractVariables(content: string): string[] {
  const matches = content.match(/\{(\w+)\}/g)
  if (!matches) return []
  return [...new Set(matches.map((m) => m.replace(/[{}]/g, '')))]
}

export function TemplateEditModal({ open, template, onClose }: TemplateEditModalProps) {
  const updateTemplate = useCampaignStore((s) => s.updateTemplate)
  const [name, setName] = useState(template.name)
  const [category, setCategory] = useState(template.category)
  const [type, setType] = useState(template.type)
  const [content, setContent] = useState(template.content)
  const [buttonText, setButtonText] = useState(template.buttonText ?? '')
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    setName(template.name)
    setCategory(template.category)
    setType(template.type)
    setContent(template.content)
    setButtonText(template.buttonText ?? '')
  }, [template.id])

  const variables = extractVariables(content)
  const isInteractive = type === 'interactive_button'

  function handleSave() {
    updateTemplate(template.id, {
      name,
      category: category as Template['category'],
      type: type as Template['type'],
      content,
      variables,
      buttonText: isInteractive ? buttonText : undefined,
    })
    onClose()
  }

  function insertVariable(key: string) {
    setContent((prev) => prev + `{${key}}`)
  }

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />
        <div className="relative bg-canvas rounded-2xl shadow-xl w-full max-w-2xl mx-4 border border-hairline overflow-hidden max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-hairline-soft shrink-0">
            <h3 className="text-base font-semibold text-ink">Edit Template</h3>
            <button onClick={onClose} className="p-1.5 rounded-lg text-steel hover:text-ink hover:bg-surface-soft transition-colors">
              <XIcon size={18} />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 px-6 py-5">
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-ink mb-1.5">Nama Template</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Promo Data Science"
                  className="w-full h-10 px-3 rounded-xl border border-hairline bg-canvas text-sm text-ink placeholder:text-stone focus:outline-none focus:border-brand-blue-deep"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-ink mb-1.5">Kategori</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Template['category'])}
                    className="w-full h-10 px-3 rounded-xl border border-hairline bg-canvas text-sm text-ink focus:outline-none focus:border-brand-blue-deep"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink mb-1.5">Tipe</label>
                  <div className="flex flex-wrap gap-2">
                    {TYPES.map((t) => (
                      <button
                        key={t.value}
                        onClick={() => setType(t.value as Template['type'])}
                        className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                          type === t.value
                            ? 'bg-brand-blue text-white border-brand-blue'
                            : 'bg-canvas text-steel border-hairline hover:text-ink'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-ink mb-1.5">Isi Pesan</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tulis isi pesan template di sini... Gunakan {nama}, {program} untuk variabel."
                  rows={6}
                  className="w-full px-3 py-2.5 rounded-xl border border-hairline bg-canvas text-sm text-ink placeholder:text-stone focus:outline-none focus:border-brand-blue-deep resize-none"
                />
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[11px] text-steel">Tambah variabel:</span>
                  <div className="flex flex-wrap gap-1">
                    {VARIABLE_HINTS.map((v) => (
                      <button
                        key={v.key}
                        onClick={() => insertVariable(v.key)}
                        className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-brand-blue-200/50 text-brand-blue-deep hover:bg-brand-blue-200 transition-colors"
                      >
                        {`{${v.key}}`}
                      </button>
                    ))}
                  </div>
                </div>
                {variables.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {variables.map((v) => (
                      <span
                        key={v}
                        className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-medium"
                      >
                        {`{${v}}`}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {isInteractive && (
                <div>
                  <label className="block text-xs font-medium text-ink mb-1.5">Tombol CTA</label>
                  <input
                    type="text"
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    placeholder="Contoh: Daftar Sekarang"
                    className="w-full h-10 px-3 rounded-xl border border-hairline bg-canvas text-sm text-ink placeholder:text-stone focus:outline-none focus:border-brand-blue-deep"
                  />
                </div>
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-hairline-soft">
              <button
                onClick={() => setShowPreview(true)}
                className="text-xs font-medium text-brand-blue-deep hover:underline"
              >
                👁 Lihat Preview
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-hairline-soft bg-surface-soft/50 shrink-0">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-steel rounded-full border border-hairline hover:text-ink hover:bg-surface transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={!name.trim() || !content.trim()}
              className="px-4 py-2 text-xs font-medium text-white rounded-full bg-brand-blue-deep hover:bg-brand-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Simpan Perubahan
            </button>
          </div>
        </div>
      </div>

      {showPreview && (
        <TemplatePreviewModal
          open={showPreview}
          template={{
            name: name || 'Template Tanpa Nama',
            category,
            type,
            content: content || 'Belum ada isi pesan',
            buttonText: isInteractive ? buttonText : undefined,
          }}
          onClose={() => setShowPreview(false)}
        />
      )}
    </>
  )
}
