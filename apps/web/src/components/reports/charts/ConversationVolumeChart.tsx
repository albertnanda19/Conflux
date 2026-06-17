import ReactECharts from 'echarts-for-react'
import type { ConversationTrendDay } from '@/mock/analytics'

interface ConversationVolumeChartProps {
  data: ConversationTrendDay[]
}

export function ConversationVolumeChart({ data }: ConversationVolumeChartProps) {
  const labels = data.map((d) => d.label)
  const values = data.map((d) => d.count)

  const windowSize = 7
  const movingAvg = values.map((_, i) => {
    if (i < windowSize - 1) return null
    const slice = values.slice(i - windowSize + 1, i + 1)
    return Math.round(slice.reduce((a, b) => a + b, 0) / windowSize)
  })

  const option = {
    tooltip: {
      trigger: 'axis' as const,
      backgroundColor: '#fff',
      borderColor: '#E5E5E5',
      borderWidth: 1,
      textStyle: { color: '#1A1A1A', fontSize: 12, fontFamily: 'DM Sans' },
      formatter: (params: Array<{ seriesName: string; value: number | null; name: string }>) => {
        const vol = params.find((p) => p.seriesName === 'Volume')
        const avg = params.find((p) => p.seriesName === 'Rata-rata 7 Hari')
        let html = `<div style="font-size:12px;color:#888">${vol?.name ?? ''}</div>`
        if (vol) html += `<div style="font-size:14px;font-weight:600;color:#1A1A1A;margin-top:2px">${vol.value} percakapan</div>`
        if (avg?.value != null) html += `<div style="font-size:11px;color:#10B981;margin-top:2px">Rata-rata: ${avg.value}</div>`
        return html
      },
    },
    legend: {
      bottom: 0,
      itemWidth: 8,
      itemHeight: 8,
      itemGap: 16,
      textStyle: { color: '#888', fontSize: 11, fontFamily: 'DM Sans' },
      icon: 'circle',
    },
    grid: { top: 16, right: 12, bottom: 40, left: 40 },
    xAxis: {
      type: 'category' as const,
      data: labels,
      boundaryGap: false,
      axisLine: { lineStyle: { color: '#E5E5E5' } },
      axisTick: { show: false },
      axisLabel: { color: '#888', fontSize: 10, fontFamily: 'DM Sans', interval: Math.floor(labels.length / 6) },
    },
    yAxis: {
      type: 'value' as const,
      splitLine: { lineStyle: { color: '#F0F0F0' } },
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#888', fontSize: 10, fontFamily: 'DM Sans' },
    },
    series: [
      {
        name: 'Volume',
        type: 'line' as const,
        smooth: true,
        symbol: 'none',
        lineStyle: { color: '#4A7AFF', width: 2.5 },
        areaStyle: {
          color: {
            type: 'linear' as const,
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(74,122,255,0.15)' },
              { offset: 1, color: 'rgba(74,122,255,0.01)' },
            ],
          },
        },
        data: values,
      },
      {
        name: 'Rata-rata 7 Hari',
        type: 'line' as const,
        smooth: true,
        symbol: 'none',
        lineStyle: { color: '#10B981', width: 1.5, type: 'dashed' as const },
        data: movingAvg,
      },
    ],
    animation: true,
    animationDuration: 800,
    animationEasing: 'cubicOut' as const,
  }

  return <ReactECharts option={option} style={{ width: '100%', height: 260 }} opts={{ renderer: 'svg' }} />
}
