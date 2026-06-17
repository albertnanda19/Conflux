import { useState, useRef } from 'react'

interface ImageUploadProps {
  currentUrl: string | null
  onUpload: (previewUrl: string) => void
  onRemove: () => void
  accept?: string
  maxSize?: number
}

export function ImageUpload({
  currentUrl,
  onUpload,
  onRemove,
  accept = 'image/*',
  maxSize = 2,
}: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const validateAndUpload = (file: File) => {
    setError(null)
    if (!file.type.startsWith('image/')) {
      setError('Hanya file gambar yang diizinkan.')
      return
    }
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Ukuran file maksimal ${maxSize}MB.`)
      return
    }
    onUpload(URL.createObjectURL(file))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) validateAndUpload(file)
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) validateAndUpload(file)
  }

  if (currentUrl) {
    return (
      <div className="flex items-center gap-4 px-4 py-3 rounded-xl border border-hairline-soft bg-canvas">
        <img
          src={currentUrl}
          alt="Logo preview"
          className="w-16 h-16 rounded-lg object-cover border border-hairline-soft"
        />
        <div className="flex items-center gap-2">
          <button
            onClick={() => inputRef.current?.click()}
            className="px-3 py-1.5 text-xs font-semibold text-brand-blue-deep border border-brand-blue-200 rounded-full hover:bg-brand-blue-50 transition-colors"
          >
            Ganti
          </button>
          <button
            onClick={onRemove}
            className="px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 rounded-full hover:bg-red-50 transition-colors"
          >
            Hapus
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    )
  }

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
          isDragOver
            ? 'border-brand-blue-deep bg-brand-blue-50'
            : 'border-hairline-soft hover:border-brand-blue-200'
        }`}
      >
        <div className="flex flex-col items-center gap-2">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-steel">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <p className="text-sm text-ink font-medium">Klik atau seret logo ke sini</p>
          <p className="text-xs text-stone">Format: PNG, JPG, SVG. Maks {maxSize}MB.</p>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
    </div>
  )
}
