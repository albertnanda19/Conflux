import ReactECharts from 'echarts-for-react'
import type { HeatmapCell } from '@/mock/analytics'
import { DAY_LABELS } from '@/mock/analytics'

interface HeatmapChartProps {
  data: HeatmapCell[]
}

const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`)

export function HeatmapChart({ data }: HeatmapChartProps) {
  const maxCount = Math.max(...data.map((d) => d.count))
  const heatData = data.map((d) => [d.hour, d.day, d.count])

  const option = {
    tooltip: {
      position: 'top' as const,
      backgroundColor: '#fff',
      borderColor: '#E5E5E5',
      borderWidth: 1,
      textStyle: { color: '#1A1A1A', fontSize: 12, fontFamily: 'DM Sans' },
      formatter: (params: { value: number[] }) => {
        const [hour, day, count] = params.value
        return `<div style="font-size:11px;color:#888">${DAY_LABELS[day]}, ${hours[hour]}</div><div style="font-size:14px;font-weight:600;color:#1A1A1A;margin-top:2px">${count} percakapan</div>`
      },
    },
    grid: { top: 8, right: 12, bottom: 32, left: 48 },
    xAxis: {
      type: 'category' as const,
      data: hours,
      splitArea: { show: false },
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#888', fontSize: 9, fontFamily: 'DM Sans', interval: 3 },
    },
    yAxis: {
      type: 'category' as const,
      data: DAY_LABELS,
      splitArea: { show: false },
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#333', fontSize: 10, fontFamily: 'DM Sans', fontWeight: 500 },
    },
    visualMap: {
      min: 0,
      max: maxCount,
      show: false,
      inRange: {
        color: ['#F0F4FF', '#C5D5FF', '#8AAFFF', '#4A7AFF', '#2A5ADF'],
      },
    },
    series: [
      {
        type: 'heatmap' as const,
        data: heatData,
        label: { show: false, color: '#333', fontSize: 9, fontFamily: 'DM Sans' },
        emphasis: {
          itemStyle: { borderColor: '#4A7AFF', borderWidth: 1 },
        },
        itemStyle: { borderRadius: 2, borderColor: '#fff', borderWidth: 1 },
      },
    ],
    animation: true,
    animationDuration: 600,
  }

  return <ReactECharts option={option} style={{ width: '100%', height: 260 }} opts={{ renderer: 'svg' }} />
}
