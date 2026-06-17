import { useState } from 'react'
import { SettingsLayout } from '@/components/settings/SettingsLayout'
import { SettingsPillTabs } from '@/components/settings/SettingsPillTabs'
import { CompanyProfile } from './CompanyProfile'
import { LocationTimezone } from './LocationTimezone'
import { Appearance } from './Appearance'

const UMUM_TABS = [
  { id: 'company', label: 'Profil Perusahaan' },
  { id: 'location', label: 'Lokasi & Zona Waktu' },
  { id: 'appearance', label: 'Tampilan' },
]

const TAB_META: Record<string, { subtitle: string }> = {
  company: { subtitle: 'Data dasar mengenai organisasi Anda.' },
  location: { subtitle: 'Pengaturan regional dan format tampilan.' },
  appearance: { subtitle: 'Sesuaikan tampilan dan tema platform.' },
}

export function UmumTab() {
  const [activeTab, setActiveTab] = useState('company')
  const meta = TAB_META[activeTab]

  return (
    <SettingsLayout title="Umum" subtitle={meta.subtitle}>
      <SettingsPillTabs tabs={UMUM_TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'company' && <CompanyProfile />}
      {activeTab === 'location' && <LocationTimezone />}
      {activeTab === 'appearance' && <Appearance />}
    </SettingsLayout>
  )
}
