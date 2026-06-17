import { useState } from 'react'
import { WizardStepBasic, type WizardBasicData } from './WizardStepBasic'
import { WizardStepSegment } from './WizardStepSegment'
import { WizardStepTemplate } from './WizardStepTemplate'
import { WizardStepSchedule } from './WizardStepSchedule'
import { WizardStepReview } from './WizardStepReview'
import { CheckedIcon } from '@/icons'

const STEPS = [
  { key: 'basic', label: 'Detail', number: 1 },
  { key: 'segment', label: 'Segmen', number: 2 },
  { key: 'template', label: 'Template', number: 3 },
  { key: 'schedule', label: 'Jadwal & Review', number: 4 },
]

interface CampaignWizardProps {
  onFinish?: (data: CampaignWizardData) => void
  onCancel?: () => void
}

export interface CampaignWizardData {
  basic: WizardBasicData
  templateId: string | null
  scheduleMode: 'now' | 'scheduled'
  scheduledDate: string
  scheduledTime: string
}

export function CampaignWizard({ onFinish, onCancel }: CampaignWizardProps) {
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [basic, setBasic] = useState<WizardBasicData>({ name: '', description: '', goal: 'promotion' })
  const [templateId, setTemplateId] = useState<string | null>(null)
  const [scheduleMode, setScheduleMode] = useState<'now' | 'scheduled'>('now')
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('09:00')

  const isLastStep = currentStep === STEPS.length - 1
  const isFirstStep = currentStep === 0
  const canGoNext = currentStep < STEPS.length - 1

  function handleNext() {
    if (canGoNext) setCurrentStep((prev) => prev + 1)
  }

  function handlePrev() {
    if (!isFirstStep) setCurrentStep((prev) => prev - 1)
  }

  function handleFinish() {
    onFinish?.({ basic, templateId, scheduleMode, scheduledDate, scheduledTime })
  }

  function renderStep() {
    switch (currentStep) {
      case 0:
        return <WizardStepBasic data={basic} onChange={setBasic} />
      case 1:
        return <WizardStepSegment />
      case 2:
        return <WizardStepTemplate selectedTemplateId={templateId} onSelect={setTemplateId} />
      case 3:
        return (
          <div className="space-y-6">
            <WizardStepSchedule
              scheduleMode={scheduleMode}
              scheduledDate={scheduledDate}
              scheduledTime={scheduledTime}
              onModeChange={setScheduleMode}
              onDateChange={setScheduledDate}
              onTimeChange={setScheduledTime}
            />
            <WizardStepReview
              name={basic.name}
              description={basic.description}
              goal={basic.goal}
              templateName={templateId ? getTemplateNameById(templateId) : null}
              scheduleMode={scheduleMode}
              scheduledDate={scheduledDate}
              scheduledTime={scheduledTime}
              estimatedCount={2900}
            />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-8 px-4">
        {STEPS.map((step, idx) => {
          const isActive = idx === currentStep
          const isCompleted = idx < currentStep
          return (
            <div key={step.key} className="flex items-center flex-1 last:flex-initial">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold border transition-colors ${
                  isActive ? 'bg-ink text-white border-ink'
                    : isCompleted ? 'bg-emerald-500 text-white border-emerald-500'
                      : 'bg-surface text-steel border-hairline'
                }`}>
                  {isCompleted ? <CheckedIcon size={14} /> : step.number}
                </div>
                <span className={`text-xs font-medium ${isActive ? 'text-ink' : 'text-steel'}`}>
                  {step.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-3 ${isCompleted ? 'bg-emerald-400' : 'bg-hairline'}`} />
              )}
            </div>
          )
        })}
      </div>

      <div className="bg-canvas rounded-2xl border border-hairline p-6 mb-6">
        <h3 className="text-sm font-semibold text-ink mb-4">
          {STEPS[currentStep].number}. {STEPS[currentStep].label}
        </h3>
        {renderStep()}
      </div>

      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {isFirstStep && (
            <button
              onClick={onCancel}
              className="px-4 py-2 text-xs font-medium text-steel rounded-full border border-hairline hover:text-ink hover:bg-surface-soft transition-colors"
            >
              Batal
            </button>
          )}
          {!isFirstStep && (
            <button
              onClick={handlePrev}
              className="px-4 py-2 text-xs font-medium text-steel rounded-full border border-hairline hover:text-ink hover:bg-surface-soft transition-colors"
            >
              ← Sebelumnya
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onFinish?.({ basic, templateId, scheduleMode, scheduledDate, scheduledTime })}
            className="px-4 py-2 text-xs font-medium text-ink rounded-full border border-hairline bg-canvas hover:bg-surface-soft transition-colors"
          >
            Simpan Draft
          </button>
          {isLastStep ? (
            <button
              onClick={handleFinish}
              className="px-4 py-2 text-xs font-medium text-white rounded-full bg-ink hover:bg-ink/90 transition-colors"
            >
              {scheduleMode === 'now' ? '🚀 Kirim Sekarang' : '⏰ Jadwalkan'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-4 py-2 text-xs font-medium text-white rounded-full bg-ink hover:bg-ink/90 transition-colors"
            >
              Selanjutnya →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function getTemplateNameById(id: string): string | null {
  const names: Record<string, string> = {
    t1: 'Sapaan Program', t2: 'Promo Harga', t3: 'Undangan Webinar',
    t4: 'Follow Up H+3', t5: 'Reminder Jadwal', t6: 'Closing Daftar',
  }
  return names[id] ?? null
}
