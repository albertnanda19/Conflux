import ReactECharts from 'echarts-for-react'
import type { CampaignFunnel } from '@/mock/analytics'

interface CampaignFunnelChartProps {
  data: CampaignFunnel
}

const FUNNEL_COLORS = ['#4A7AFF', '#00D4FF', '#7C3AED', '#FF6B5A']

export function CampaignFunnelChart({ data }: CampaignFunnelChartProps) {
  const total = data.sent

  const option = {
    tooltip: {
      trigger: 'item' as const,
      backgroundColor: '#fff',
      borderColor: '#E5E5E5',
      borderWidth: 1,
      textStyle: { color: '#1A1A1A', fontSize: 12, fontFamily: 'DM Sans' },
      formatter: (params: { name: string; value: number }) => {
        const pct = total > 0 ? ((params.value / total) * 100).toFixed(1) : '0.0'
        return `<div style="font-size:11px;color:#888">${params.name}</div><div style="font-size:14px;font-weight:600;color:#1A1A1A;margin-top:2px">${params.value.toLocaleString('id-ID')} (${pct}%)</div>`
      },
    },
    series: [
      {
        type: 'funnel' as const,
        left: '10%',
        top: 12,
        bottom: 12,
        width: '80%',
        min: 0,
        max: total,
        minSize: '0%',
        maxSize: '100%',
        sort: 'descending' as const,
        gap: 4,
        label: {
          show: true,
          position: 'inside' as const,
          formatter: (params: { name: string; value: number }) => {
            const pct = total > 0 ? ((params.value / total) * 100).toFixed(1) : '0.0'
            return `${params.name}  ${params.value.toLocaleString('id-ID')}  (${pct}%)`
          },
          fontSize: 11,
          fontFamily: 'DM Sans',
          fontWeight: 500 as const,
          color: '#fff',
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1,
        },
        data: [
          { name: 'Terkirim', value: data.sent, itemStyle: { color: FUNNEL_COLORS[0] } },
          { name: 'Diterima', value: data.delivered, itemStyle: { color: FUNNEL_COLORS[1] } },
          { name: 'Dibaca', value: data.read, itemStyle: { color: FUNNEL_COLORS[2] } },
          { name: 'Dibalas', value: data.replied, itemStyle: { color: FUNNEL_COLORS[3] } },
        ],
      },
    ],
    animation: true,
    animationDuration: 800,
    animationEasing: 'cubicOut' as const,
  }

  return <ReactECharts option={option} style={{ width: '100%', height: 220 }} opts={{ renderer: 'svg' }} />
}
