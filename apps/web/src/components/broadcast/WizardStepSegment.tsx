import { SegmentBuilder } from './SegmentBuilder'

interface WizardStepSegmentProps {
  estimatedCount?: number
}

export function WizardStepSegment({ estimatedCount = 2900 }: WizardStepSegmentProps) {
  return (
    <div>
      <SegmentBuilder />

      <div className="mt-4 flex items-center gap-2 px-4 py-3 bg-emerald-50 rounded-xl border border-emerald-200">
        <span className="text-lg">📊</span>
        <div>
          <p className="text-xs font-medium text-emerald-700">
            Estimasi {estimatedCount.toLocaleString('id-ID')} kontak akan menerima pesan
          </p>
          <p className="text-[11px] text-emerald-600">
            Angka ini adalah perkiraan berdasarkan filter yang dipilih
          </p>
        </div>
      </div>
    </div>
  )
}
