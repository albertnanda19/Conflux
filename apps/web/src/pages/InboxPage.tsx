import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useInboxStore } from '@/stores/ui'
import { ConversationList } from '@/components/inbox/ConversationList'
import { ChatPanel } from '@/components/inbox/ChatPanel'
import { ContactDetailPanel } from '@/components/inbox/ContactDetailPanel'

export function InboxPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { selectedConversationId, detailPanelOpen, selectConversation, setDetailPanelOpen } = useInboxStore()
  const initialSync = useRef(false)

  useEffect(() => {
    if (initialSync.current) return
    initialSync.current = true

    const urlChat = searchParams.get('chat')
    const urlDetail = searchParams.get('detail')

    if (urlChat) {
      selectConversation(urlChat)
    }
    if (urlDetail === '0') {
      setDetailPanelOpen(false)
    }
  }, [searchParams, selectConversation, setDetailPanelOpen])

  useEffect(() => {
    if (!initialSync.current) return

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)

      if (selectedConversationId) {
        next.set('chat', selectedConversationId)
      } else {
        next.delete('chat')
      }

      if (selectedConversationId) {
        next.set('detail', detailPanelOpen ? '1' : '0')
      } else {
        next.delete('detail')
      }

      return next
    }, { replace: true })
  }, [selectedConversationId, detailPanelOpen, setSearchParams])

  return (
    <div className="flex h-full overflow-hidden">
      <ConversationList />
      <ChatPanel />
      <ContactDetailPanel />
    </div>
  )
}
