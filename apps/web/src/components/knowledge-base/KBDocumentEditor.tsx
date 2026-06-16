import { useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { cn } from '@/lib/utils'

interface KBDocumentEditorProps {
  content: string
  onChange: (html: string) => void
  editable?: boolean
}

const MOCK_CONTENT: Record<string, string> = {
  'kb-1': '<h2>FAQ Program Data Science</h2><p>Berikut adalah pertanyaan yang sering ditanyakan seputar program Data Science kami:</p><h3>Apa saja topik yang dipelajari?</h3><p>Program ini mencakup statistik, machine learning, deep learning, dan data visualization menggunakan Python, R, dan tools modern lainnya.</p><h3>Berapa lama durasi program?</h3><p>Program berlangsung selama 16 minggu dengan 3 sesi per minggu.</p>',
  'kb-2': '<h2>Daftar Harga & Promo 2026</h2><p>Harga program per batch:</p><ul><li>Data Science Bootcamp: Rp 8.500.000</li><li>AI Engineering: Rp 9.200.000</li><li>Data Analytics: Rp 6.800.000</li></ul><p><strong>Promo early bird:</strong> Diskon 15% untuk pendaftaran 30 hari sebelum batch dimulai.</p>',
  'kb-3': '<h2>Jadwal Batch Juli–Desember 2026</h2><p>Batch yang tersedia:</p><ul><li>Batch 7: 7 Juli – 24 Oktober 2026</li><li>Batch 8: 4 Agustus – 21 November 2026</li><li>Batch 9: 1 September – 28 Desember 2026</li></ul><p>Kelas diadakan Senin–Rabu, pukul 19.00–21.30 WIB.</p>',
  'kb-4': '<h2>Syarat & Ketentuan Pendaftaran</h2><p>Persyaratan umum:</p><ol><li>Berusia minimal 18 tahun</li><li>Lulusan SMK/SMA atau sederajat</li><li>Mengisi formulir pendaftaran online</li><li>Melakukan pembayaran DP sebesar Rp 1.000.000</li></ol>',
  'kb-5': '<h2>Cara Pembayaran & Transfer</h2><p>Metode pembayaran yang diterima:</p><ul><li>Transfer Bank BCA: 1234567890 a.n. Acme Corp</li><li>Transfer Bank Mandiri: 0987654321 a.n. Acme Corp</li><li>Credit Card via Midtrans</li></ul><p>Pembayaran bisa dicicil 3x tanpa bunga.</p>',
  'kb-6': '<h2>Testimoni Alumni 2025</h2><p>Kumpulan testimoni dari alumni yang telah menyelesaikan program kami.</p><p><em>Dokumen ini sedang dalam proses pemrosesan.</em></p>',
  'kb-7': '<h2>Panduan Career Service</h2><p>Services yang tersedia untuk alumni:</p><ul><li>Resume review</li><li>Mock interview</li><li>Job matching dengan perusahaan partner</li></ul><p><em>Dokumen ini gagal diproses. Silakan upload ulang.</em></p>',
  'kb-8': '<h2>FAQ Teknis & Troubleshooting</h2><p>Pertanyaan teknis seputar penggunaan platform:</p><h3>Lupa password?</h3><p>Klik "Lupa Password" di halaman login, masukkan email terdaftar, dan ikuti link reset yang dikirim ke email Anda.</p><h3>Tidak bisa login?</h3><p>Pastikan email dan password benar. Jika masih gagal, hubungi admin di admin@test.com.</p>',
}

function ToolbarButton({
  onClick,
  active,
  disabled,
  children,
}: {
  onClick: () => void
  active?: boolean
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold transition-colors',
        active
          ? 'bg-brand-blue-deep text-white'
          : 'text-steel hover:bg-surface hover:text-ink',
        disabled && 'opacity-30 cursor-not-allowed',
      )}
    >
      {children}
    </button>
  )
}

