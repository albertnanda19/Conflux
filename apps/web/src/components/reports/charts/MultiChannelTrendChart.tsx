import ReactECharts from 'echarts-for-react'
import type { LeadSourceMonthlyTrend } from '@/mock/analytics'
import { CHANNEL_CHART_COLORS } from '@/mock/analytics'

interface MultiChannelTrendChartProps {
  data: LeadSourceMonthlyTrend[]
}

export function MultiChannelTrendChart({ data }: MultiChannelTrendChartProps) {
  const months = data.map((d) => d.month)
  const channels = ['whatsapp', 'instagram', 'facebook'] as const
  const channelLabels: Record<string, string> = { whatsapp: 'WhatsApp', instagram: 'Instagram', facebook: 'Facebook' }

  const option = {
    tooltip: {
      trigger: 'axis' as const,
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
    grid: { top: 16, right: 12, bottom: 40, left: 40 },
    xAxis: {
      type: 'category' as const,
      data: months,
      boundaryGap: false,
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
      type: 'line' as const,
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      showSymbol: false,
      lineStyle: { color: CHANNEL_CHART_COLORS[channelLabels[ch]], width: 2.5 },
      areaStyle: {
        color: {
          type: 'linear' as const,
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: `${CHANNEL_CHART_COLORS[channelLabels[ch]]}40` },
            { offset: 1, color: `${CHANNEL_CHART_COLORS[channelLabels[ch]]}03` },
          ],
        },
      },
      itemStyle: { color: CHANNEL_CHART_COLORS[channelLabels[ch]] },
      data: data.map((d) => d[ch]),
    })),
    animation: true,
    animationDuration: 800,
    animationEasing: 'cubicOut' as const,
  }

  return <ReactECharts option={option} style={{ width: '100%', height: 220 }} opts={{ renderer: 'svg' }} />
}
