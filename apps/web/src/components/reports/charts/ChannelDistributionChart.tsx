import ReactECharts from 'echarts-for-react'
import type { LeadSourceChannel } from '@/mock/analytics'
import { CHANNEL_CHART_COLORS } from '@/mock/analytics'

interface ChannelDistributionChartProps {
  data: LeadSourceChannel[]
}

export function ChannelDistributionChart({ data }: ChannelDistributionChartProps) {
  const total = data.reduce((s, d) => s + d.count, 0)

  const option = {
    tooltip: {
      trigger: 'item' as const,
      backgroundColor: '#fff',
      borderColor: '#E5E5E5',
      borderWidth: 1,
      textStyle: { color: '#1A1A1A', fontSize: 12, fontFamily: 'DM Sans' },
      formatter: (params: { name: string; value: number; percent: number }) =>
        `<div style="font-size:12px;color:#888">${params.name}</div><div style="font-size:14px;font-weight:600;color:#1A1A1A;margin-top:2px">${params.value.toLocaleString('id-ID')} lead (${params.percent.toFixed(1)}%)</div>`,
    },
    legend: {
      bottom: 0,
      itemWidth: 8,
      itemHeight: 8,
      itemGap: 16,
      textStyle: { color: '#888', fontSize: 11, fontFamily: 'DM Sans' },
      icon: 'circle',
    },
    series: [
      {
        type: 'pie' as const,
        radius: ['50%', '72%'],
        center: ['50%', '44%'],
        avoidLabelOverlap: false,
        padAngle: 2,
        itemStyle: { borderRadius: 4 },
        label: {
          show: true,
          position: 'center' as const,
          formatter: `{a|${total.toLocaleString('id-ID')}}\n{b|total lead}`,
          rich: {
            a: { fontSize: 20, fontWeight: 700, color: '#1A1A1A', fontFamily: 'DM Sans', lineHeight: 28 },
            b: { fontSize: 11, color: '#888', fontFamily: 'DM Sans', lineHeight: 18 },
          },
        },
        emphasis: {
          scaleSize: 4,
          itemStyle: { shadowBlur: 8, shadowColor: 'rgba(0,0,0,0.06)' },
        },
        data: data.map((d) => ({
          name: d.channel,
          value: d.count,
          itemStyle: { color: CHANNEL_CHART_COLORS[d.channel] ?? '#888' },
        })),
      },
    ],
    animation: true,
    animationDuration: 800,
    animationEasing: 'cubicOut' as const,
  }

  return <ReactECharts option={option} style={{ width: '100%', height: 220 }} opts={{ renderer: 'svg' }} />
}
