import { useState, useEffect, useCallback } from 'react'
import type { AIAssistant } from '@/mock/ai-assistants'

const TONE_OPTIONS = [
  { value: 'formal', label: 'Formal', desc: 'Bahasa baku, sopan, profesional' },
  { value: 'semi-formal', label: 'Semi-Formal', desc: 'Ramah namun tetap profesional' },
  { value: 'casual', label: 'Casual', desc: 'Santai, friendly, kekinian' },
] as const

const AVATAR_OPTIONS = ['🤖', '🧠', '💬', '🛠️', '📣', '⚡', '🎯', '💼', '🌟', '🔮', '🧑‍💻', '🎨']

interface AIAssistantFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingAssistant: AIAssistant | null
  onSave: (data: {
    name: string
    description: string
    avatar: string
    persona: { name: string; language: string; tone: 'formal' | 'semi-formal' | 'casual'; systemPrompt: string }
  }) => void
}

export function AIAssistantFormModal({ open, onOpenChange, editingAssistant, onSave }: AIAssistantFormModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [avatar, setAvatar] = useState('🤖')
  const [personaName, setPersonaName] = useState('')
  const [personaLanguage, setPersonaLanguage] = useState('Bahasa Indonesia')
  const [personaTone, setPersonaTone] = useState<'formal' | 'semi-formal' | 'casual'>('semi-formal')
  const [personaSystemPrompt, setPersonaSystemPrompt] = useState('')

  useEffect(() => {
    if (editingAssistant) {
      setName(editingAssistant.name)
      setDescription(editingAssistant.description)
      setAvatar(editingAssistant.avatar)
      setPersonaName(editingAssistant.persona.name)
      setPersonaLanguage(editingAssistant.persona.language)
      setPersonaTone(editingAssistant.persona.tone)
      setPersonaSystemPrompt(editingAssistant.persona.systemPrompt)
    } else {
      setName('')
      setDescription('')
      setAvatar('🤖')
      setPersonaName('')
      setPersonaLanguage('Bahasa Indonesia')
      setPersonaTone('semi-formal')
      setPersonaSystemPrompt('')
    }
  }, [editingAssistant, open])

  const handleSubmit = useCallback(() => {
    if (!name.trim()) return
    onSave({
      name: name.trim(),
      description: description.trim(),
      avatar,
      persona: {
        name: personaName.trim() || name.trim(),
        language: personaLanguage,
        tone: personaTone,
        systemPrompt: personaSystemPrompt,
      },
    })
    onOpenChange(false)
  }, [name, description, avatar, personaName, personaLanguage, personaTone, personaSystemPrompt, onSave, onOpenChange])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
      <div className="relative bg-canvas rounded-2xl shadow-xl w-full max-w-lg mx-4 border border-hairline overflow-hidden animate-in zoom-in-95 fade-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-hairline-soft">
          <h2 className="text-base font-semibold text-ink">
            {editingAssistant ? 'Edit AI Assistant' : 'Buat AI Assistant Baru'}
          </h2>
          <button
            onClick={() => onOpenChange(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-stone hover:text-ink hover:bg-surface-soft transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink">Avatar</label>
            <div className="flex flex-wrap gap-2">
              {AVATAR_OPTIONS.map((em) => (
                <button
                  key={em}
                  onClick={() => setAvatar(em)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${
                    avatar === em
                      ? 'bg-brand-blue-100 ring-2 ring-brand-blue-deep scale-110'
                      : 'bg-surface-soft hover:bg-surface'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Nama AI Assistant</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Sales Bot"
                className="w-full text-sm text-ink bg-canvas border border-hairline-soft rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-blue-deep focus:ring-offset-1 placeholder:text-stone"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Nama Persona</label>
              <input
                type="text"
                value={personaName}
                onChange={(e) => setPersonaName(e.target.value)}
                placeholder="Nama yang digunakan AI"
                className="w-full text-sm text-ink bg-canvas border border-hairline-soft rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-blue-deep focus:ring-offset-1 placeholder:text-stone"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-ink">Deskripsi</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ceritakan fungsi AI Assistant ini..."
              className="w-full text-sm text-ink bg-canvas border border-hairline-soft rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-blue-deep focus:ring-offset-1 placeholder:text-stone"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-ink">Bahasa</label>
            <select
              value={personaLanguage}
              onChange={(e) => setPersonaLanguage(e.target.value)}
              className="w-full text-sm text-ink bg-canvas border border-hairline-soft rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-blue-deep focus:ring-offset-1"
            >
              <option value="Bahasa Indonesia">Bahasa Indonesia</option>
              <option value="English">English</option>
              <option value="Bahasa Indonesia & English">Bilingual (ID + EN)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-ink">Gaya Bahasa</label>
            <div className="grid grid-cols-3 gap-2">
              {TONE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setPersonaTone(opt.value)}
                  className={`px-3 py-2.5 rounded-xl text-left transition-all ${
                    personaTone === opt.value
                      ? 'bg-brand-blue-deep text-white shadow-md'
                      : 'bg-canvas border border-hairline-soft hover:border-brand-blue-200'
                  }`}
                >
                  <span className={`text-xs font-semibold ${personaTone === opt.value ? 'text-white' : 'text-ink'}`}>
                    {opt.label}
                  </span>
                  <p className={`text-[10px] mt-0.5 leading-tight ${personaTone === opt.value ? 'text-white/70' : 'text-steel'}`}>
                    {opt.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-ink">System Prompt</label>
            <p className="text-xs text-stone">Instruksi yang menentukan perilaku AI saat menjawab pertanyaan pelanggan.</p>
            <textarea
              value={personaSystemPrompt}
              onChange={(e) => setPersonaSystemPrompt(e.target.value)}
              rows={4}
              placeholder="Anda adalah asisten virtual yang membantu..."
              className="w-full text-sm text-ink bg-canvas border border-hairline-soft rounded-xl px-4 py-3 resize-none font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-blue-deep focus:ring-offset-1 placeholder:text-stone"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-hairline-soft bg-surface-soft/30">
          <button
            onClick={() => onOpenChange(false)}
            className="h-9 px-4 text-sm font-medium text-steel hover:text-ink rounded-full hover:bg-surface transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="h-9 px-5 text-sm font-semibold text-white bg-brand-blue-deep rounded-full hover:bg-brand-blue-700 transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            {editingAssistant ? 'Simpan Perubahan' : 'Buat AI Assistant'}
          </button>
        </div>
      </div>
    </div>
  )
}
