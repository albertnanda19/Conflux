export type CampaignStatus = 'draft' | 'scheduled' | 'running' | 'completed' | 'cancelled'

export type CampaignGoal = 'promotion' | 'follow_up' | 'event_invitation' | 're_engagement'

export type TemplateType = 'text' | 'text_image' | 'text_document' | 'interactive_button'

export type TemplateCategory = 'sapaan' | 'promo' | 'undangan' | 'follow_up' | 'reminder' | 'closing'

export type SegmentSource = 'whatsapp_organic' | 'instagram_ads' | 'facebook_ads' | 'website' | 'referral'

export interface SegmentFilter {
  programs: string[]
  sources: string[]
  pipelineStatuses: string[]
  labelIds: string[]
  dateRange: { from: string; to: string } | null
  unrepliedOnly: boolean
}

export interface Campaign {
  id: string
  name: string
  description: string
  goal: CampaignGoal
  status: CampaignStatus
  channel: 'whatsapp'
  templateId: string | null
  templateName: string | null
  segmentFilters: SegmentFilter
  totalRecipients: number
  sentCount: number
  deliveredCount: number
  readCount: number
  repliedCount: number
  failedCount: number
  scheduledAt: string | null
  startedAt: string | null
  completedAt: string | null
  createdBy: string
  createdAt: string
}

export interface Template {
  id: string
  name: string
  category: TemplateCategory
  type: TemplateType
  content: string
  variables: string[]
  mediaUrl?: string
  buttonText?: string
  isActive: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface CampaignTimelineEvent {
  timestamp: string
  event: string
  count?: number
}

export interface FailedRecipient {
  contactId: string
  name: string
  phone: string
  reason: string
}

export interface CampaignStats {
  campaignId: string
  sent: number
  delivered: number
  read: number
  replied: number
  failed: number
  timeline: CampaignTimelineEvent[]
  failedRecipients: FailedRecipient[]
}

const now = new Date()
const daysAgo = (d: number) => new Date(now.getTime() - d * 86_400_000).toISOString()
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3_600_000).toISOString()
const daysFromNow = (d: number) => new Date(now.getTime() + d * 86_400_000).toISOString()

