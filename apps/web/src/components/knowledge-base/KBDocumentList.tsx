import { useState, useMemo, useCallback } from 'react'
import { useAISettingsStore } from '@/stores/ai-settings'
import { KBDocumentCard } from './KBDocumentCard'
import { KBCategoryFilter } from './KBCategoryFilter'
import { MagnifierIcon } from '@/icons'
import type { KBDocument } from '@/mock/ai-settings'

interface KBDocumentListProps {
  onView: (doc: KBDocument) => void
}

export function KBDocumentList({ onView }: KBDocumentListProps) {
  const { kbDocuments, removeKBDocument } = useAISettingsStore()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Semua')

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: kbDocuments.length }
    for (const doc of kbDocuments) {
      counts[doc.category] = (counts[doc.category] ?? 0) + 1
    }
    return counts
  }, [kbDocuments])

  const filtered = useMemo(() => {
    let result = kbDocuments
    if (category !== 'Semua') {
      result = result.filter((d) => d.category === category)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q) ||
          d.createdBy.toLowerCase().includes(q),
      )
    }
    return result
  }, [kbDocuments, category, search])

  const handleRemove = useCallback((id: string) => {
    removeKBDocument(id)
  }, [removeKBDocument])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <MagnifierIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari dokumen..."
            className="w-full h-9 rounded-full border border-hairline bg-surface pl-9 pr-3 text-sm text-ink placeholder:text-stone focus:outline-none focus:border-2 focus:border-brand-blue-deep"
          />
        </div>
      </div>

      <KBCategoryFilter selected={category} onSelect={setCategory} counts={categoryCounts} />

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="card-base text-center py-12">
            <p className="text-sm text-steel">Tidak ada dokumen ditemukan.</p>
          </div>
        ) : (
          filtered.map((doc) => (
            <KBDocumentCard
              key={doc.id}
              document={doc}
              onView={onView}
              onRemove={handleRemove}
            />
          ))
        )}
      </div>
    </div>
  )
}
