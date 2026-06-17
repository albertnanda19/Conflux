import { useSearchParams } from 'react-router-dom'
import { Tabs, TabList, TabTrigger, TabContent } from '@/components/ui/tabs'
import { ReportFilters } from '@/components/reports/ReportFilters'
import { OverviewTab } from '@/components/reports/OverviewTab'
import { AgentPerformanceTab } from '@/components/reports/AgentPerformanceTab'
import { LeadSourceTab } from '@/components/reports/LeadSourceTab'
import { ConversationTrendsTab } from '@/components/reports/ConversationTrendsTab'
import { BroadcastTab } from '@/components/reports/BroadcastTab'
import { AiVsHumanTab } from '@/components/reports/AiVsHumanTab'

const VALID_TABS = ['overview', 'agent', 'leads', 'trends', 'broadcast', 'ai']

export function ReportsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const activeTab = VALID_TABS.includes(tabParam ?? '') ? (tabParam as string) : 'overview'

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value }, { replace: true })
  }

  return (
    <div className="p-8 h-full">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-ink mb-1">Laporan & Analitik</h1>
          <p className="text-steel text-sm">Visibilitas data untuk pengambilan keputusan berbasis data.</p>
        </div>
        <ReportFilters />
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabList className="mb-6">
          <TabTrigger value="overview">Ringkasan</TabTrigger>
          <TabTrigger value="agent">Performa Agent</TabTrigger>
          <TabTrigger value="leads">Sumber Lead</TabTrigger>
          <TabTrigger value="trends">Tren Percakapan</TabTrigger>
          <TabTrigger value="broadcast">Broadcast</TabTrigger>
          <TabTrigger value="ai">AI vs Human</TabTrigger>
        </TabList>

        <TabContent value="overview">
          <OverviewTab />
        </TabContent>

        <TabContent value="agent">
          <AgentPerformanceTab />
        </TabContent>

        <TabContent value="leads">
          <LeadSourceTab />
        </TabContent>

        <TabContent value="trends">
          <ConversationTrendsTab />
        </TabContent>

        <TabContent value="broadcast">
          <BroadcastTab />
        </TabContent>

        <TabContent value="ai">
          <AiVsHumanTab />
        </TabContent>
      </Tabs>
    </div>
  )
}