export function KBDocumentEditor({ content, onChange, editable = true }: KBDocumentEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Mulai menulis konten dokumen...' }),
    ],
    content: MOCK_CONTENT[content] || content || '<p>Mulai menulis konten dokumen...</p>',
    editable,
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
  }, [content, editable])

  const handleBold = useCallback(() => editor?.chain().focus().toggleBold().run(), [editor])
  const handleItalic = useCallback(() => editor?.chain().focus().toggleItalic().run(), [editor])
  const handleStrike = useCallback(() => editor?.chain().focus().toggleStrike().run(), [editor])
  const handleH2 = useCallback(() => editor?.chain().focus().toggleHeading({ level: 2 }).run(), [editor])
  const handleH3 = useCallback(() => editor?.chain().focus().toggleHeading({ level: 3 }).run(), [editor])
  const handleBulletList = useCallback(() => editor?.chain().focus().toggleBulletList().run(), [editor])
  const handleOrderedList = useCallback(() => editor?.chain().focus().toggleOrderedList().run(), [editor])
  const handleBlockquote = useCallback(() => editor?.chain().focus().toggleBlockquote().run(), [editor])

  if (!editor) return null

  return (
    <div className="border border-hairline rounded-xl overflow-hidden bg-canvas">
      {editable && (
        <div className="flex items-center gap-0.5 px-3 py-2 border-b border-hairline-soft bg-surface-soft">
          <ToolbarButton onClick={handleBold} active={editor.isActive('bold')}>
            <span className="font-bold">B</span>
          </ToolbarButton>
          <ToolbarButton onClick={handleItalic} active={editor.isActive('italic')}>
            <span className="italic">I</span>
          </ToolbarButton>
          <ToolbarButton onClick={handleStrike} active={editor.isActive('strike')}>
            <span className="line-through">S</span>
          </ToolbarButton>
          <div className="w-px h-4 bg-hairline mx-1" />
          <ToolbarButton onClick={handleH2} active={editor.isActive('heading', { level: 2 })}>
            H2
          </ToolbarButton>
          <ToolbarButton onClick={handleH3} active={editor.isActive('heading', { level: 3 })}>
            H3
          </ToolbarButton>
          <div className="w-px h-4 bg-hairline mx-1" />
          <ToolbarButton onClick={handleBulletList} active={editor.isActive('bulletList')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none"/></svg>
          </ToolbarButton>
          <ToolbarButton onClick={handleOrderedList} active={editor.isActive('orderedList')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="10" y1="6" x2="20" y2="6"/><line x1="10" y1="12" x2="20" y2="12"/><line x1="10" y1="18" x2="20" y2="18"/><text x="2" y="8" fontSize="7" fill="currentColor" stroke="none" fontWeight="bold">1</text><text x="2" y="14" fontSize="7" fill="currentColor" stroke="none" fontWeight="bold">2</text><text x="2" y="20" fontSize="7" fill="currentColor" stroke="none" fontWeight="bold">3</text></svg>
          </ToolbarButton>
          <ToolbarButton onClick={handleBlockquote} active={editor.isActive('blockquote')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3z"/></svg>
          </ToolbarButton>
        </div>
      )}
      <EditorContent
        editor={editor}
        className="px-4 py-3 min-h-[200px] max-h-[400px] overflow-y-auto prose prose-sm prose-ink max-w-none
          [&_.tiptap]:outline-none
          [&_.tiptap_h2]:text-base [&_.tiptap_h2]:font-semibold [&_.tiptap_h2]:text-ink [&_.tiptap_h2]:mt-4 [&_.tiptap_h2]:mb-2
          [&_.tiptap_h3]:text-sm [&_.tiptap_h3]:font-semibold [&_.tiptap_h3]:text-ink [&_.tiptap_h3]:mt-3 [&_.tiptap_h3]:mb-1.5
          [&_.tiptap_p]:text-sm [&_.tiptap_p]:text-charcoal [&_.tiptap_p]:leading-relaxed [&_.tiptap_p]:mb-2
          [&_.tiptap_ul]:list-disc [&_.tiptap_ul]:pl-5 [&_.tiptap_ul]:mb-2
          [&_.tiptap_ol]:list-decimal [&_.tiptap_ol]:pl-5 [&_.tiptap_ol]:mb-2
          [&_.tiptap_li]:text-sm [&_.tiptap_li]:text-charcoal [&_.tiptap_li]:mb-0.5
          [&_.tiptap_blockquote]:border-l-3 [&_.tiptap_blockquote]:border-brand-blue-deep [&_.tiptap_blockquote]:pl-4 [&_.tiptap_blockquote]:italic [&_.tiptap_blockquote]:text-steel [&_.tiptap_blockquote]:my-3
          [&_.tiptap_strike]:line-through
          [&_.tiptap_p.is-editor-empty:first-child::before]:text-stone [&_.tiptap_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.tiptap_p.is-editor-empty:first-child::before]:float-left [&_.tiptap_p.is-editor-empty:first-child::before]:h-0 [&_.tiptap_p.is-editor-empty:first-child::before]:pointer-events-none"
      />
    </div>
  )
}
