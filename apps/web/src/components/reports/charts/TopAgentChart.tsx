import ReactECharts from 'echarts-for-react'
import type { AgentPerformance } from '@/mock/analytics'

interface TopAgentChartProps {
  data: AgentPerformance[]
}

export function TopAgentChart({ data }: TopAgentChartProps) {
  const sorted = [...data].sort((a, b) => b.conversationsHandled - a.conversationsHandled).slice(0, 6)
  const names = sorted.map((d) => d.name).reverse()
  const values = sorted.map((d) => d.conversationsHandled).reverse()

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
        return `<div style="font-size:12px;color:#888">${p.name}</div><div style="font-size:14px;font-weight:600;color:#1A1A1A;margin-top:2px">${p.value} percakapan</div>`
      },
    },
    grid: { top: 8, right: 16, bottom: 8, left: 110 },
    xAxis: {
      type: 'value' as const,
      splitLine: { lineStyle: { color: '#F0F0F0' } },
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#888', fontSize: 10, fontFamily: 'DM Sans' },
    },
    yAxis: {
      type: 'category' as const,
      data: names,
      axisLine: { lineStyle: { color: '#E5E5E5' } },
      axisTick: { show: false },
      axisLabel: { color: '#333', fontSize: 11, fontFamily: 'DM Sans', fontWeight: 500 },
    },
    series: [
      {
        type: 'bar' as const,
        data: values,
        barWidth: 16,
        itemStyle: {
          borderRadius: [0, 4, 4, 0],
          color: {
            type: 'linear' as const,
            x: 0, y: 0, x2: 1, y2: 0,
            colorStops: [
              { offset: 0, color: 'rgba(74,122,255,0.6)' },
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

  return <ReactECharts option={option} style={{ width: '100%', height: 220 }} opts={{ renderer: 'svg' }} />
}
