import { useState, useCallback, useRef } from 'react'
import { useKbMutations } from '@/hooks/knowledge-base'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { KB_CATEGORIES } from '@/types/ai'
import { XIcon, UploadIcon, CheckedIcon } from '@/icons'

interface KBUploadModalProps {
  open: boolean
  onClose: () => void
  aiAssistantId?: string
}

const ACCEPTED_TYPES = '.pdf,.docx,.txt,.csv'
const MAX_SIZE_MB = 10

export function KBUploadModal({ open, onClose, aiAssistantId }: KBUploadModalProps) {
  const { upload } = useKbMutations()
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Program')
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const reset = useCallback(() => {
    setTitle('')
    setCategory('Program')
    setFile(null)
    setError('')
  }, [])

  const handleClose = useCallback(() => {
    reset()
    onClose()
  }, [reset, onClose])

  const validateFile = useCallback((f: File): string | null => {
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      return `Ukuran file melebihi ${MAX_SIZE_MB}MB`
    }
    const ext = f.name.split('.').pop()?.toLowerCase()
    if (!['pdf', 'docx', 'txt', 'csv'].includes(ext ?? '')) {
      return 'Tipe file tidak didukung'
    }
    return null
  }, [])

  const handleFile = useCallback((f: File) => {
    const err = validateFile(f)
    if (err) {
      setError(err)
      return
    }
    setError('')
    setFile(f)
    if (!title) {
      setTitle(f.name.replace(/\.[^/.]+$/, ''))
    }
  }, [validateFile, title])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }, [handleFile])

  const handleSubmit = useCallback(() => {
    if (!title.trim() || !file) return
    upload.mutate(
      { file, title: title.trim(), category, aiAssistantId },
      {
        onSuccess: handleClose,
        onError: (err) => setError(err instanceof Error ? err.message : 'Gagal mengunggah dokumen.'),
      },
    )
  }, [title, category, file, aiAssistantId, upload, handleClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
      <div className="relative bg-canvas rounded-2xl shadow-lg w-full max-w-lg mx-4 border border-hairline">
        <div className="flex items-center justify-between px-6 py-4 border-b border-hairline-soft">
          <h3 className="text-base font-semibold text-ink">Upload Dokumen Knowledge Base</h3>
          <button onClick={handleClose} className="text-steel hover:text-ink transition-colors">
            <XIcon size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div>
            <label className="text-xs font-medium text-steel mb-1.5 block">Judul Dokumen</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan judul dokumen..."
              className="w-full h-9 rounded-md border border-hairline bg-canvas px-3 text-sm text-ink placeholder:text-stone focus:outline-none focus:border-2 focus:border-brand-blue-deep"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-steel mb-1.5 block">Kategori</label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {KB_CATEGORIES.filter((c) => c !== 'Semua').map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                    category === cat
                      ? 'bg-brand-blue-deep text-white border-brand-blue-deep'
                      : 'bg-canvas text-steel border-hairline hover:bg-surface',
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-steel mb-1.5 block">File</label>
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                'border-2 border-dashed rounded-xl py-8 text-center cursor-pointer transition-colors',
                isDragging ? 'border-brand-blue-deep bg-brand-blue-200/30' : 'border-hairline hover:border-brand-blue-deep hover:bg-surface-soft',
                file && 'border-emerald-300 bg-emerald-50/50',
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_TYPES}
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) handleFile(f)
                }}
              />
              {file ? (
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700">
                    <CheckedIcon size={16} color="currentColor" />
                    {file.name}
                  </div>
                  <p className="text-xs text-steel">{(file.size / 1024).toFixed(0)} KB</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-surface">
                    <UploadIcon size={18} className="text-steel" />
                  </div>
                  <p className="text-sm text-steel">Seret file ke sini atau klik untuk memilih</p>
                  <p className="text-xs text-stone">PDF, DOCX, TXT, CSV — Maks {MAX_SIZE_MB}MB</p>
                </div>
              )}
            </div>
            {error && (
              <p className="text-xs text-red-500 mt-2">{error}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-hairline-soft">
          <Button variant="ghost" size="sm" onClick={handleClose}>Batal</Button>
          <Button
            variant="primary"
            size="sm"
            disabled={!title.trim() || !file || upload.isPending}
            onClick={handleSubmit}
          >
            {upload.isPending ? 'Mengunggah…' : 'Upload'}
          </Button>
        </div>
      </div>
    </div>
  )
}
