const now = new Date()
const daysAgo = (d: number) => new Date(now.getTime() - d * 86_400_000).toISOString()
export interface AnalyticsOverview {
  totalLeads: number
  totalLeadsChange: number
  conversionRate: number
  conversionRateChange: number
  avgResponseTime: number
  avgResponseTimeChange: number
  activeConversations: number
  activeConversationsChange: number
  agentsOnline: number
  agentsOnlineChange: number
  aiHandledPercent: number
  aiHandledChange: number
}

export interface AgentPerformance {
  id: string
  name: string
  avatar: string
  conversationsHandled: number
  conversationsResolved: number
  avgResponseTimeMinutes: number
  conversionRate: number
  onlineHoursToday: number
  onlineHoursWeek: number
}

export interface LeadSourceChannel {
  channel: string
  count: number
  converted: number
  conversionRate: number
}

export interface LeadSourceOrigin {
  source: string
  count: number
  percentage: number
}

export interface LeadSourceByProgram {
  program: string
  whatsapp: number
  instagram: number
  facebook: number
  total: number
}

export interface LeadSourceMonthlyTrend {
  month: string
  whatsapp: number
  instagram: number
  facebook: number
  total: number
}

export interface ConversationTrendDay {
  date: string
  label: string
  count: number
}

export interface HeatmapCell {
  day: number
  hour: number
  count: number
}

export interface BroadcastCampaignRow {
  id: string
  name: string
  status: 'draft' | 'scheduled' | 'running' | 'completed' | 'cancelled'
  channel: string
  sent: number
  delivered: number
  read: number
  replied: number
  replyRate: number
  conversionRate: number
  createdAt: string
}

export interface AiVsHumanStats {
  aiHandledPercent: number
  humanHandledPercent: number
  handoffPercent: number
  avgAiConfidence: number
  topAiTopics: { topic: string; count: number; satisfactionRate: number }[]
  knowledgeBaseGaps: { question: string; timesUnanswered: number; suggestedAction: string }[]
}

export const MOCK_ANALYTICS_OVERVIEW: AnalyticsOverview = {
  totalLeads: 1247,
  totalLeadsChange: 12.4,
  conversionRate: 18.6,
  conversionRateChange: 2.1,
  avgResponseTime: 4.2,
  avgResponseTimeChange: -8.3,
  activeConversations: 89,
  activeConversationsChange: 5.7,
  agentsOnline: 6,
  agentsOnlineChange: 0,
  aiHandledPercent: 62.3,
  aiHandledChange: 3.8,
}

export const MOCK_AGENT_PERFORMANCE: AgentPerformance[] = [
  { id: 'a1', name: 'Sari Dewi', avatar: 'SD', conversationsHandled: 234, conversationsResolved: 210, avgResponseTimeMinutes: 2.8, conversionRate: 22.4, onlineHoursToday: 6.5, onlineHoursWeek: 38.2 },
  { id: 'a2', name: 'Rizki Pratama', avatar: 'RP', conversationsHandled: 198, conversationsResolved: 180, avgResponseTimeMinutes: 3.1, conversionRate: 19.7, onlineHoursToday: 7.2, onlineHoursWeek: 41.0 },
  { id: 'a3', name: 'Nina Kusuma', avatar: 'NK', conversationsHandled: 276, conversationsResolved: 248, avgResponseTimeMinutes: 2.4, conversionRate: 24.1, onlineHoursToday: 5.8, onlineHoursWeek: 36.5 },
  { id: 'a4', name: 'Andi Wijaya', avatar: 'AW', conversationsHandled: 167, conversationsResolved: 142, avgResponseTimeMinutes: 4.7, conversionRate: 15.2, onlineHoursToday: 6.0, onlineHoursWeek: 34.8 },
  { id: 'a5', name: 'Rina Marlina', avatar: 'RM', conversationsHandled: 212, conversationsResolved: 195, avgResponseTimeMinutes: 3.5, conversionRate: 20.8, onlineHoursToday: 7.0, onlineHoursWeek: 39.5 },
  { id: 'a6', name: 'Dika Firmansyah', avatar: 'DF', conversationsHandled: 156, conversationsResolved: 138, avgResponseTimeMinutes: 5.1, conversionRate: 14.3, onlineHoursToday: 4.5, onlineHoursWeek: 32.0 },
]

