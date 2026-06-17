import { StatCard } from './StatCard'
import { ChartSuspense, AiVsHumanDonutChart, AiTopicChart } from './LazyChart'
import { MOCK_AI_VS_HUMAN } from '@/mock/analytics'
import { ChartCard } from './ChartCard'

export function AiVsHumanTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard
          label="AI Handled"
          value={MOCK_AI_VS_HUMAN.aiHandledPercent}
          icon="🤖"
          color="text-cyan-600"
          bgColor="bg-cyan-50"
          decimals={1}
          suffix="%"
        />
        <StatCard
          label="Human Handled"
          value={MOCK_AI_VS_HUMAN.humanHandledPercent}
          icon="👤"
          color="text-brand-blue"
          bgColor="bg-brand-blue-200/30"
          decimals={1}
          suffix="%"
        />
        <StatCard
          label="Avg AI Confidence"
          value={MOCK_AI_VS_HUMAN.avgAiConfidence}
          icon="🎯"
          color="text-emerald-600"
          bgColor="bg-emerald-50"
          decimals={1}
          suffix="%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Distribusi Penanganan" subtitle="AI vs Human vs Handoff">
          <ChartSuspense>
            <AiVsHumanDonutChart data={MOCK_AI_VS_HUMAN} />
          </ChartSuspense>
        </ChartCard>
        <ChartCard title="Top Topik AI" subtitle="Percakapan per topik">
          <ChartSuspense>
            <AiTopicChart data={MOCK_AI_VS_HUMAN.topAiTopics} />
          </ChartSuspense>
        </ChartCard>
      </div>

      <div className="card-base">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-ink">Knowledge Base Gaps</h3>
          <p className="text-xs text-steel mt-0.5">Pertanyaan yang belum terjawab oleh AI</p>
        </div>
        <div className="divide-y divide-gray-50">
          {MOCK_AI_VS_HUMAN.knowledgeBaseGaps.map((gap, i) => (
            <div key={i} className="px-5 py-3.5 flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 text-sm font-semibold shrink-0 mt-0.5">
                {gap.timesUnanswered}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink">{gap.question}</p>
                <p className="text-xs text-steel mt-1">{gap.suggestedAction}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
