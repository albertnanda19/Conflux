import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { WS_URL } from '@/lib/constants'
import { getAccessToken } from '@/lib/api/client'
import { queryKeys } from '@/lib/queryKeys'
import { useInboxStore } from '@/stores/ui'
import { useNotificationStore } from '@/stores/notifications'
import type { Message } from '@/types/inbox'

function notifyNewMessage(body: string) {
  const { soundEnabled, browserPushEnabled } = useNotificationStore.getState()
  if (soundEnabled) {
    try {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      const ctx = new Ctx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = 880
      gain.gain.setValueAtTime(0.05, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25)
      osc.start()
      osc.stop(ctx.currentTime + 0.25)
      osc.onended = () => ctx.close()
    } catch {
      // abaikan: audio diblok browser
    }
  }
  if (browserPushEnabled && typeof Notification !== 'undefined' && Notification.permission === 'granted') {
    try {
      new Notification('Pesan baru', { body })
    } catch {
      // abaikan
    }
  }
}

type RealtimeEvent =
  | { type: 'message:new'; data: Message }
  | { type: 'message:status'; data: { id: string; conversationId: string; status: Message['status'] } }
  | { type: 'conversation:updated'; data: { id: string } }
  | { type: 'conversation:assigned'; data: { id: string; agentId: string | null } }
  | { type: 'presence:changed'; data: { userId: string; status: string } }
  | { type: 'notification:new'; data: { id: string; type: 'new_message' | 'new_assignment' | 'ai_handoff' | 'stale_message'; title: string; body: string; conversationId?: string; read: boolean; createdAt: string } }

export function useInboxRealtime() {
  const qc = useQueryClient()
  const selectedConversationId = useInboxStore((s) => s.selectedConversationId)
  const addNotification = useNotificationStore((s) => s.addNotification)
  const loadNotifications = useNotificationStore((s) => s.loadFromServer)
  const wsRef = useRef<WebSocket | null>(null)
  const subscribedRef = useRef<string | null>(null)
  const reconnectRef = useRef<{ attempts: number; timer: number | null }>({ attempts: 0, timer: null })

  useEffect(() => {
    let closedByUnmount = false

    const connect = () => {
      const token = getAccessToken()
      if (!token) return
      const ws = new WebSocket(`${WS_URL}/ws?token=${encodeURIComponent(token)}`)
      wsRef.current = ws

      ws.onopen = () => {
        reconnectRef.current.attempts = 0
        if (subscribedRef.current) {
          ws.send(JSON.stringify({ action: 'subscribe', conversationId: subscribedRef.current }))
        }
      }

      ws.onmessage = (ev) => {
        let event: RealtimeEvent
        try {
          event = JSON.parse(typeof ev.data === 'string' ? ev.data : '') as RealtimeEvent
        } catch {
          return
        }

        if (event.type === 'message:new') {
          const msg = event.data
          qc.setQueryData<{ data: Message[]; nextCursor: string | null }>(
            queryKeys.messages(msg.conversationId),
            (prev) => {
              if (!prev) return prev
              if (prev.data.some((m) => m.id === msg.id)) return prev
              return { ...prev, data: [...prev.data, msg] }
            },
          )
          qc.invalidateQueries({ queryKey: ['conversations'] })
        } else if (event.type === 'message:status') {
          const { id, conversationId, status } = event.data
          qc.setQueryData<{ data: Message[]; nextCursor: string | null }>(
            queryKeys.messages(conversationId),
            (prev) => (prev ? { ...prev, data: prev.data.map((m) => (m.id === id ? { ...m, status } : m)) } : prev),
          )
        } else if (event.type === 'conversation:updated') {
          qc.invalidateQueries({ queryKey: ['conversations'] })
          qc.invalidateQueries({ queryKey: queryKeys.conversation(event.data.id) })
        } else if (event.type === 'conversation:assigned') {
          qc.invalidateQueries({ queryKey: ['conversations'] })
          qc.invalidateQueries({ queryKey: queryKeys.conversation(event.data.id) })
        } else if (event.type === 'presence:changed') {
          qc.invalidateQueries({ queryKey: queryKeys.agents() })
        } else if (event.type === 'notification:new') {
          addNotification(event.data)
          notifyNewMessage(event.data.body || event.data.title)
        }
      }

      ws.onclose = () => {
        wsRef.current = null
        if (closedByUnmount) return
        const attempts = Math.min(reconnectRef.current.attempts + 1, 6)
        reconnectRef.current.attempts = attempts
        reconnectRef.current.timer = window.setTimeout(connect, Math.min(1000 * 2 ** attempts, 30000))
      }
    }

    connect()
    void loadNotifications()

    return () => {
      closedByUnmount = true
      if (reconnectRef.current.timer) window.clearTimeout(reconnectRef.current.timer)
      wsRef.current?.close()
      wsRef.current = null
    }
  }, [qc, addNotification, loadNotifications])

  useEffect(() => {
    const ws = wsRef.current
    const prev = subscribedRef.current
    if (prev === selectedConversationId) return
    if (ws?.readyState === WebSocket.OPEN) {
      if (prev) ws.send(JSON.stringify({ action: 'unsubscribe', conversationId: prev }))
      if (selectedConversationId) ws.send(JSON.stringify({ action: 'subscribe', conversationId: selectedConversationId }))
    }
    subscribedRef.current = selectedConversationId
  }, [selectedConversationId])
}
