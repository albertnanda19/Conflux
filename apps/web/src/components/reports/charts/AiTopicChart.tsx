import ReactECharts from 'echarts-for-react'
import type { AiVsHumanStats } from '@/mock/analytics'

interface AiTopicChartProps {
  data: AiVsHumanStats['topAiTopics']
}

export function AiTopicChart({ data }: AiTopicChartProps) {
  const sorted = [...data].sort((a, b) => a.count - b.count)

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
        const item = data.find((d) => d.topic === p.name)
        const sat = item ? item.satisfactionRate.toFixed(1) : '-'
        return `<div style="font-size:11px;color:#888">${p.name}</div><div style="font-size:14px;font-weight:600;color:#1A1A1A;margin-top:2px">${p.value.toLocaleString('id-ID')} percakapan</div><div style="font-size:11px;color:#00D4FF;margin-top:2px">Satisfaction: ${sat}%</div>`
      },
    },
    grid: { top: 8, right: 16, bottom: 8, left: 140 },
    xAxis: {
      type: 'value' as const,
      splitLine: { lineStyle: { color: '#F0F0F0' } },
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#888', fontSize: 10, fontFamily: 'DM Sans' },
    },
    yAxis: {
      type: 'category' as const,
      data: sorted.map((d) => d.topic),
      axisLine: { lineStyle: { color: '#E5E5E5' } },
      axisTick: { show: false },
      axisLabel: { color: '#333', fontSize: 10, fontFamily: 'DM Sans', fontWeight: 500, width: 130, overflow: 'truncate' },
    },
    series: [
      {
        type: 'bar' as const,
        data: sorted.map((d) => d.count),
        barWidth: 14,
        itemStyle: {
          borderRadius: [0, 3, 3, 0],
          color: { type: 'linear' as const, x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: '#00D4FF' }, { offset: 1, color: '#4A7AFF' }] },
        },
      },
    ],
    animation: true,
    animationDuration: 800,
    animationEasing: 'cubicOut' as const,
  }

  return <ReactECharts option={option} style={{ width: '100%', height: 220 }} opts={{ renderer: 'svg' }} />
}
