import { useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAIAssistant, useAIAssistantMutations } from '@/hooks/ai-assistants'
import { useAssistantDraft } from '@/hooks/useAssistantDraft'
import { AIAssistantAssignmentCard } from '@/components/ai-assistants/AIAssistantAssignmentCard'
import { AIAssistantFormModal } from '@/components/ai-assistants/AIAssistantFormModal'
import { AIAssistantKBSelector } from '@/components/ai-assistants/AIAssistantKBSelector'
import { AssignAgentModal } from '@/components/ai-assistants/AssignAgentModal'
import { AIChatPreview } from '@/components/ai/AIChatPreview'
import { Badge } from '@/components/ui/badge'

const STATUS_CONFIG: Record<string, { label: string; variant: 'success' | 'warning' | 'default'; dotColor: string }> = {
  active: { label: 'Aktif', variant: 'success', dotColor: 'bg-emerald-500' },
  draft: { label: 'Draft', variant: 'default', dotColor: 'bg-stone' },
  paused: { label: 'Jeda', variant: 'warning', dotColor: 'bg-amber-500' },
}

const TONE_LABELS: Record<string, string> = {
  formal: 'Formal',
  'semi-formal': 'Semi-Formal',
  casual: 'Casual',
}

const TIME_OPTIONS = Array.from({ length: 25 }, (_, i) => {
  const h = Math.floor(i / 2)
  const m = i % 2 === 0 ? '00' : '30'
  return `${String(h).padStart(2, '0')}:${m}`
})

