import ReactECharts from 'echarts-for-react'
import type { LeadSourceChannel } from '@/mock/analytics'
import { CHANNEL_CHART_COLORS } from '@/mock/analytics'

interface SourceBreakdownChartProps {
  data: LeadSourceChannel[]
}

export function SourceBreakdownChart({ data }: SourceBreakdownChartProps) {
  const sorted = [...data].sort((a, b) => b.count - a.count)
  const channels = sorted.map((d) => d.channel)

  const option = {
    tooltip: {
      trigger: 'axis' as const,
      axisPointer: { type: 'shadow' as const },
      backgroundColor: '#fff',
      borderColor: '#E5E5E5',
      borderWidth: 1,
      textStyle: { color: '#1A1A1A', fontSize: 12, fontFamily: 'DM Sans' },
    },
    legend: {
      bottom: 0,
      itemWidth: 8,
      itemHeight: 8,
      itemGap: 16,
      textStyle: { color: '#888', fontSize: 11, fontFamily: 'DM Sans' },
      icon: 'circle',
    },
    grid: { top: 16, right: 16, bottom: 40, left: 90 },
    xAxis: {
      type: 'value' as const,
      splitLine: { lineStyle: { color: '#F0F0F0' } },
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#888', fontSize: 10, fontFamily: 'DM Sans' },
    },
    yAxis: {
      type: 'category' as const,
      data: channels,
      axisLine: { lineStyle: { color: '#E5E5E5' } },
      axisTick: { show: false },
      axisLabel: { color: '#333', fontSize: 11, fontFamily: 'DM Sans', fontWeight: 500 },
    },
    series: [
      {
        name: 'Total Lead',
        type: 'bar' as const,
        barWidth: 12,
        barGap: '15%',
        itemStyle: { borderRadius: [0, 3, 3, 0] },
        data: sorted.map((d) => ({
          value: d.count,
          itemStyle: { color: CHANNEL_CHART_COLORS[d.channel] ?? '#888', borderRadius: [0, 3, 3, 0] },
        })),
      },
      {
        name: 'Converted',
        type: 'bar' as const,
        barWidth: 12,
        itemStyle: { borderRadius: [0, 3, 3, 0], color: '#10B981' },
        data: sorted.map((d) => d.converted),
      },
    ],
    animation: true,
    animationDuration: 800,
    animationEasing: 'cubicOut' as const,
  }

  return <ReactECharts option={option} style={{ width: '100%', height: 220 }} opts={{ renderer: 'svg' }} />
}
