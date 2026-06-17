import { XIcon } from '@/icons'

interface TemplatePreviewData {
  name: string
  category: string
  type: string
  content: string
  buttonText?: string
}

const MOCK_TEMPLATE: TemplatePreviewData = {
  name: 'Undangan Webinar',
  category: 'undangan',
  type: 'interactive_button',
  content: 'Halo {nama}! 📣\n\nAcme Learning mengundang kamu ke webinar gratis:\n\n📌 "Kenalan sama Dunia {program}"\n📅 {tanggal_batch}\n⏰ 19:00 - 21:00 WIB\n\nDaftar sekarang dan dapatkan bonus materi eksklusif!',
  buttonText: 'Daftar Sekarang',
}

const VARIABLE_PLACEHOLDERS: Record<string, string> = {
  nama: 'Budi Santoso',
  program: 'Data Science',
  tanggal_batch: '20 Juli 2026',
  harga: 'Rp 4.500.000',
  agent_nama: 'Sari Dewi',
}

function replaceVariables(content: string): string {
  let result = content
  for (const [key, value] of Object.entries(VARIABLE_PLACEHOLDERS)) {
    result = result.replaceAll(`{${key}}`, value)
  }
  return result
}

interface TemplatePreviewModalProps {
  open: boolean
  template?: TemplatePreviewData
  onClose: () => void
}

export function TemplatePreviewModal({ open, template = MOCK_TEMPLATE, onClose }: TemplatePreviewModalProps) {
  if (!open) return null

  const rendered = replaceVariables(template.content)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-canvas rounded-2xl shadow-xl w-full max-w-sm mx-4 border border-hairline overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-hairline-soft">
          <h3 className="text-sm font-semibold text-ink">Preview: {template.name}</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-steel hover:text-ink hover:bg-surface-soft transition-colors">
            <XIcon size={16} />
          </button>
        </div>

        <div className="flex justify-center py-6 px-4 bg-surface/50">
          <div className="w-[280px]">
            <div className="rounded-2xl overflow-hidden shadow-lg border border-hairline">
              <div className="bg-emerald-600 px-3 py-2 flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-[10px] font-bold">
                  AL
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-white leading-tight">Acme Learning</p>
                  <p className="text-[9px] text-white/70">online</p>
                </div>
              </div>

              <div className="bg-[#ECE5DD] px-3 py-3">
                <div className="relative bg-white rounded-lg px-3 py-2.5 shadow-sm max-w-[240px]">
                  <div className="absolute -top-1 left-3 w-2 h-2 bg-white rotate-45 border-l border-t border-hairline" />

                  {template.type === 'text_image' && (
                    <div className="mb-2 -mx-1 -mt-0.5 rounded overflow-hidden bg-surface">
                      <div className="h-24 bg-gradient-to-br from-brand-blue-200 to-brand-cyan/20 flex items-center justify-center">
                        <span className="text-xs text-brand-blue-deep font-medium">📷 Gambar</span>
                      </div>
                    </div>
                  )}

                  <p className="text-[12px] text-ink leading-relaxed whitespace-pre-wrap">
                    {rendered}
                  </p>

                  <div className="absolute -bottom-1 right-3 w-2 h-2 bg-white rotate-45 border-r border-b border-hairline" />
                </div>

                {template.type === 'interactive_button' && template.buttonText && (
                  <div className="mt-1.5 bg-white rounded-lg px-3 py-2 text-center shadow-sm border border-hairline cursor-pointer hover:bg-surface-soft transition-colors">
                    <span className="text-[11px] font-medium text-brand-blue-deep">
                      {template.buttonText}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-hairline-soft bg-surface-soft/50">
          <p className="text-[11px] text-steel text-center">
            Preview menggunakan data contoh. Variabel akan diganti dengan data kontak asli.
          </p>
        </div>
      </div>
    </div>
  )
}
