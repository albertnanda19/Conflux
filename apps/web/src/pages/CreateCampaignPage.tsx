import { useNavigate } from 'react-router-dom'
import { CampaignWizard } from '@/components/broadcast/CampaignWizard'
import type { CampaignWizardData } from '@/components/broadcast/CampaignWizard'

export function CreateCampaignPage() {
  const navigate = useNavigate()

  function handleFinish(_data: CampaignWizardData) {
    navigate('/campaigns')
  }

  return (
    <div className="p-8 h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-ink mb-2">Buat Campaign Baru</h1>
        <p className="text-steel text-sm">Ikuti langkah-langkah berikut untuk membuat campaign broadcast.</p>
      </div>

      <CampaignWizard onFinish={handleFinish} onCancel={() => navigate('/campaigns')} />
    </div>
  )
}
