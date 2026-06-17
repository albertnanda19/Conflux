import ReactECharts from 'echarts-for-react'
import type { AgentPerformance } from '@/mock/analytics'

interface AgentComparisonChartProps {
  data: AgentPerformance[]
}

export function AgentComparisonChart({ data }: AgentComparisonChartProps) {
  const sorted = [...data].sort((a, b) => b.conversationsHandled - a.conversationsHandled)
  const names = sorted.map((d) => d.name)

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
    grid: { top: 16, right: 16, bottom: 40, left: 100 },
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
        name: 'Ditangani',
        type: 'bar' as const,
        barWidth: 10,
        barGap: '15%',
        itemStyle: { color: '#4A7AFF', borderRadius: [0, 3, 3, 0] },
        data: sorted.map((d) => d.conversationsHandled),
      },
      {
        name: 'Diselesaikan',
        type: 'bar' as const,
        barWidth: 10,
        itemStyle: { color: '#00D4FF', borderRadius: [0, 3, 3, 0] },
        data: sorted.map((d) => d.conversationsResolved),
      },
      {
        name: 'Conversion %',
        type: 'bar' as const,
        barWidth: 10,
        itemStyle: { color: '#10B981', borderRadius: [0, 3, 3, 0] },
        data: sorted.map((d) => d.conversionRate),
      },
    ],
    animation: true,
    animationDuration: 800,
    animationEasing: 'cubicOut' as const,
  }

  return <ReactECharts option={option} style={{ width: '100%', height: 280 }} opts={{ renderer: 'svg' }} />
}