export const MOCK_TEMPLATES: Template[] = [
  {
    id: 't1',
    name: 'Sapaan Program',
    category: 'sapaan',
    type: 'text',
    content: 'Halo {nama}! 👋\n\nTerima kasih sudah menghubungi Acme Learning.\n\nKami melihat kamu tertarik dengan program {program}. Ada yang ingin kamu tanyakan?\n\nSalam,\n{agent_nama}',
    variables: ['nama', 'program', 'agent_nama'],
    isActive: true,
    createdBy: 'Admin User',
    createdAt: daysAgo(30),
    updatedAt: daysAgo(5),
  },
  {
    id: 't2',
    name: 'Promo Harga',
    category: 'promo',
    type: 'text_image',
    content: 'Halo {nama}! 🎉\n\nSpesial untuk kamu, berikut harga program {program}:\n\n💰 Harga Normal: Rp 5.500.000\n🔥 Promo Early Bird: Rp 4.500.000\n📅 Berlaku hingga {tanggal_batch}\n\nJangan sampai kehabisan kuota!',
    variables: ['nama', 'program', 'tanggal_batch'],
    mediaUrl: 'https://picsum.photos/800/400',
    isActive: true,
    createdBy: 'Admin User',
    createdAt: daysAgo(25),
    updatedAt: daysAgo(10),
  },
  {
    id: 't3',
    name: 'Undangan Webinar',
    category: 'undangan',
    type: 'interactive_button',
    content: 'Halo {nama}! 📣\n\nAcme Learning mengundang kamu ke webinar gratis:\n\n📌 "Kenalan sama Dunia {program}"\n📅 {tanggal_batch}\n⏰ 19:00 - 21:00 WIB\n\nDaftar sekarang dan dapatkan bonus materi eksklusif!',
    variables: ['nama', 'program', 'tanggal_batch'],
    buttonText: 'Daftar Sekarang',
    isActive: true,
    createdBy: 'Admin User',
    createdAt: daysAgo(20),
    updatedAt: daysAgo(3),
  },
  {
    id: 't4',
    name: 'Follow Up H+3',
    category: 'follow_up',
    type: 'text',
    content: 'Halo {nama}! 😊\n\nKami dari Acme Learning mau follow up percakapan kita kemarin tentang program {program}.\n\nApakah ada pertanyaan yang belum terjawab? Kami siap membantu!',
    variables: ['nama', 'program'],
    isActive: true,
    createdBy: 'Admin User',
    createdAt: daysAgo(15),
    updatedAt: daysAgo(15),
  },
  {
    id: 't5',
    name: 'Reminder Jadwal',
    category: 'reminder',
    type: 'text_image',
    content: 'Halo {nama}! ⏰\n\nIni pengingat untuk program {program} yang akan dimulai:\n\n📅 Tanggal Mulai: {tanggal_batch}\n📍 Lokasi: Online (Google Meet)\n\nPastikan kamu sudah menyiapkan laptop dan koneksi internet yang stabil ya!',
    variables: ['nama', 'program', 'tanggal_batch'],
    mediaUrl: 'https://picsum.photos/800/400',
    isActive: true,
    createdBy: 'Admin User',
    createdAt: daysAgo(10),
    updatedAt: daysAgo(2),
  },
  {
    id: 't6',
    name: 'Closing Daftar',
    category: 'closing',
    type: 'interactive_button',
    content: 'Halo {nama}! 🚀\n\nKami lihat kamu sudah sangat tertarik dengan program {program}.\n\nJangan tunda lagi! Daftar sekarang dan mulai perjalanan karir kamu.',
    variables: ['nama', 'program'],
    buttonText: 'Ya, Saya Daftar!',
    isActive: true,
    createdBy: 'Admin User',
    createdAt: daysAgo(8),
    updatedAt: daysAgo(1),
  },
]

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 'c1',
    name: 'Promo Data Science Batch 12',
    description: 'Campaign promosi program Data Science Batch 12 untuk semua lead yang tertarik.',
    goal: 'promotion',
    status: 'completed',
    channel: 'whatsapp',
    templateId: 't2',
    templateName: 'Promo Harga',
    segmentFilters: {
      programs: ['Data Science'],
      sources: [],
      pipelineStatuses: ['new_lead', 'contacted'],
      labelIds: ['l1'],
      dateRange: null,
      unrepliedOnly: false,
    },
    totalRecipients: 2450,
    sentCount: 2450,
    deliveredCount: 2380,
    readCount: 1890,
    repliedCount: 620,
    failedCount: 70,
    scheduledAt: null,
    startedAt: daysAgo(12),
    completedAt: daysAgo(11),
    createdBy: 'Admin User',
    createdAt: daysAgo(14),
  },
  {
    id: 'c2',
    name: 'Follow Up Instagram Leads',
    description: 'Follow up otomatis untuk lead baru dari Instagram Ads yang belum dibalas.',
    goal: 'follow_up',
    status: 'running',
    channel: 'whatsapp',
    templateId: 't4',
    templateName: 'Follow Up H+3',
    segmentFilters: {
      programs: [],
      sources: ['instagram_ads'],
      pipelineStatuses: ['new_lead'],
      labelIds: ['l5'],
      dateRange: { from: daysAgo(7), to: daysAgo(1) },
      unrepliedOnly: true,
    },
    totalRecipients: 830,
    sentCount: 610,
    deliveredCount: 590,
    readCount: 340,
    repliedCount: 85,
    failedCount: 20,
    scheduledAt: null,
    startedAt: daysAgo(1),
    completedAt: null,
    createdBy: 'Admin User',
    createdAt: daysAgo(2),
  },
  {
    id: 'c3',
    name: 'Early Bird UX Design',
    description: 'Undangan webinar dan promo early bird untuk program UX Design.',
    goal: 'event_invitation',
    status: 'scheduled',
    channel: 'whatsapp',
    templateId: 't3',
    templateName: 'Undangan Webinar',
    segmentFilters: {
      programs: ['UX Design'],
      sources: ['website', 'referral'],
      pipelineStatuses: ['contacted', 'qualified'],
      labelIds: ['l2'],
      dateRange: null,
      unrepliedOnly: false,
    },
    totalRecipients: 1200,
    sentCount: 0,
    deliveredCount: 0,
    readCount: 0,
    repliedCount: 0,
    failedCount: 0,
    scheduledAt: daysFromNow(1),
    startedAt: null,
    completedAt: null,
    createdBy: 'Admin User',
    createdAt: daysAgo(5),
  },
  {
    id: 'c4',
    name: 'Webinar Preview Full-Stack',
    description: 'Draft campaign untuk webinar preview program Full-Stack Web Development.',
    goal: 'promotion',
    status: 'draft',
    channel: 'whatsapp',
    templateId: null,
    templateName: null,
    segmentFilters: {
      programs: ['Full-Stack Web Dev'],
      sources: [],
      pipelineStatuses: [],
      labelIds: [],
      dateRange: null,
      unrepliedOnly: false,
    },
    totalRecipients: 0,
    sentCount: 0,
    deliveredCount: 0,
    readCount: 0,
    repliedCount: 0,
    failedCount: 0,
    scheduledAt: null,
    startedAt: null,
    completedAt: null,
    createdBy: 'Admin User',
    createdAt: daysAgo(1),
  },
  {
    id: 'c5',
    name: 'Re-engagement Cold Leads',
    description: 'Re-engagement untuk lead lama yang sudah lebih dari 30 hari tidak aktif.',
    goal: 're_engagement',
    status: 'cancelled',
    channel: 'whatsapp',
    templateId: 't4',
    templateName: 'Follow Up H+3',
    segmentFilters: {
      programs: [],
      sources: [],
      pipelineStatuses: ['new_lead', 'contacted'],
      labelIds: [],
      dateRange: { from: daysAgo(60), to: daysAgo(30) },
      unrepliedOnly: true,
    },
    totalRecipients: 500,
    sentCount: 120,
    deliveredCount: 115,
    readCount: 45,
    repliedCount: 8,
    failedCount: 5,
    scheduledAt: null,
    startedAt: daysAgo(7),
    completedAt: null,
    createdBy: 'Admin User',
    createdAt: daysAgo(10),
  },
]

