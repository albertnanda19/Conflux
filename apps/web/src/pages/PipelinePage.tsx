import { PIPELINE_COLUMNS } from "@/lib/constants"

export function PipelinePage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-ink mb-2">Pipeline</h1>
      <p className="text-steel text-sm mb-8">Track status lead Anda secara visual.</p>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {PIPELINE_COLUMNS.map((col) => (
          <div
            key={col.id}
            className="flex-shrink-0 w-72 bg-surface rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: col.color }}
              />
              <span className="text-sm font-medium text-ink">{col.name}</span>
              <span className="text-xs text-steel ml-auto">0</span>
            </div>
            <div className="min-h-[120px]" />
          </div>
        ))}
      </div>
    </div>
  )
}
