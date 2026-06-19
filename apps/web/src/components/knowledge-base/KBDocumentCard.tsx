import { Badge } from '@/components/ui/badge'
import { Toggle } from '@/components/ui/toggle'
import { EyeIcon, TrashIcon } from '@/icons'
import type { KBDocument } from '@/types/ai'

const FILE_TYPE_ICONS: Record<string, { label: string; color: string }> = {
  pdf: { label: 'PDF', color: 'text-red-500 bg-red-50' },
  docx: { label: 'DOC', color: 'text-brand-blue bg-brand-blue-200' },
  txt: { label: 'TXT', color: 'text-steel bg-surface' },
  csv: { label: 'CSV', color: 'text-emerald-600 bg-emerald-50' },
  xlsx: { label: 'XLS', color: 'text-emerald-600 bg-emerald-50' },
}

const STATUS_CONFIG: Record<string, { label: string; variant: 'success' | 'warning' | 'error' | 'default' }> = {
  completed: { label: 'Selesai', variant: 'success' },
  processing: { label: 'Memproses', variant: 'warning' },
  pending: { label: 'Menunggu', variant: 'default' },
  failed: { label: 'Gagal', variant: 'error' },
}

interface KBDocumentCardProps {
  document: KBDocument
  onView: (doc: KBDocument) => void
  onRemove: (id: string) => void
  onToggleActive: (id: string, isActive: boolean) => void
}

export function KBDocumentCard({ document, onView, onRemove, onToggleActive }: KBDocumentCardProps) {
  const fileInfo = FILE_TYPE_ICONS[document.fileType] ?? FILE_TYPE_ICONS.txt
  const statusInfo = STATUS_CONFIG[document.processingStatus]

  return (
    <div className="card-base p-4 flex items-start gap-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${fileInfo.color}`}>
        {fileInfo.label}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-ink truncate">{document.title}</span>
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
        </div>
        <div className="flex items-center gap-3 text-xs text-steel">
          <span>{document.category}</span>
          <span>•</span>
          <span>{document.fileSize}</span>
          {document.chunkCount > 0 && (
            <>
              <span>•</span>
              <span>{document.chunkCount} chunk</span>
            </>
          )}
          <span>•</span>
          <span>{document.createdBy}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <Toggle
          checked={document.isActive}
          onCheckedChange={() => onToggleActive(document.id, !document.isActive)}
        />
        <button
          onClick={() => onView(document)}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-steel border border-hairline rounded-full hover:bg-surface hover:text-ink transition-colors"
        >
          <EyeIcon size={12} />
          Detail
        </button>
        <button
          onClick={() => onRemove(document.id)}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-red-500 border border-red-200 rounded-full hover:bg-red-50 hover:text-red-700 transition-colors"
        >
          <TrashIcon size={11} />
        </button>
      </div>
    </div>
  )
}
