import ReactECharts from 'echarts-for-react'
import type { LeadSourceByProgram } from '@/mock/analytics'
import { CHANNEL_CHART_COLORS } from '@/mock/analytics'

interface ConversionByProgramChartProps {
  data: LeadSourceByProgram[]
}

export function ConversionByProgramChart({ data }: ConversionByProgramChartProps) {
  const programs = data.map((d) => d.program)
  const channels = ['whatsapp', 'instagram', 'facebook'] as const
  const channelLabels: Record<string, string> = { whatsapp: 'WhatsApp', instagram: 'Instagram', facebook: 'Facebook' }

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
    grid: { top: 12, right: 12, bottom: 40, left: 40 },
    xAxis: {
      type: 'category' as const,
      data: programs,
      axisLine: { lineStyle: { color: '#E5E5E5' } },
      axisTick: { show: false },
      axisLabel: { color: '#888', fontSize: 10, fontFamily: 'DM Sans' },
    },
    yAxis: {
      type: 'value' as const,
      splitLine: { lineStyle: { color: '#F0F0F0' } },
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#888', fontSize: 10, fontFamily: 'DM Sans' },
    },
    series: channels.map((ch) => ({
      name: channelLabels[ch],
      type: 'bar' as const,
      barWidth: 18,
      barGap: '20%',
      itemStyle: {
        color: CHANNEL_CHART_COLORS[channelLabels[ch]],
        borderRadius: [3, 3, 0, 0],
      },
      data: data.map((d) => d[ch]),
    })),
    animation: true,
    animationDuration: 800,
    animationEasing: 'cubicOut' as const,
  }

  return <ReactECharts option={option} style={{ width: '100%', height: 220 }} opts={{ renderer: 'svg' }} />
}
