import { PenIcon, TrashIcon } from '@/icons'
import { type LabelWithCount } from '@/lib/api/inbox'
import { LabelBadge } from './LabelBadge'

interface LabelTableProps {
  labels: LabelWithCount[]
  onEdit: (label: LabelWithCount) => void
  onDelete: (label: LabelWithCount) => void
}

export function LabelTable({ labels, onEdit, onDelete }: LabelTableProps) {
  return (
    <div className="w-full">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-hairline">
            <th className="py-3 px-4 text-[11px] font-semibold text-steel uppercase tracking-wide">Label</th>
            <th className="py-3 px-4 text-[11px] font-semibold text-steel uppercase tracking-wide text-right">Percakapan</th>
            <th className="py-3 px-4 text-[11px] font-semibold text-steel uppercase tracking-wide text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {labels.map((label) => (
            <tr key={label.id} className="border-b border-hairline-soft hover:bg-surface-soft transition-colors">
              <td className="py-3 px-4">
                <LabelBadge name={label.name} color={label.color} size="md" />
              </td>
              <td className="py-3 px-4 text-sm text-steel text-right">
                {label.conversationCount ?? 0}
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => onEdit(label)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-medium text-steel border border-hairline rounded-full hover:bg-surface hover:text-ink transition-colors"
                  >
                    <PenIcon size={12} />
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(label)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-medium text-red-500 border border-red-200 rounded-full hover:bg-red-50 hover:text-red-700 transition-colors"
                  >
                    <TrashIcon size={12} />
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {labels.length === 0 && (
            <tr>
              <td colSpan={3} className="py-10 text-center text-sm text-steel">
                Belum ada label
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
