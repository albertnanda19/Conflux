import ReactECharts from 'echarts-for-react'
import type { AiVsHumanStats } from '@/mock/analytics'

interface AiVsHumanDonutChartProps {
  data: AiVsHumanStats
}

const AI_COLORS = ['#00D4FF', '#4A7AFF', '#FF6B5A']

export function AiVsHumanDonutChart({ data }: AiVsHumanDonutChartProps) {
  const segments = [
    { name: 'AI Handled', value: data.aiHandledPercent, color: AI_COLORS[0] },
    { name: 'Human Handled', value: data.humanHandledPercent, color: AI_COLORS[1] },
    { name: 'Handoff', value: data.handoffPercent, color: AI_COLORS[2] },
  ]

  const option = {
    tooltip: {
      trigger: 'item' as const,
      backgroundColor: '#fff',
      borderColor: '#E5E5E5',
      borderWidth: 1,
      textStyle: { color: '#1A1A1A', fontSize: 12, fontFamily: 'DM Sans' },
      formatter: (params: { name: string; value: number; percent: number }) =>
        `<div style="font-size:11px;color:#888">${params.name}</div><div style="font-size:14px;font-weight:600;color:#1A1A1A;margin-top:2px">${params.value.toFixed(1)}% (${params.percent.toFixed(1)}%)</div>`,
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
          formatter: `{a|${data.aiHandledPercent.toFixed(1)}%}\n{b|AI Handled}`,
          rich: {
            a: { fontSize: 20, fontWeight: 700, color: '#1A1A1A', fontFamily: 'DM Sans', lineHeight: 28 },
            b: { fontSize: 11, color: '#888', fontFamily: 'DM Sans', lineHeight: 18 },
          },
        },
        emphasis: {
          scaleSize: 4,
          itemStyle: { shadowBlur: 8, shadowColor: 'rgba(0,0,0,0.06)' },
        },
        data: segments.map((s) => ({
          name: s.name,
          value: s.value,
          itemStyle: { color: s.color },
        })),
      },
    ],
    animation: true,
    animationDuration: 800,
    animationEasing: 'cubicOut' as const,
  }

  return <ReactECharts option={option} style={{ width: '100%', height: 220 }} opts={{ renderer: 'svg' }} />
}
