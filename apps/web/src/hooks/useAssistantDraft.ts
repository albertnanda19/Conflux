import { useEffect, useRef, useState, useCallback } from 'react'
import type { AIAssistant } from '@/types/ai'
import type { AssistantWritePatch } from '@/lib/api/ai-assistants'

const DEBOUNCE_MS = 600

export function useAssistantDraft(
  server: AIAssistant | undefined,
  save: (id: string, patch: AssistantWritePatch) => void,
) {
  const [draft, setDraft] = useState<AIAssistant | null>(server ?? null)
  const pending = useRef<AssistantWritePatch>({})
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dirty = useRef(false)

  useEffect(() => {
    if (server && !dirty.current) setDraft(server)
  }, [server])

  const flush = useCallback(() => {
    if (!draft || Object.keys(pending.current).length === 0) return
    save(draft.id, pending.current)
    pending.current = {}
    dirty.current = false
  }, [draft, save])

  const edit = useCallback((patch: AssistantWritePatch) => {
    dirty.current = true
    setDraft((prev) => (prev ? { ...prev, ...patch } : prev))
    pending.current = { ...pending.current, ...patch }
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setDraft((current) => {
        if (current && Object.keys(pending.current).length > 0) {
          save(current.id, pending.current)
          pending.current = {}
          dirty.current = false
        }
        return current
      })
    }, DEBOUNCE_MS)
  }, [save])

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  return { draft, edit, flush }
}
