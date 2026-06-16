import { useInboxStore } from "@/stores/ui"

export function InboxPage() {
  const { selectedConversationId } = useInboxStore()

  return (
    <div className="flex h-full">
      <div className="w-80 border-r border-hairline flex flex-col">
        <div className="h-14 px-4 flex items-center border-b border-hairline">
          <h2 className="text-sm font-semibold text-ink">Inbox</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          <p className="px-4 py-8 text-sm text-steel text-center">
            Belum ada percakapan.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        {selectedConversationId ? (
          <p className="text-sm text-steel">Percakapan dipilih</p>
        ) : (
          <p className="text-sm text-steel">Pilih percakapan untuk mulai</p>
        )}
      </div>
    </div>
  )
}
