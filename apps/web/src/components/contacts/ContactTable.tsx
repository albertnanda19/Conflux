import { getAgentById, formatCurrency, type CrmContact, type PipelineColumn } from '@/mock/crm'
import { ChannelIcon } from '@/components/inbox/ChannelIcon'
import { LabelBadge } from '@/components/labels/LabelBadge'
import { formatRelativeTime } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
} from '@/components/ui/dropdown'
import { useCrmStore } from '@/stores/crm'
import type { PipelineStatus } from '@/mock/inbox'

interface ContactTableProps {
  contacts: CrmContact[]
  selectedIds: Set<string>
  onSelectAll: (checked: boolean) => void
  onSelectOne: (id: string, checked: boolean) => void
  onSelectContact: (id: string) => void
}

function StatusBadge({ status, columns }: { status: PipelineStatus; columns: PipelineColumn[] }) {
  const col = columns.find((c) => c.id === status)
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full bg-surface">
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: col?.color ?? '#888' }} />
      {col?.name ?? status}
    </span>
  )
}

export function ContactTable({
  contacts,
  selectedIds,
  onSelectAll,
  onSelectOne,
  onSelectContact,
}: ContactTableProps) {
  const columns = useCrmStore((s) => s.columns)
  const allChecked = contacts.length > 0 && contacts.every((c) => selectedIds.has(c.id))

  return (
    <div className="overflow-x-auto rounded-xl border border-hairline">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-hairline bg-surface">
            <th className="w-10 px-3 py-2.5">
              <Checkbox
                checked={allChecked}
                onCheckedChange={(v) => onSelectAll(v === true)}
              />
            </th>
            <th className="text-left px-3 py-2.5 font-medium text-steel">Nama</th>
            <th className="text-left px-3 py-2.5 font-medium text-steel">Telepon</th>
            <th className="text-left px-3 py-2.5 font-medium text-steel">Email</th>
            <th className="text-left px-3 py-2.5 font-medium text-steel">Channel</th>
            <th className="text-left px-3 py-2.5 font-medium text-steel">Status</th>
            <th className="text-left px-3 py-2.5 font-medium text-steel">Label</th>
            <th className="text-left px-3 py-2.5 font-medium text-steel">Agent</th>
            <th className="text-right px-3 py-2.5 font-medium text-steel">Nilai</th>
            <th className="text-left px-3 py-2.5 font-medium text-steel">Dibuat</th>
            <th className="w-10 px-3 py-2.5" />
          </tr>
        </thead>
        <tbody>
          {contacts.map((c) => {
            const agent = c.assignedAgentId ? getAgentById(c.assignedAgentId) : null
            return (
              <tr
                key={c.id}
                className="border-b border-hairline last:border-b-0 hover:bg-surface/50 cursor-pointer transition-colors"
                onClick={() => onSelectContact(c.id)}
              >
                <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedIds.has(c.id)}
                    onCheckedChange={(v) => onSelectOne(c.id, v === true)}
                  />
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-brand-blue-100 flex items-center justify-center text-xs font-medium text-brand-blue-deep flex-shrink-0">
                      {c.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                    </div>
                    <span className="font-medium text-ink truncate">{c.name}</span>
                  </div>
                </td>
                <td className="px-3 py-2.5 text-steel whitespace-nowrap">{c.phone ?? '—'}</td>
                <td className="px-3 py-2.5 text-steel truncate max-w-[160px]">{c.email ?? '—'}</td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <ChannelIcon channel={c.source} size={16} />
                    <span className="text-xs text-steel capitalize">{c.source}</span>
                  </div>
                </td>
                <td className="px-3 py-2.5"><StatusBadge status={c.pipelineStatus} columns={columns} /></td>
                <td className="px-3 py-2.5">
                  <div className="flex flex-wrap gap-1">
                    {c.labels.map((l) => (
                      <LabelBadge key={l.id} name={l.name} color={l.color} />
                    ))}
                  </div>
                </td>
                <td className="px-3 py-2.5 text-steel">
                  {agent ? (
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-surface flex items-center justify-center text-[10px] font-medium text-steel">
                        {agent.initials}
                      </span>
                      {agent.name}
                    </span>
                  ) : '—'}
                </td>
                <td className="px-3 py-2.5 text-right font-medium text-ink whitespace-nowrap">
                  {formatCurrency(c.programValue)}
                </td>
                <td className="px-3 py-2.5 text-steel whitespace-nowrap text-xs">
                  {formatRelativeTime(c.createdAt)}
                </td>
                <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                  <Dropdown>
                    <DropdownTrigger className="w-7 h-7 flex items-center justify-center text-steel hover:text-ink hover:bg-surface rounded transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01" />
                      </svg>
                    </DropdownTrigger>
                    <DropdownContent align="end" sideOffset={-2}>
                      <DropdownItem onClick={() => onSelectContact(c.id)}>
                        Lihat Detail
                      </DropdownItem>
                      <DropdownSeparator />
                      <DropdownItem className="text-red-600 focus:text-red-600">
                        Hapus
                      </DropdownItem>
                    </DropdownContent>
                  </Dropdown>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
