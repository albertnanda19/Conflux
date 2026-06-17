import { useState } from 'react'
import { useGeneralSettingsStore } from '@/stores/general-settings'
import { FormField } from '@/components/settings/FormField'
import { ImageUpload } from '@/components/settings/ImageUpload'
import { INDUSTRY_OPTIONS } from '@/mock/general-settings'

export function OrganizationInfo() {
  const { organization, updateOrganization, saveAll } = useGeneralSettingsStore()
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!organization.name.trim()) e.name = 'Nama organisasi wajib diisi.'
    if (organization.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(organization.email))
      e.email = 'Format email tidak valid.'
    if (organization.website && !/^https?:\/\/.+\..+/.test(organization.website))
      e.website = 'Format URL tidak valid (contoh: https://example.com).'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = () => {
    if (validate()) {
      saveAll()
    }
  }

  return (
    <div className="space-y-5">
      <FormField label="Nama Organisasi" required error={errors.name}>
        <input
          type="text"
          value={organization.name}
          onChange={(e) => updateOrganization({ name: e.target.value })}
          className="w-full text-sm text-ink bg-canvas border border-hairline-soft rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-blue-deep focus:ring-offset-1"
          placeholder="Masukkan nama organisasi"
        />
      </FormField>

      <FormField label="Logo Organisasi" hint="Format: PNG, JPG, SVG. Maks 2MB.">
        <ImageUpload
          currentUrl={organization.logoUrl}
          onUpload={(url) => updateOrganization({ logoUrl: url })}
          onRemove={() => updateOrganization({ logoUrl: null })}
        />
      </FormField>

      <FormField label="Alamat">
        <textarea
          value={organization.address}
          onChange={(e) => updateOrganization({ address: e.target.value })}
          rows={3}
          className="w-full text-sm text-ink bg-canvas border border-hairline-soft rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-brand-blue-deep focus:ring-offset-1"
          placeholder="Alamat lengkap organisasi"
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Telepon" error={errors.phone}>
          <input
            type="tel"
            value={organization.phone}
            onChange={(e) => updateOrganization({ phone: e.target.value })}
            className="w-full text-sm text-ink bg-canvas border border-hairline-soft rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-blue-deep focus:ring-offset-1"
            placeholder="+62 812 3456 7890"
          />
        </FormField>
        <FormField label="Website" error={errors.website}>
          <input
            type="url"
            value={organization.website}
            onChange={(e) => updateOrganization({ website: e.target.value })}
            className="w-full text-sm text-ink bg-canvas border border-hairline-soft rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-blue-deep focus:ring-offset-1"
            placeholder="https://example.com"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Email" error={errors.email}>
          <input
            type="email"
            value={organization.email}
            onChange={(e) => updateOrganization({ email: e.target.value })}
            className="w-full text-sm text-ink bg-canvas border border-hairline-soft rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-blue-deep focus:ring-offset-1"
            placeholder="info@example.com"
          />
        </FormField>
        <FormField label="Industri">
          <select
            value={organization.industry}
            onChange={(e) => updateOrganization({ industry: e.target.value })}
            className="w-full text-sm text-ink bg-canvas border border-hairline-soft rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-blue-deep focus:ring-offset-1"
          >
            {INDUSTRY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </FormField>
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          className="px-6 py-2 text-sm font-semibold text-white bg-brand-blue-deep rounded-full hover:bg-brand-blue transition-colors"
        >
          Simpan Perubahan
        </button>
      </div>
    </div>
  )
}