export const MOCK_LEAD_SOURCE_CHANNELS: LeadSourceChannel[] = [
  { channel: 'WhatsApp', count: 684, converted: 148, conversionRate: 21.6 },
  { channel: 'Instagram', count: 356, converted: 62, conversionRate: 17.4 },
  { channel: 'Facebook', count: 207, converted: 32, conversionRate: 15.5 },
]

export const MOCK_LEAD_SOURCE_ORIGINS: LeadSourceOrigin[] = [
  { source: 'Organik', count: 423, percentage: 33.9 },
  { source: 'Instagram Ads', count: 298, percentage: 23.9 },
  { source: 'Facebook Ads', count: 187, percentage: 15.0 },
  { source: 'Website', count: 176, percentage: 14.1 },
  { source: 'Referral', count: 108, percentage: 8.7 },
  { source: 'WhatsApp Organik', count: 55, percentage: 4.4 },
]

export const MOCK_LEAD_SOURCE_BY_PROGRAM: LeadSourceByProgram[] = [
  { program: 'Data Science', whatsapp: 285, instagram: 148, facebook: 82, total: 515 },
  { program: 'UX Design', whatsapp: 196, instagram: 112, facebook: 68, total: 376 },
  { program: 'Full-Stack Web Dev', whatsapp: 203, instagram: 96, facebook: 57, total: 356 },
]

export const MOCK_LEAD_MONTHLY_TREND: LeadSourceMonthlyTrend[] = [
  { month: 'Jan', whatsapp: 145, instagram: 72, facebook: 38, total: 255 },
  { month: 'Feb', whatsapp: 132, instagram: 68, facebook: 42, total: 242 },
  { month: 'Mar', whatsapp: 158, instagram: 85, facebook: 45, total: 288 },
  { month: 'Apr', whatsapp: 120, instagram: 78, facebook: 35, total: 233 },
  { month: 'Mei', whatsapp: 142, instagram: 90, facebook: 52, total: 284 },
  { month: 'Jun', whatsapp: 87, instagram: 63, facebook: 35, total: 185 },
]

export const MOCK_CONVERSATION_TRENDS: ConversationTrendDay[] = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(now.getTime() - (29 - i) * 86_400_000)
  const dayOfWeek = d.getDay()
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
  const base = isWeekend ? 18 : 42
  const variance = Math.floor(Math.random() * 15) - 7
  return {
    date: d.toISOString().split('T')[0],
    label: `${d.getDate()}/${d.getMonth() + 1}`,
    count: Math.max(8, base + variance),
  }
})

export const MOCK_HEATMAP_DATA: HeatmapCell[] = (() => {
  const cells: HeatmapCell[] = []
  const peakHours = [9, 10, 11, 13, 14, 15, 19, 20]
  const peakDays = [0, 1, 2, 3, 4]
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      let base = 2
      if (hour >= 8 && hour <= 21) base = 15
      if (peakHours.includes(hour) && peakDays.includes(day)) base = 35
      if (hour >= 9 && hour <= 11 && day < 5) base = 45
      if (hour >= 19 && hour <= 21 && day < 5) base = 38
      if (day >= 5) base = Math.floor(base * 0.5)
      if (hour < 6) base = Math.floor(base * 0.1)
      const variance = Math.floor(Math.random() * 8) - 3
      cells.push({ day, hour, count: Math.max(0, base + variance) })
    }
  }
  return cells
})()

