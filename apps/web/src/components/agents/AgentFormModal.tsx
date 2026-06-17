import { useState, useEffect, useMemo } from 'react'
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalBody, ModalFooter, ModalCloseButton } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { AgentProfile, AgentRole } from '@/mock/agents'
import { getAgents } from '@/mock/agents'
import { AgentAvatar } from './AgentAvatar'

interface AgentFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingAgent: AgentProfile | null
  onSave: (data: AgentFormValues) => void
}

interface AgentFormValues {
  name: string
  email: string
  phone: string
  role: AgentRole
  team: string
  timezone: string
  maxConversations: number
  status: AgentProfile['status']
}

interface FormErrors {
  name?: string
  email?: string
  maxConversations?: string
}

const INPUT_CLASS = 'w-full rounded-lg border border-hairline bg-canvas px-3 py-2.5 text-sm text-ink placeholder:text-stone focus:outline-none focus:border-brand-blue-deep transition-colors'
const INPUT_ERROR_CLASS = 'border-red-400 focus:border-red-500'

const DEFAULTS: AgentFormValues = {
  name: '',
  email: '',
  phone: '',
  role: 'agent',
  team: '',
  timezone: 'WIB (UTC+7)',
  maxConversations: 10,
  status: 'offline',
}

export function AgentFormModal({ open, onOpenChange, editingAgent, onSave }: AgentFormModalProps) {
  const [form, setForm] = useState<AgentFormValues>(DEFAULTS)
  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    if (editingAgent) {
      setForm({
        name: editingAgent.name,
        email: editingAgent.email,
        phone: editingAgent.phone ?? '',
        role: editingAgent.role,
        team: editingAgent.team ?? '',
        timezone: editingAgent.timezone,
        maxConversations: editingAgent.maxConversations,
        status: editingAgent.status,
      })
    } else {
      setForm(DEFAULTS)
    }
    setErrors({})
  }, [editingAgent, open])

  const initials = useMemo(() => {
    const words = form.name.trim().split(/\s+/)
    if (words.length >= 2) return (words[0][0] + words[words.length - 1][0]).toUpperCase()
    if (form.name.length >= 2) return form.name.slice(0, 2).toUpperCase()
    return '?'
  }, [form.name])

  const validate = (): boolean => {
    const errs: FormErrors = {}
    if (!form.name.trim() || form.name.trim().length < 2) errs.name = 'Nama minimal 2 karakter'
    if (!form.email.trim()) errs.email = 'Email wajib diisi'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Format email tidak valid'
    else if (!editingAgent) {
      const exists = getAgents().some((a) => a.email.toLowerCase() === form.email.toLowerCase())
      if (exists) errs.email = 'Email sudah digunakan'
    }
    if (form.maxConversations < 1 || form.maxConversations > 50) errs.maxConversations = 'Batas 1–50 percakapan'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    onSave(form)
    onOpenChange(false)
  }

  const setField = <K extends keyof AgentFormValues>(key: K, value: AgentFormValues[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key as keyof FormErrors]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-w-lg">
        <ModalCloseButton />
        <ModalHeader>
          <ModalTitle>{editingAgent ? 'Edit Agent' : 'Tambah Agent'}</ModalTitle>
        </ModalHeader>

        <ModalBody>
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <AgentAvatar initials={initials} status={form.status} size="lg" colorIndex={0} />
              <div>
                <p className="text-sm font-medium text-ink">{form.name || 'Nama Agent'}</p>
                <p className="text-xs text-steel">{form.email || 'email@contoh.com'}</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">Nama Lengkap</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
                placeholder="Masukkan nama lengkap..."
                className={cn(INPUT_CLASS, errors.name && INPUT_ERROR_CLASS)}
              />
              {errors.name && <p className="text-[11px] text-red-500 mt-1 animate-fade-in">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setField('email', e.target.value)}
                placeholder="agent@contoh.com"
                className={cn(INPUT_CLASS, errors.email && INPUT_ERROR_CLASS)}
              />
              {errors.email && <p className="text-[11px] text-red-500 mt-1 animate-fade-in">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">Nomor Telepon <span className="text-steel font-normal">(opsional)</span></label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setField('phone', e.target.value)}
                placeholder="08xxxxxxxxxx"
                className={INPUT_CLASS}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setField('role', e.target.value as AgentRole)}
                  className={cn(INPUT_CLASS, 'appearance-none cursor-pointer')}
                >
                  <option value="agent">Agent</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">Tim <span className="text-steel font-normal">(opsional)</span></label>
                <select
                  value={form.team}
                  onChange={(e) => setField('team', e.target.value)}
                  className={cn(INPUT_CLASS, 'appearance-none cursor-pointer')}
                >
                  <option value="">Pilih tim</option>
                  <option value="Sales">Sales</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Support">Support</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">Timezone</label>
                <select
                  value={form.timezone}
                  onChange={(e) => setField('timezone', e.target.value)}
                  className={cn(INPUT_CLASS, 'appearance-none cursor-pointer')}
                >
                  <option value="WIB (UTC+7)">WIB (UTC+7)</option>
                  <option value="WITA (UTC+8)">WITA (UTC+8)</option>
                  <option value="WIT (UTC+9)">WIT (UTC+9)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">Batas Percakapan</label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={form.maxConversations}
                  onChange={(e) => setField('maxConversations', parseInt(e.target.value) || 1)}
                  className={cn(INPUT_CLASS, errors.maxConversations && INPUT_ERROR_CLASS)}
                />
                {errors.maxConversations && <p className="text-[11px] text-red-500 mt-1 animate-fade-in">{errors.maxConversations}</p>}
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>Batal</Button>
          <Button onClick={handleSave}>{editingAgent ? 'Simpan' : 'Tambah Agent'}</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
