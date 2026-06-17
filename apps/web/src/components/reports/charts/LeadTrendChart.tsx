import ReactECharts from 'echarts-for-react'
import type { ConversationTrendDay } from '@/mock/analytics'

interface LeadTrendChartProps {
  data: ConversationTrendDay[]
}

export function LeadTrendChart({ data }: LeadTrendChartProps) {
  const option = {
    tooltip: {
      trigger: 'axis' as const,
      backgroundColor: '#fff',
      borderColor: '#E5E5E5',
      borderWidth: 1,
      textStyle: { color: '#1A1A1A', fontSize: 12, fontFamily: 'DM Sans' },
      formatter: (params: Array<{ name: string; value: number }>) => {
        const p = params[0]
        return `<div style="font-size:12px;color:#888">${p.name}</div><div style="font-size:14px;font-weight:600;color:#1A1A1A;margin-top:2px">${p.value} percakapan</div>`
      },
    },
    grid: { top: 12, right: 12, bottom: 28, left: 40 },
    xAxis: {
      type: 'category' as const,
      data: data.map((d) => d.label),
      axisLine: { lineStyle: { color: '#E5E5E5' } },
      axisTick: { show: false },
      axisLabel: { color: '#888', fontSize: 10, fontFamily: 'DM Sans', interval: Math.floor(data.length / 6) },
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
        type: 'line' as const,
        data: data.map((d) => d.count),
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
      },
    ],
    animation: true,
    animationDuration: 800,
    animationEasing: 'cubicOut' as const,
  }

  return <ReactECharts option={option} style={{ width: '100%', height: 220 }} opts={{ renderer: 'svg' }} />
}
