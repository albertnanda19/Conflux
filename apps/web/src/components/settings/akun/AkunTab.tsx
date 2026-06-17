import { useState } from 'react'
import { SettingsLayout } from '@/components/settings/SettingsLayout'
import { SettingsPillTabs } from '@/components/settings/SettingsPillTabs'
import { MyProfile } from './MyProfile'
import { Security } from './Security'
import { AkunNotifications } from './Notifications'

const AKUN_TABS = [
  { id: 'profile', label: 'Profil Saya' },
  { id: 'security', label: 'Keamanan' },
  { id: 'notifications', label: 'Notifikasi' },
]

const TAB_META: Record<string, { subtitle: string }> = {
  profile: { subtitle: 'Kelola informasi profil dan data diri Anda.' },
  security: { subtitle: 'Ubah kata sandi, kelola sesi aktif, dan riwayat login.' },
  notifications: { subtitle: 'Atur preferensi notifikasi personal Anda.' },
}

export function AkunTab() {
  const [activeTab, setActiveTab] = useState('profile')
  const meta = TAB_META[activeTab]

  return (
    <SettingsLayout title="Akun" subtitle={meta.subtitle}>
      <SettingsPillTabs tabs={AKUN_TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'profile' && <MyProfile />}
      {activeTab === 'security' && <Security />}
      {activeTab === 'notifications' && <AkunNotifications />}
    </SettingsLayout>
  )
}
