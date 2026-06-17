import { lazy, Suspense } from 'react'
import type { PropsWithChildren } from 'react'

function ChartSkeleton() {
  return (
    <div className="flex items-center justify-center h-[220px]">
      <div className="w-5 h-5 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export function ChartSuspense({ children }: PropsWithChildren) {
  return <Suspense fallback={<ChartSkeleton />}>{children}</Suspense>
}

const LeadTrendChart = lazy(() => import('./charts/LeadTrendChart').then((m) => ({ default: m.LeadTrendChart })))
const ChannelDistributionChart = lazy(() => import('./charts/ChannelDistributionChart').then((m) => ({ default: m.ChannelDistributionChart })))
const ConversionByProgramChart = lazy(() => import('./charts/ConversionByProgramChart').then((m) => ({ default: m.ConversionByProgramChart })))
const TopAgentChart = lazy(() => import('./charts/TopAgentChart').then((m) => ({ default: m.TopAgentChart })))
const AgentComparisonChart = lazy(() => import('./charts/AgentComparisonChart').then((m) => ({ default: m.AgentComparisonChart })))
const SourceBreakdownChart = lazy(() => import('./charts/SourceBreakdownChart').then((m) => ({ default: m.SourceBreakdownChart })))
const OriginDistributionChart = lazy(() => import('./charts/OriginDistributionChart').then((m) => ({ default: m.OriginDistributionChart })))
const MultiChannelTrendChart = lazy(() => import('./charts/MultiChannelTrendChart').then((m) => ({ default: m.MultiChannelTrendChart })))
const ConversationVolumeChart = lazy(() => import('./charts/ConversationVolumeChart').then((m) => ({ default: m.ConversationVolumeChart })))
const HeatmapChart = lazy(() => import('./charts/HeatmapChart').then((m) => ({ default: m.HeatmapChart })))
const PeakHoursChart = lazy(() => import('./charts/PeakHoursChart').then((m) => ({ default: m.PeakHoursChart })))
const CampaignFunnelChart = lazy(() => import('./charts/CampaignFunnelChart').then((m) => ({ default: m.CampaignFunnelChart })))
const AiVsHumanDonutChart = lazy(() => import('./charts/AiVsHumanDonutChart').then((m) => ({ default: m.AiVsHumanDonutChart })))
const AiTopicChart = lazy(() => import('./charts/AiTopicChart').then((m) => ({ default: m.AiTopicChart })))

export { LeadTrendChart, ChannelDistributionChart, ConversionByProgramChart, TopAgentChart, AgentComparisonChart, SourceBreakdownChart, OriginDistributionChart, MultiChannelTrendChart, ConversationVolumeChart, HeatmapChart, PeakHoursChart, CampaignFunnelChart, AiVsHumanDonutChart, AiTopicChart }
