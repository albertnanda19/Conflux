import { useState, useCallback } from 'react'
import { useAISettingsStore } from '@/stores/ai-settings'

export function HandoffConfig() {
  const {
    handoffConfig,
    addKeyword,
    removeKeyword,
    toggleConversionSignal,
    updateHandoffConfig,
  } = useAISettingsStore()
  const [keywordInput, setKeywordInput] = useState('')

  const handleAddKeyword = useCallback(() => {
    const val = keywordInput.trim()
    if (val && !handoffConfig.triggerKeywords.includes(val)) {
      addKeyword(val)
      setKeywordInput('')
    }
  }, [keywordInput, handoffConfig.triggerKeywords, addKeyword])

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-ink">Trigger Keywords</h3>
        <p className="text-xs text-stone">
          Ketika pesan pelanggan mengandung kata-kata ini, AI akan segera melakukan handoff ke agent.
        </p>
        <div className="flex flex-wrap gap-2">
          {handoffConfig.triggerKeywords.map((kw) => (
            <span
              key={kw}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-ink bg-surface-soft border border-hairline-soft rounded-full"
            >
              {kw}
              <button
                onClick={() => removeKeyword(kw)}
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
        <p className="text-xs text-stone">
          AI akan otomatis mendeteksi sinyal ini dan meningkatkan prioritas handoff.
        </p>
        <div className="space-y-2">
          {handoffConfig.conversionSignals.map((cs) => (
            <div
              key={cs.id}
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-canvas border border-hairline-soft"
            >
              <div className="min-w-0 mr-4">
                <p className="text-sm text-ink">{cs.description}</p>
                <span className="text-[10px] text-stone uppercase font-medium tracking-wide">
                  {cs.type}
                </span>
              </div>
              <button
                onClick={() => toggleConversionSignal(cs.id)}
                className={`relative w-10 h-6 rounded-full transition-colors flex-shrink-0 ${
                  cs.enabled ? 'bg-emerald-500' : 'bg-hairline'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                    cs.enabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-ink">Pesan Handoff</h3>
        <p className="text-xs text-stone">
          Pesan yang dikirim ke pelanggan saat AI melakukan handoff ke agent manusia.
        </p>
        <textarea
          value={handoffConfig.handoffMessage}
          onChange={(e) => updateHandoffConfig({ handoffMessage: e.target.value })}
          rows={3}
          className="w-full text-sm text-ink bg-canvas border border-hairline-soft rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-brand-blue-deep focus:ring-offset-1"
        />
      </div>

      <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-canvas border border-hairline-soft">
        <div>
          <p className="text-sm font-medium text-ink">Batas Pesan AI Sebelum Handoff</p>
          <p className="text-xs text-stone mt-0.5">
            Setelah {handoffConfig.maxAiMessages} pesan tanpa resolusi, AI akan melakukan handoff otomatis.
          </p>
        </div>
        <input
          type="number"
          min={1}
          max={50}
          value={handoffConfig.maxAiMessages}
          onChange={(e) => updateHandoffConfig({ maxAiMessages: Math.max(1, Number(e.target.value)) })}
          className="w-16 text-center text-sm font-medium text-ink bg-canvas border border-hairline-soft rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-blue-deep focus:ring-offset-1"
        />
      </div>

      <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-canvas border border-hairline-soft">
        <div>
          <p className="text-sm font-medium text-ink">Notifikasi Prioritas</p>
          <p className="text-xs text-stone mt-0.5">
            Kirim notifikasi prioritas ke agent saat handoff terjadi.
          </p>
        </div>
        <button
          onClick={() => updateHandoffConfig({ priorityNotification: !handoffConfig.priorityNotification })}
          className={`relative w-10 h-6 rounded-full transition-colors flex-shrink-0 ${
            handoffConfig.priorityNotification ? 'bg-emerald-500' : 'bg-hairline'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
              handoffConfig.priorityNotification ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </div>
  )
}
