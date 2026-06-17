import ReactECharts from 'echarts-for-react'
import type { LeadSourceOrigin } from '@/mock/analytics'

interface OriginDistributionChartProps {
  data: LeadSourceOrigin[]
}

const ORIGIN_COLORS = ['#4A7AFF', '#E84393', '#7C3AED', '#FF6B5A', '#00D4FF', '#10B981']

export function OriginDistributionChart({ data }: OriginDistributionChartProps) {
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
      itemGap: 12,
      textStyle: { color: '#888', fontSize: 10, fontFamily: 'DM Sans' },
      icon: 'circle',
    },
    series: [
      {
        type: 'pie' as const,
        radius: ['48%', '70%'],
        center: ['50%', '42%'],
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
        data: data.map((d, i) => ({
          name: d.source,
          value: d.count,
          itemStyle: { color: ORIGIN_COLORS[i % ORIGIN_COLORS.length] },
        })),
      },
    ],
    animation: true,
    animationDuration: 800,
    animationEasing: 'cubicOut' as const,
  }

  return <ReactECharts option={option} style={{ width: '100%', height: 220 }} opts={{ renderer: 'svg' }} />
}
