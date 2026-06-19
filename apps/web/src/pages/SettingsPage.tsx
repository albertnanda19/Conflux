import { useMemo, useState } from 'react'
import { useAiSettings, useAiSettingsMutations } from '@/hooks/ai-settings'
import { useAIAssistants, useAIAssistantMutations } from '@/hooks/ai-assistants'
import { useAssistantDraft } from '@/hooks/useAssistantDraft'
import { Tabs, TabList, TabTrigger, TabContent } from '@/components/ui/tabs'
import { ProviderConfig } from '@/components/settings/ProviderConfig'
import { WorkingHours } from '@/components/settings/WorkingHours'
import { HandoffConfig } from '@/components/settings/HandoffConfig'
import { PersonaConfig } from '@/components/settings/PersonaConfig'
import { AIChatPreview } from '@/components/ai/AIChatPreview'
import { ToastContainer } from '@/components/settings/toast'
import { UmumTab } from '@/components/settings/umum/UmumTab'
import { AkunTab } from '@/components/settings/akun/AkunTab'

export function SettingsPage() {
  const { data: settings } = useAiSettings()
  const { setEnabled } = useAiSettingsMutations()
  const aiEnabled = settings?.aiEnabled ?? false
  const { data: assistants = [] } = useAIAssistants({})
  const defaultAssistant = useMemo(() => assistants.find((a) => a.isDefault) ?? assistants[0], [assistants])
  const { update } = useAIAssistantMutations()
  const { draft, edit } = useAssistantDraft(defaultAssistant, (id, patch) => update.mutate({ id, patch }))
  const [chatPreviewOpen, setChatPreviewOpen] = useState(false)

  return (
    <div className="p-8 h-full">
      <h1 className="text-2xl font-semibold text-ink mb-2">Pengaturan</h1>
      <p className="text-steel text-sm mb-8">Konfigurasi platform dan integrasi.</p>

      <Tabs defaultValue="ai">
        <TabList className="mb-8">
          <TabTrigger value="ai">🤖 System Default AI</TabTrigger>
          <TabTrigger value="general">Umum</TabTrigger>
          <TabTrigger value="account">Akun</TabTrigger>
        </TabList>

        <TabContent value="ai">
          <div className="space-y-8">
            <div className="p-4 rounded-xl bg-brand-blue-50 border border-brand-blue-100">
              <p className="text-sm text-brand-blue-deep">
                Konfigurasi di bawah adalah <span className="font-semibold">default untuk semua AI Assistant</span>. Setiap AI Assistant bisa mengoverride konfigurasi ini secara independen di halaman masing-masing.
              </p>
            </div>

            <div className="card-base p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-ink">Aktivasi AI Auto-Reply</h2>
                  <p className="text-sm text-steel mt-1">
                    Ketika aktif, AI akan merespons pesan secara otomatis ketika tidak ada agent yang available.
                  </p>
                </div>
                <button
                  onClick={() => setEnabled.mutate(!aiEnabled)}
                  className={`relative w-12 h-7 rounded-full transition-colors ${
                    aiEnabled ? 'bg-emerald-500' : 'bg-hairline'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${
                      aiEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
              {aiEnabled && (
                <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                  <p className="text-sm text-emerald-700">
                    ✅ AI aktif — akan merespons pesan di luar jam kerja dan ketika semua agent offline/busy.
                  </p>
                </div>
              )}
            </div>

            <div className="card-base p-6">
              <h2 className="text-lg font-semibold text-ink mb-1">Provider AI & Fallback Chain</h2>
              <p className="text-sm text-steel mb-6">
                Urutan provider akan dicoba secara berurutan. Jika provider utama gagal, sistem otomatis beralih ke provider berikutnya.
              </p>
              <ProviderConfig />
            </div>

            <div className="card-base p-6">
              <h2 className="text-lg font-semibold text-ink mb-1">Jam Aktif AI</h2>
              <p className="text-sm text-steel mb-6">
                Tentukan kapan AI aktif secara otomatis. Di luar jam kerja, AI akan selalu merespons pesan.
              </p>
              {draft && <WorkingHours workingHours={draft.workingHours} onChange={(next) => edit({ workingHours: next })} />}
            </div>

            <div className="card-base p-6">
              <h2 className="text-lg font-semibold text-ink mb-1">Handoff ke Human Agent</h2>
              <p className="text-sm text-steel mb-6">
                Konfigurasi kapan AI menyerahkan percakapan ke agent manusia.
              </p>
              {draft && <HandoffConfig handoffConfig={draft.handoffConfig} onChange={(next) => edit({ handoffConfig: next })} />}
            </div>

            <div className="card-base p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-ink">Persona AI</h2>
                  <p className="text-sm text-steel mt-1">
                    Sesuaikan nama, gaya bahasa, dan karakter AI.
                  </p>
                </div>
                <button
                  onClick={() => setChatPreviewOpen(true)}
                  className="px-4 py-2 text-xs font-semibold text-brand-blue-deep border border-brand-blue-200 rounded-full hover:bg-brand-blue-50 transition-colors"
                >
                  ✨ Test AI
                </button>
              </div>
              {draft && <PersonaConfig persona={draft.persona} onChange={(patch) => edit({ persona: { ...draft.persona, ...patch } })} />}
            </div>
          </div>
        </TabContent>

        <TabContent value="general">
          <UmumTab />
        </TabContent>

        <TabContent value="account">
          <AkunTab />
        </TabContent>
      </Tabs>

      <ToastContainer />

      {chatPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setChatPreviewOpen(false)} />
          <div className="relative bg-canvas rounded-2xl shadow-xl w-full max-w-md mx-4 border border-hairline overflow-hidden h-[520px] flex flex-col">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-hairline-soft flex-shrink-0">
              <div>
                <h3 className="text-sm font-semibold text-ink">Test AI Chat</h3>
                <p className="text-[10px] text-stone mt-0.5">Simulasi percakapan dengan AI</p>
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
              {draft && <AIChatPreview assistantId={draft.id} personaName={draft.persona.name} />}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
