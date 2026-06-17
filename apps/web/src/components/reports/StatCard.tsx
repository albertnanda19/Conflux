import { AnimatedNumber } from './AnimatedNumber'

interface StatCardProps {
  label: string
  value: number
  change?: number
  icon: string
  color: string
  bgColor: string
  decimals?: number
  prefix?: string
  suffix?: string
}

export function StatCard({ label, value, change, icon, color, bgColor, decimals, prefix, suffix }: StatCardProps) {
  return (
    <div className="bg-canvas rounded-xl border border-hairline p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <span className={`w-9 h-9 rounded-lg ${bgColor} flex items-center justify-center text-base`}>
          {icon}
        </span>
        {change !== undefined && change !== 0 && (
          <span className={`text-[11px] font-semibold ${change > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {change > 0 ? '↑' : '↓'} {Math.abs(change).toFixed(1)}%
          </span>
        )}
      </div>
      <AnimatedNumber
        value={value}
        decimals={decimals}
        prefix={prefix}
        suffix={suffix}
        className={`text-2xl font-bold ${color}`}
      />
      <p className="text-[11px] text-steel mt-1">{label}</p>
    </div>
  )
}
