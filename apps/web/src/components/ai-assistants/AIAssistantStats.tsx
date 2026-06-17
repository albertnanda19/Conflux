import { useEffect, useState } from 'react'

interface StatItem {
  label: string
  value: number
  color: string
}

function AnimatedCounter({ target, duration = 800 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (target === 0) { setCount(0); return }
    let start = 0
    const step = Math.ceil(target / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else { setCount(start) }
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration])

  return <span>{count}</span>
}

export function AIAssistantStats({ stats }: { stats: StatItem[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((s, i) => (
        <div
          key={s.label}
          className="card-base p-5 flex items-center gap-4 animate-fade-in"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg flex-shrink-0 ${s.color}`}>
            <AnimatedCounter target={s.value} />
          </div>
          <div>
            <p className="text-2xl font-bold text-ink leading-none">
              <AnimatedCounter target={s.value} />
            </p>
            <p className="text-xs text-steel mt-1">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
