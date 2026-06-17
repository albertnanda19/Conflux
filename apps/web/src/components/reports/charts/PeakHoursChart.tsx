import ReactECharts from 'echarts-for-react'
import type { HeatmapCell } from '@/mock/analytics'

interface PeakHoursChartProps {
  data: HeatmapCell[]
}

export function PeakHoursChart({ data }: PeakHoursChartProps) {
  const hourTotals = Array.from({ length: 24 }, (_, h) => ({
    hour: h,
    label: `${h.toString().padStart(2, '0')}:00`,
    count: data.filter((d) => d.hour === h).reduce((s, d) => s + d.count, 0),
  }))
  const top10 = hourTotals.sort((a, b) => b.count - a.count).slice(0, 10).sort((a, b) => a.hour - b.hour)

  const option = {
    tooltip: {
      trigger: 'axis' as const,
      axisPointer: { type: 'shadow' as const },
      backgroundColor: '#fff',
      borderColor: '#E5E5E5',
      borderWidth: 1,
      textStyle: { color: '#1A1A1A', fontSize: 12, fontFamily: 'DM Sans' },
      formatter: (params: Array<{ name: string; value: number }>) => {
        const p = params[0]
        return `<div style="font-size:11px;color:#888">${p.name}</div><div style="font-size:14px;font-weight:600;color:#1A1A1A;margin-top:2px">${p.value.toLocaleString('id-ID')} percakapan</div>`
      },
    },
    grid: { top: 8, right: 16, bottom: 8, left: 52 },
    xAxis: {
      type: 'value' as const,
      splitLine: { lineStyle: { color: '#F0F0F0' } },
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#888', fontSize: 10, fontFamily: 'DM Sans' },
    },
    yAxis: {
      type: 'category' as const,
      data: top10.map((d) => d.label).reverse(),
      axisLine: { lineStyle: { color: '#E5E5E5' } },
      axisTick: { show: false },
      axisLabel: { color: '#333', fontSize: 10, fontFamily: 'DM Sans', fontWeight: 500 },
    },
    series: [
      {
        type: 'bar' as const,
        data: top10.map((d) => d.count).reverse(),
        barWidth: 14,
        itemStyle: {
          borderRadius: [0, 3, 3, 0],
          color: {
            type: 'linear' as const,
            x: 0, y: 0, x2: 1, y2: 0,
            colorStops: [
              { offset: 0, color: '#FF6B5A' },
              { offset: 1, color: '#4A7AFF' },
            ],
          },
        },
      },
    ],
    animation: true,
    animationDuration: 800,
    animationEasing: 'cubicOut' as const,
  }

  return <ReactECharts option={option} style={{ width: '100%', height: 260 }} opts={{ renderer: 'svg' }} />
}
