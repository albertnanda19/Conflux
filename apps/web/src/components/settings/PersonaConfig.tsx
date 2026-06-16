import { useAISettingsStore } from '@/stores/ai-settings'

const TONE_OPTIONS = [
  { value: 'formal', label: 'Formal', desc: 'Bahasa baku, sopan, profesional' },
  { value: 'semi-formal', label: 'Semi-Formal', desc: 'Ramah namun tetap profesional' },
  { value: 'casual', label: 'Casual', desc: 'Santai, friendly, kekinian' },
] as const

export function PersonaConfig() {
  const { persona, updatePersona } = useAISettingsStore()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink">Nama AI</label>
          <input
            type="text"
            value={persona.name}
            onChange={(e) => updatePersona({ name: e.target.value })}
            className="w-full text-sm text-ink bg-canvas border border-hairline-soft rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-blue-deep focus:ring-offset-1"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink">Bahasa</label>
          <select
            value={persona.language}
            onChange={(e) => updatePersona({ language: e.target.value })}
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
          {TONE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updatePersona({ tone: opt.value })}
              className={`px-4 py-3 rounded-xl text-left transition-colors ${
                persona.tone === opt.value
                  ? 'bg-brand-blue-deep text-white'
                  : 'bg-canvas border border-hairline-soft hover:border-brand-blue-200'
              }`}
            >
              <span className={`text-sm font-semibold ${persona.tone === opt.value ? 'text-white' : 'text-ink'}`}>
                {opt.label}
              </span>
              <p className={`text-xs mt-0.5 ${persona.tone === opt.value ? 'text-white/70' : 'text-steel'}`}>
                {opt.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-ink">System Prompt</label>
        <p className="text-xs text-stone">
          Instruksi yang menentukan perilaku AI saat menjawab pertanyaan pelanggan.
        </p>
        <textarea
          value={persona.systemPrompt}
          onChange={(e) => updatePersona({ systemPrompt: e.target.value })}
          rows={5}
          className="w-full text-sm text-ink bg-canvas border border-hairline-soft rounded-xl px-4 py-3 resize-none font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-blue-deep focus:ring-offset-1"
        />
      </div>
    </div>
  )
}