export function AIAssistantDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: serverAssistant, isLoading } = useAIAssistant(id)
  const { update, remove, cycleStatus, assign } = useAIAssistantMutations()
  const saveDraft = useCallback((aid: string, patch: Parameters<typeof update.mutate>[0]['patch']) => {
    update.mutate({ id: aid, patch })
  }, [update])
  const { draft: assistant, edit } = useAssistantDraft(serverAssistant, saveDraft)
  const editAssistant = useCallback((_id: string, patch: Parameters<typeof edit>[0]) => edit(patch), [edit])

  const [editOpen, setEditOpen] = useState(false)
  const [assignOpen, setAssignOpen] = useState(false)
  const [chatPreviewOpen, setChatPreviewOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [keywordInput, setKeywordInput] = useState('')

  const handleSave = useCallback((data: Parameters<typeof edit>[0]) => {
    if (id && data) {
      edit(data)
      setEditOpen(false)
    }
  }, [id, edit])

  const handleAssign = useCallback((agentId: string) => {
    if (id) assign.mutate({ id, agentId })
  }, [id, assign])

  const handleUnassign = useCallback(() => {
    if (id) assign.mutate({ id, agentId: null })
  }, [id, assign])

  const handleToggleStatus = useCallback(() => {
    if (id) cycleStatus.mutate(id)
  }, [id, cycleStatus])

  const handleDelete = useCallback(() => {
    if (id) {
      remove.mutate(id)
      navigate('/ai-assistants')
    }
  }, [id, remove, navigate])

  const handleKBChange = useCallback((patch: { knowledgeBaseScope?: 'global' | 'custom'; customKBDocumentIds?: string[] }) => {
    edit(patch)
  }, [edit])

  const handleAddKeyword = useCallback(() => {
    const val = keywordInput.trim()
    if (val && assistant && !assistant.handoffConfig.triggerKeywords.includes(val)) {
      const newKeywords = [...assistant.handoffConfig.triggerKeywords, val]
      editAssistant(id!, { handoffConfig: { ...assistant.handoffConfig, triggerKeywords: newKeywords } })
      setKeywordInput('')
    }
  }, [keywordInput, assistant, id, editAssistant])

  const handleRemoveKeyword = useCallback((kw: string) => {
    if (assistant) {
      const newKeywords = assistant.handoffConfig.triggerKeywords.filter((k) => k !== kw)
      editAssistant(id!, { handoffConfig: { ...assistant.handoffConfig, triggerKeywords: newKeywords } })
    }
  }, [assistant, id, editAssistant])

  const handleToggleConversionSignal = useCallback((csId: string) => {
    if (assistant) {
      const newSignals = assistant.handoffConfig.conversionSignals.map((cs) =>
        cs.id === csId ? { ...cs, enabled: !cs.enabled } : cs,
      )
      editAssistant(id!, { handoffConfig: { ...assistant.handoffConfig, conversionSignals: newSignals } })
    }
  }, [assistant, id, editAssistant])

  const handleUpdateHandoff = useCallback((patch: Partial<NonNullable<typeof assistant>['handoffConfig']>) => {
    if (assistant) {
      editAssistant(id!, { handoffConfig: { ...assistant.handoffConfig, ...patch } })
    }
  }, [assistant, id, editAssistant])

  const handleUpdateWorkingHours = useCallback((patch: Partial<NonNullable<typeof assistant>['workingHours']>) => {
    if (assistant) {
      editAssistant(id!, { workingHours: { ...assistant.workingHours, ...patch } })
    }
  }, [assistant, id, editAssistant])

  const handleToggleWorkingDay = useCallback((day: string) => {
    if (assistant) {
      const newDays = assistant.workingHours.days.map((d) =>
        d.day === day ? { ...d, enabled: !d.enabled } : d,
      )
      editAssistant(id!, { workingHours: { ...assistant.workingHours, days: newDays } })
    }
  }, [assistant, id, editAssistant])

  const handleUpdateWorkingDayHours = useCallback((day: string, start: string, end: string) => {
    if (assistant) {
      const newDays = assistant.workingHours.days.map((d) =>
        d.day === day ? { ...d, start, end } : d,
      )
      editAssistant(id!, { workingHours: { ...assistant.workingHours, days: newDays } })
    }
  }, [assistant, id, editAssistant])

  if (isLoading && !assistant) {
    return (
      <div className="p-8 h-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-blue-deep border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!assistant) {
    return (
      <div className="p-8 h-full flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-lg font-semibold text-ink mb-2">AI Assistant tidak ditemukan</h1>
          <p className="text-sm text-steel mb-4">AI Assistant dengan ID &quot;{id}&quot; tidak ada.</p>
          <button
            type="button"
            onClick={() => navigate('/ai-assistants')}
            className="h-9 px-4 text-sm font-medium bg-brand-blue text-white rounded-full hover:bg-brand-blue-deep transition-colors"
          >
            Kembali ke AI Assistant
          </button>
        </div>
      </div>
    )
  }

  const statusInfo = STATUS_CONFIG[assistant.status]

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/ai-assistants')}
            className="w-9 h-9 flex items-center justify-center text-steel hover:text-ink border border-hairline rounded-lg hover:bg-surface transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-3xl">{assistant.avatar}</span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-ink">{assistant.name}</h1>
              <span className={`w-2 h-2 rounded-full ${statusInfo.dotColor} ${assistant.status === 'active' ? 'animate-pulse' : ''}`} />
              <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
            </div>
            <p className="text-xs text-steel mt-0.5">
              dibuat {new Date(assistant.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleStatus}
            className="h-9 px-4 text-sm font-medium text-steel hover:text-ink border border-hairline rounded-full hover:bg-surface transition-colors flex items-center gap-2"
          >
            <span className={`w-2 h-2 rounded-full ${assistant.status === 'active' ? 'bg-emerald-500' : assistant.status === 'paused' ? 'bg-amber-500' : 'bg-stone'}`} />
            Ganti Status
          </button>
          <button
            onClick={() => setEditOpen(true)}
            className="h-9 px-4 text-sm font-medium text-steel hover:text-ink border border-hairline rounded-full hover:bg-surface transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <button
            onClick={() => setDeleteConfirmOpen(true)}
            className="h-9 px-4 text-sm font-medium text-red-500 hover:text-red-600 border border-red-200 rounded-full hover:bg-red-50 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Hapus
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="card-base p-5 animate-fade-in" style={{ animationDelay: '50ms' }}>
          <AIAssistantAssignmentCard assistant={assistant} onAssign={() => setAssignOpen(true)} />
        </div>

        <div className="card-base p-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <h2 className="text-base font-semibold text-ink mb-1">Persona</h2>
          <p className="text-xs text-steel mb-5">Konfigurasi karakter dan gaya bahasa AI Assistant ini.</p>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-ink">Nama Persona</label>
                <input
                  type="text"
                  value={assistant.persona.name}
                  onChange={(e) => editAssistant(id!, { persona: { ...assistant.persona, name: e.target.value } })}
                  className="w-full text-sm text-ink bg-canvas border border-hairline-soft rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-blue-deep focus:ring-offset-1"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-ink">Bahasa</label>
                <select
                  value={assistant.persona.language}
                  onChange={(e) => editAssistant(id!, { persona: { ...assistant.persona, language: e.target.value } })}
                  className="w-full text-sm text-ink bg-canvas border border-hairline-soft rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-blue-deep focus:ring-offset-1"
                >
                  <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                  <option value="English">English</option>
                  <option value="Bahasa Indonesia & English">Bilingual (ID + EN)</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Gaya Bahasa</label>
              <div className="grid grid-cols-3 gap-2">
                {(['formal', 'semi-formal', 'casual'] as const).map((tone) => (
                  <button
                    key={tone}
                    onClick={() => editAssistant(id!, { persona: { ...assistant.persona, tone } })}
                    className={`px-4 py-3 rounded-xl text-left transition-all ${
                      assistant.persona.tone === tone
                        ? 'bg-brand-blue-deep text-white shadow-md'
                        : 'bg-canvas border border-hairline-soft hover:border-brand-blue-200'
                    }`}
                  >
                    <span className={`text-sm font-semibold ${assistant.persona.tone === tone ? 'text-white' : 'text-ink'}`}>
                      {TONE_LABELS[tone]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">System Prompt</label>
              <textarea
                value={assistant.persona.systemPrompt}
                onChange={(e) => editAssistant(id!, { persona: { ...assistant.persona, systemPrompt: e.target.value } })}
                rows={5}
                className="w-full text-sm text-ink bg-canvas border border-hairline-soft rounded-xl px-4 py-3 resize-none font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-blue-deep focus:ring-offset-1"
              />
            </div>
          </div>
        </div>

        <div className="card-base p-6 animate-fade-in" style={{ animationDelay: '150ms' }}>
          <h2 className="text-base font-semibold text-ink mb-1">Knowledge Base</h2>
          <p className="text-xs text-steel mb-5">Tentukan dokumen mana yang digunakan AI Assistant ini.</p>
          <AIAssistantKBSelector
            scope={assistant.knowledgeBaseScope}
            customDocumentIds={assistant.customKBDocumentIds}
            onScopeChange={(scope) => handleKBChange({ knowledgeBaseScope: scope })}
            onCustomDocsChange={(ids) => handleKBChange({ customKBDocumentIds: ids })}
          />
        </div>

        <div className="card-base p-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <h2 className="text-base font-semibold text-ink mb-1">Jam Aktif</h2>
          <p className="text-xs text-steel mb-5">Tentukan kapan AI Assistant ini aktif secara otomatis.</p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-ink">Timezone</span>
              <span className="text-sm text-steel bg-surface-soft px-3 py-1.5 rounded-full">{assistant.workingHours.timezone}</span>
            </div>
            <div className="space-y-2">
              {assistant.workingHours.days.map((d) => (
                <div
                  key={d.day}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${
                    d.enabled ? 'bg-canvas border border-hairline-soft' : 'bg-surface-soft/50'
                  }`}
                >
                  <button
                    onClick={() => handleToggleWorkingDay(d.day)}
                    className={`relative w-10 h-6 rounded-full transition-colors flex-shrink-0 ${
                      d.enabled ? 'bg-emerald-500' : 'bg-hairline'
                    }`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${d.enabled ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                  <span className={`text-sm font-medium w-16 flex-shrink-0 ${d.enabled ? 'text-ink' : 'text-stone'}`}>
                    {d.dayLabel}
                  </span>
                  <div className={`flex items-center gap-2 ml-auto ${d.enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                    <select
                      value={d.start}
                      onChange={(e) => handleUpdateWorkingDayHours(d.day, e.target.value, d.end)}
                      className="text-sm text-ink bg-canvas border border-hairline-soft rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-blue-deep focus:ring-offset-1"
                    >
                      {TIME_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <span className="text-xs text-stone">—</span>
                    <select
                      value={d.end}
                      onChange={(e) => handleUpdateWorkingDayHours(d.day, d.start, e.target.value)}
                      className="text-sm text-ink bg-canvas border border-hairline-soft rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-blue-deep focus:ring-offset-1"
                    >
                      {TIME_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Pesan Di Luar Jam Kerja</label>
              <textarea
                value={assistant.workingHours.oooMessage}
                onChange={(e) => handleUpdateWorkingHours({ oooMessage: e.target.value })}
                rows={3}
                className="w-full text-sm text-ink bg-canvas border border-hairline-soft rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-brand-blue-deep focus:ring-offset-1"
              />
            </div>
          </div>
        </div>

        <div className="card-base p-6 animate-fade-in" style={{ animationDelay: '250ms' }}>
          <h2 className="text-base font-semibold text-ink mb-1">Handoff ke Agent</h2>
          <p className="text-xs text-steel mb-5">Konfigurasi kapan AI menyerahkan percakapan ke agent manusia.</p>
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-ink">Trigger Keywords</h3>
              <p className="text-xs text-stone">Ketika pesan pelanggan mengandung kata-kata ini, AI akan melakukan handoff.</p>
              <div className="flex flex-wrap gap-2">
                {assistant.handoffConfig.triggerKeywords.map((kw) => (
                  <span
                    key={kw}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-ink bg-surface-soft border border-hairline-soft rounded-full"
                  >
                    {kw}
                    <button
                      onClick={() => handleRemoveKeyword(kw)}
                      className="text-stone hover:text-red-500 transition-colors ml-0.5"
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <line x1="2" y1="2" x2="8" y2="8" />
                        <line x1="8" y1="2" x2="2" y2="8" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
                  placeholder="Ketik kata kunci lalu Enter..."
                  className="flex-1 text-sm text-ink bg-canvas border border-hairline-soft rounded-full px-4 py-2 placeholder:text-stone focus:outline-none focus:ring-2 focus:ring-brand-blue-deep focus:ring-offset-1"
                />
                <button
                  onClick={handleAddKeyword}
                  disabled={!keywordInput.trim()}
                  className="px-4 py-2 text-xs font-semibold text-white bg-brand-blue-deep rounded-full hover:bg-brand-blue-700 transition-colors disabled:opacity-40 disabled:pointer-events-none"
                >
                  Tambah
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-ink">Sinyal Konversi</h3>
              <p className="text-xs text-stone">AI akan otomatis mendeteksi sinyal ini dan meningkatkan prioritas handoff.</p>
              <div className="space-y-2">
                {assistant.handoffConfig.conversionSignals.map((cs) => (
                  <div
                    key={cs.id}
                    className="flex items-center justify-between px-4 py-3 rounded-xl bg-canvas border border-hairline-soft"
                  >
                    <div className="min-w-0 mr-4">
                      <p className="text-sm text-ink">{cs.description}</p>
                      <span className="text-[10px] text-stone uppercase font-medium tracking-wide">{cs.type}</span>
                    </div>
                    <button
                      onClick={() => handleToggleConversionSignal(cs.id)}
                      className={`relative w-10 h-6 rounded-full transition-colors flex-shrink-0 ${cs.enabled ? 'bg-emerald-500' : 'bg-hairline'}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${cs.enabled ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-ink">Pesan Handoff</h3>
              <textarea
                value={assistant.handoffConfig.handoffMessage}
                onChange={(e) => handleUpdateHandoff({ handoffMessage: e.target.value })}
                rows={3}
                className="w-full text-sm text-ink bg-canvas border border-hairline-soft rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-brand-blue-deep focus:ring-offset-1"
              />
            </div>

            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-canvas border border-hairline-soft">
              <div>
                <p className="text-sm font-medium text-ink">Batas Pesan AI Sebelum Handoff</p>
                <p className="text-xs text-stone mt-0.5">Setelah {assistant.handoffConfig.maxAiMessages} pesan tanpa resolusi, AI akan handoff otomatis.</p>
              </div>
              <input
                type="number"
                min={1}
                max={50}
                value={assistant.handoffConfig.maxAiMessages}
                onChange={(e) => handleUpdateHandoff({ maxAiMessages: Math.max(1, Number(e.target.value)) })}
                className="w-16 text-center text-sm font-medium text-ink bg-canvas border border-hairline-soft rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-blue-deep focus:ring-offset-1"
              />
            </div>

            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-canvas border border-hairline-soft">
              <div>
                <p className="text-sm font-medium text-ink">Notifikasi Prioritas</p>
                <p className="text-xs text-stone mt-0.5">Kirim notifikasi prioritas ke agent saat handoff terjadi.</p>
              </div>
              <button
                onClick={() => handleUpdateHandoff({ priorityNotification: !assistant.handoffConfig.priorityNotification })}
                className={`relative w-10 h-6 rounded-full transition-colors flex-shrink-0 ${assistant.handoffConfig.priorityNotification ? 'bg-emerald-500' : 'bg-hairline'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${assistant.handoffConfig.priorityNotification ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="card-base p-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold text-ink">Test AI Assistant</h2>
              <p className="text-xs text-steel mt-0.5">Simulasikan percakapan dengan AI Assistant ini.</p>
            </div>
            <button
              onClick={() => setChatPreviewOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-brand-blue-deep border border-brand-blue-200 rounded-full hover:bg-brand-blue-50 transition-colors"
            >
              ✨ Test AI
            </button>
          </div>
        </div>
      </div>

      <AIAssistantFormModal
        open={editOpen}
        onOpenChange={setEditOpen}
        editingAssistant={assistant}
        onSave={handleSave}
      />

      <AssignAgentModal
        open={assignOpen}
        onOpenChange={setAssignOpen}
        assistant={assistant}
        onAssign={handleAssign}
        onUnassign={handleUnassign}
      />

      {chatPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setChatPreviewOpen(false)} />
          <div className="relative bg-canvas rounded-2xl shadow-xl w-full max-w-md mx-4 border border-hairline overflow-hidden h-[520px] flex flex-col animate-in zoom-in-95 fade-in duration-200">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-hairline-soft flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-lg">{assistant.avatar}</span>
                <div>
                  <h3 className="text-sm font-semibold text-ink">Test {assistant.name}</h3>
                  <p className="text-[10px] text-stone mt-0.5">Simulasi percakapan</p>
                </div>
              </div>
              <button
                onClick={() => setChatPreviewOpen(false)}
                className="p-1.5 rounded-lg text-stone hover:text-ink hover:bg-surface-soft transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="flex-1 min-h-0">
              <AIChatPreview assistantId={assistant.id} personaName={assistant.persona.name} />
            </div>
          </div>
        </div>
      )}

      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setDeleteConfirmOpen(false)} />
          <div className="relative bg-canvas rounded-2xl shadow-xl w-full max-w-sm mx-4 border border-hairline p-6 text-center animate-in zoom-in-95 fade-in duration-200">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-xl mx-auto mb-4">🗑️</div>
            <h3 className="text-base font-semibold text-ink mb-1">Hapus AI Assistant?</h3>
            <p className="text-sm text-steel mb-1"><span className="font-medium">{assistant.name}</span> akan dihapus permanen.</p>
            <p className="text-xs text-stone mb-5">Agent yang di-assign akan kehilangan asisten mereka.</p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="h-9 px-4 text-sm font-medium text-steel hover:text-ink rounded-full hover:bg-surface transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="h-9 px-5 text-sm font-semibold text-white bg-red-500 rounded-full hover:bg-red-600 transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