export const MOCK_BROADCAST_CAMPAIGNS: BroadcastCampaignRow[] = [
  { id: 'c1', name: 'Promo Data Science Batch 12', status: 'completed', channel: 'WhatsApp', sent: 2450, delivered: 2380, read: 1890, replied: 620, replyRate: 25.3, conversionRate: 12.8, createdAt: daysAgo(14) },
  { id: 'c2', name: 'Follow Up Instagram Leads', status: 'running', channel: 'WhatsApp', sent: 610, delivered: 590, read: 340, replied: 85, replyRate: 13.9, conversionRate: 5.2, createdAt: daysAgo(2) },
  { id: 'c3', name: 'Early Bird UX Design', status: 'scheduled', channel: 'WhatsApp', sent: 0, delivered: 0, read: 0, replied: 0, replyRate: 0, conversionRate: 0, createdAt: daysAgo(5) },
  { id: 'c4', name: 'Webinar Preview Full-Stack', status: 'draft', channel: 'WhatsApp', sent: 0, delivered: 0, read: 0, replied: 0, replyRate: 0, conversionRate: 0, createdAt: daysAgo(1) },
  { id: 'c5', name: 'Re-engagement Cold Leads', status: 'cancelled', channel: 'WhatsApp', sent: 120, delivered: 115, read: 45, replied: 8, replyRate: 6.7, conversionRate: 1.7, createdAt: daysAgo(10) },
  { id: 'c6', name: 'Promo UX Design Batch 8', status: 'completed', channel: 'WhatsApp', sent: 1830, delivered: 1790, read: 1420, replied: 480, replyRate: 26.2, conversionRate: 14.1, createdAt: daysAgo(25) },
  { id: 'c7', name: 'Undangan Webinar AI Fundamentals', status: 'completed', channel: 'WhatsApp', sent: 960, delivered: 940, read: 720, replied: 210, replyRate: 21.9, conversionRate: 8.5, createdAt: daysAgo(35) },
]

export const MOCK_AI_VS_HUMAN: AiVsHumanStats = {
  aiHandledPercent: 62.3,
  humanHandledPercent: 24.8,
  handoffPercent: 12.9,
  avgAiConfidence: 87.6,
  topAiTopics: [
    { topic: 'Informasi Program', count: 845, satisfactionRate: 92.1 },
    { topic: 'Detail Harga & Pembayaran', count: 623, satisfactionRate: 88.4 },
    { topic: 'Jadwal Kelas', count: 512, satisfactionRate: 94.2 },
    { topic: 'Persyaratan Pendaftaran', count: 389, satisfactionRate: 91.7 },
    { topic: 'Kurikulum & Materi', count: 334, satisfactionRate: 86.3 },
    { topic: 'Teknis Platform', count: 278, satisfactionRate: 79.8 },
  ],
  knowledgeBaseGaps: [
    { question: 'Apakah ada cicilan 0%?', timesUnanswered: 87, suggestedAction: 'Tambahkan FAQ tentang opsi cicilan' },
    { question: 'Bisa transfer dari bank apa saja?', timesUnanswered: 64, suggestedAction: 'Update info rekening & metode pembayaran' },
    { question: 'Jam mentoring per minggu berapa?', timesUnanswered: 52, suggestedAction: 'Tambahkan detail jadwal mentoring ke KB' },
    { question: 'Apakah dapat sertifikat?', timesUnanswered: 48, suggestedAction: 'Upload info sertifikat ke knowledge base' },
    { question: 'Bisa join dari HP?', timesUnanswered: 41, suggestedAction: 'Tambahkan info kompatibilitas device' },
  ],
}

export interface CampaignFunnel {
  sent: number
  delivered: number
  read: number
  replied: number
}

export const MOCK_CAMPAIGN_FUNNEL: CampaignFunnel = {
  sent: 5970,
  delivered: 5815,
  read: 4415,
  replied: 1403,
}

export const CHANNEL_CHART_COLORS: Record<string, string> = {
  WhatsApp: '#FF6B5A',
  Instagram: '#E84393',
  Facebook: '#4A7AFF',
  'AI Engine': '#00D4FF',
}

export const PROGRAM_COLORS: Record<string, string> = {
  'Data Science': '#4A7AFF',
  'UX Design': '#E84393',
  'Full-Stack Web Dev': '#7C3AED',
}

export const AGENT_AVATAR_COLORS = [
  '#4A7AFF', '#FF6B5A', '#E84393', '#7C3AED', '#00D4FF', '#10B981',
]

export const DAY_LABELS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']

export function formatDateShort(iso: string): string {
  const d = new Date(iso)
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(d)
}

export function formatResponseTime(minutes: number): string {
  if (minutes < 1) return `${Math.round(minutes * 60)}d`
  if (minutes < 60) return `${minutes.toFixed(1)}m`
  return `${Math.floor(minutes / 60)}j ${Math.round(minutes % 60)}m`
}
