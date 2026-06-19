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
    content: content || '<p>Mulai menulis konten dokumen...</p>',
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