export const MOCK_CAMPAIGN_STATS: Record<string, CampaignStats> = {
  c1: {
    campaignId: 'c1',
    sent: 2450,
    delivered: 2380,
    read: 1890,
    replied: 620,
    failed: 70,
    timeline: [
      { timestamp: daysAgo(12), event: 'Campaign dimulai' },
      { timestamp: daysAgo(12), event: 'Batch 1 terkirim', count: 800 },
      { timestamp: daysAgo(11), event: 'Batch 2 terkirim', count: 850 },
      { timestamp: daysAgo(11), event: 'Batch 3 terkirim', count: 800 },
      { timestamp: daysAgo(11), event: 'Campaign selesai' },
    ],
    failedRecipients: [
      { contactId: 'x1', name: 'Budi Santoso', phone: '081234567890', reason: 'Nomor tidak aktif' },
      { contactId: 'x2', name: 'Rina Wati', phone: '085678901234', reason: 'Template tidak disetujui Meta' },
      { contactId: 'x3', name: 'Dedi Kurniawan', phone: '087890123456', reason: 'Bukan nomor WhatsApp' },
    ],
  },
  c2: {
    campaignId: 'c2',
    sent: 610,
    delivered: 590,
    read: 340,
    replied: 85,
    failed: 20,
    timeline: [
      { timestamp: daysAgo(1), event: 'Campaign dimulai' },
      { timestamp: daysAgo(1), event: 'Batch 1 terkirim', count: 300 },
      { timestamp: hoursAgo(6), event: 'Batch 2 terkirim', count: 310 },
    ],
    failedRecipients: [
      { contactId: 'x4', name: 'Andi Saputra', phone: '082345678901', reason: 'Nomor tidak aktif' },
      { contactId: 'x5', name: 'Maya Putri', phone: '083456789012', reason: 'User memblokir nomor' },
    ],
  },
  c3: {
    campaignId: 'c3',
    sent: 0,
    delivered: 0,
    read: 0,
    replied: 0,
    failed: 0,
    timeline: [
      { timestamp: daysAgo(5), event: 'Campaign dibuat' },
      { timestamp: daysAgo(3), event: 'Dijadwalkan' },
    ],
    failedRecipients: [],
  },
  c4: {
    campaignId: 'c4',
    sent: 0,
    delivered: 0,
    read: 0,
    replied: 0,
    failed: 0,
    timeline: [
      { timestamp: daysAgo(1), event: 'Campaign dibuat (draft)' },
    ],
    failedRecipients: [],
  },
  c5: {
    campaignId: 'c5',
    sent: 120,
    delivered: 115,
    read: 45,
    replied: 8,
    failed: 5,
    timeline: [
      { timestamp: daysAgo(10), event: 'Campaign dibuat' },
      { timestamp: daysAgo(7), event: 'Campaign dimulai' },
      { timestamp: daysAgo(7), event: 'Batch 1 terkirim', count: 120 },
      { timestamp: daysAgo(6), event: 'Campaign dibatalkan' },
    ],
    failedRecipients: [
      { contactId: 'x6', name: 'Rudi Hartono', phone: '084567890123', reason: 'Nomor tidak aktif' },
    ],
  },
}

export const MOCK_SEGMENTS = {
  programs: ['Data Science', 'UX Design', 'Full-Stack Web Dev', 'Mobile Dev', 'Cloud Computing'],
  sources: [
    { id: 'whatsapp_organic', label: 'WhatsApp Organik' },
    { id: 'instagram_ads', label: 'Instagram Ads' },
    { id: 'facebook_ads', label: 'Facebook Ads' },
    { id: 'website', label: 'Website' },
    { id: 'referral', label: 'Referral' },
  ],
  pipelineStatuses: [
    { id: 'new_lead', label: 'New Lead' },
    { id: 'contacted', label: 'Contacted' },
    { id: 'qualified', label: 'Qualified' },
    { id: 'proposal_sent', label: 'Proposal Sent' },
    { id: 'closed_won', label: 'Closed Won' },
    { id: 'closed_lost', label: 'Closed Lost' },
  ],
}
