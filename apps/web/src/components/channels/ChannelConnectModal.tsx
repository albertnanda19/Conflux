import { useState, useEffect } from 'react'
import {
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalTitle, ModalDescription, ModalCloseButton,
} from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { useChannelMutations } from '@/hooks/inbox'
import type { ChannelCardData } from '@/pages/ChannelsPage'

const ENV_TOKEN_PROVIDERS = ['telegram_bot', 'whatsapp_fonnte']

const FIELDS: Record<string, { key: string; label: string; placeholder: string }[]> = {
  whatsapp_cloud: [
    { key: 'phoneNumberId', label: 'Phone Number ID', placeholder: 'mis. 123456789' },
    { key: 'verifyToken', label: 'Verify Token', placeholder: 'token verifikasi webhook' },
  ],
  telegram_bot: [{ key: 'mode', label: 'Mode', placeholder: 'polling / webhook' }],
  whatsapp_fonnte: [{ key: 'mode', label: 'Mode', placeholder: 'webhook' }],
  instagram: [{ key: 'pageId', label: 'Page ID', placeholder: 'ID halaman Instagram' }],
  facebook: [{ key: 'pageId', label: 'Page ID', placeholder: 'ID halaman Facebook' }],
  livechat: [{ key: 'widgetColor', label: 'Warna Widget', placeholder: '#4A7AFF' }],
}

export function ChannelConnectModal({ channel, onClose }: { channel: ChannelCardData | null; onClose: () => void }) {
  const [values, setValues] = useState<Record<string, string>>({})
  const [name, setName] = useState('')
  const { create, update, remove } = useChannelMutations()

  useEffect(() => {
    setValues({})
    setName(channel?.instance?.name ?? channel?.name ?? '')
  }, [channel])

  if (!channel) return null
  const fields = FIELDS[channel.provider] ?? []
  const connected = !!channel.instance
  const usesEnvToken = ENV_TOKEN_PROVIDERS.includes(channel.provider)
  const pending = create.isPending || update.isPending || remove.isPending

  const handleSubmit = () => {
    const credentials = Object.fromEntries(Object.entries(values).filter(([, v]) => v.trim()))
    if (connected) {
      update.mutate({ id: channel.instance!.id, body: { name, credentials } }, { onSuccess: onClose })
    } else {
      create.mutate(
        { name: name || channel.name, type: channel.type, provider: channel.provider, credentials },
        { onSuccess: onClose },
      )
    }
  }

  const handleDelete = () => {
    if (channel.instance) remove.mutate(channel.instance.id, { onSuccess: onClose })
  }

  return (
    <Modal open={!!channel} onOpenChange={(v) => !v && onClose()}>
      <ModalContent className="max-w-md">
        <ModalCloseButton onClick={onClose} />
        <ModalHeader>
          <ModalTitle>{connected ? 'Kelola' : 'Hubungkan'} {channel.name}</ModalTitle>
          <ModalDescription>
            {channel.provider === 'livechat'
              ? 'Sesuaikan tampilan widget chat untuk website.'
              : 'Atur konfigurasi channel untuk inbox.'}
          </ModalDescription>
        </ModalHeader>
        <ModalBody className="space-y-3 py-3">
          <div>
            <label className="block text-xs font-semibold text-ink mb-1.5">Nama Channel</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="mis. WhatsApp Sales"
              className="w-full rounded-lg border border-hairline bg-canvas px-3 py-2.5 text-sm text-ink placeholder:text-stone focus:outline-none focus:border-brand-blue-deep"
            />
          </div>
          {fields.map((f) => (
            <div key={f.key}>
              <label className="block text-xs font-semibold text-ink mb-1.5">{f.label}</label>
              <input
                type="text"
                value={values[f.key] ?? ''}
                onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full rounded-lg border border-hairline bg-canvas px-3 py-2.5 text-sm text-ink placeholder:text-stone focus:outline-none focus:border-brand-blue-deep"
              />
            </div>
          ))}
          {usesEnvToken && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
              <p className="text-[11px] text-amber-700 leading-relaxed">
                🔐 Token API channel ini diatur lewat environment variable server (bukan di sini) demi keamanan.
              </p>
            </div>
          )}
          {channel.provider === 'livechat' && channel.instance && (
            <div className="rounded-lg border border-hairline bg-surface-soft p-3">
              <p className="text-[11px] font-semibold text-steel mb-1.5">Snippet untuk dipasang di website</p>
              <code className="block text-[10px] text-charcoal break-all">{`<script src="https://cdn.conflux.app/widget.js" data-id="${channel.instance.id}"></script>`}</code>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          {connected && (
            <Button variant="tertiary" size="sm" onClick={handleDelete} disabled={pending} className="mr-auto text-red-500">
              Hapus
            </Button>
          )}
          <Button variant="tertiary" size="sm" onClick={onClose} disabled={pending}>Batal</Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} disabled={pending || !name.trim()}>
            {connected ? 'Simpan' : 'Hubungkan'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
