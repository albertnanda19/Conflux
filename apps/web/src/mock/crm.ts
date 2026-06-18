import { LABELS, MOCK_AGENTS, type Contact, type Agent, type ChannelType, type PipelineStatus } from './inbox'

export type CrmContact = Contact & {
  programInterest: string
  assignedAgentId: string | null
}

export interface PipelineColumn {
  id: string
  name: string
  color: string
}

export const DEFAULT_PIPELINE_COLUMNS: PipelineColumn[] = [
  { id: 'new_lead', name: 'New Lead', color: '#4A7AFF' },
  { id: 'contacted', name: 'Contacted', color: '#FF6B5A' },
  { id: 'qualified', name: 'Qualified', color: '#E84393' },
  { id: 'proposal_sent', name: 'Proposal Sent', color: '#7C3AED' },
  { id: 'closed_won', name: 'Closed Won', color: '#10B981' },
  { id: 'closed_lost', name: 'Closed Lost', color: '#888888' },
]

const now = new Date()
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3_600_000).toISOString()
const daysAgo = (d: number) => new Date(now.getTime() - d * 86_400_000).toISOString()

export const MOCK_CRM_CONTACTS: CrmContact[] = [
  {
    id: 'crm1',
    name: 'Rina Sari',
    phone: '+62 812-3456-7890',
    email: 'rina.sari@email.com',
    channelIdentifiers: [{ channel: 'whatsapp', identifier: '+6281234567890' }],
    pipelineStatus: 'qualified',
    source: 'whatsapp',
    labels: [LABELS[0], LABELS[2]],
    notes: 'Lulusan TI, baru kerja 1 tahun. Tertarik Data Science.',
    programInterest: 'Data Science',
    assignedAgentId: 'a1',
    activityLog: [
      { id: 'al1', type: 'message_sent', description: 'Rina mengirim pesan pertama', createdAt: daysAgo(5) },
      { id: 'al2', type: 'assignment', description: 'Ditugaskan ke Sari Dewi', agentName: 'Sari Dewi', createdAt: daysAgo(5) },
      { id: 'al3', type: 'label_added', description: 'Label "Minat Data Science" ditambahkan', createdAt: daysAgo(4) },
      { id: 'al4', type: 'status_change', description: 'Status diubah ke Qualified', createdAt: daysAgo(3) },
      { id: 'al5', type: 'note_added', description: 'Catatan ditambahkan', agentName: 'Sari Dewi', createdAt: daysAgo(2) },
    ],
    createdAt: daysAgo(5),
  },
  {
    id: 'crm2',
    name: 'Budi Pratama',
    phone: '+62 813-9876-5432',
    channelIdentifiers: [{ channel: 'whatsapp', identifier: '+6281398765432' }],
    pipelineStatus: 'contacted',
    source: 'whatsapp',
    labels: [LABELS[1]],
    programInterest: 'UX Design',
    assignedAgentId: 'a2',
    activityLog: [
      { id: 'al6', type: 'message_sent', description: 'Budi mengirim pesan dari WhatsApp', createdAt: daysAgo(3) },
      { id: 'al7', type: 'ai_handoff', description: 'AI menyerahkan ke human agent', createdAt: daysAgo(3) },
      { id: 'al8', type: 'assignment', description: 'Ditugaskan ke Rizki Pratama', agentName: 'Rizki Pratama', createdAt: daysAgo(3) },
    ],
    createdAt: daysAgo(3),
  },
  {
    id: 'crm3',
    name: 'Maya Putri',
    email: 'maya.putri@email.com',
    channelIdentifiers: [{ channel: 'instagram', identifier: '@mayaptr' }],
    pipelineStatus: 'new_lead',
    source: 'instagram',
    labels: [LABELS[1], LABELS[4]],
    programInterest: 'UX Design',
    assignedAgentId: null,
    activityLog: [
      { id: 'al9', type: 'message_sent', description: 'Maya DM dari Instagram', createdAt: daysAgo(1) },
      { id: 'al10', type: 'label_added', description: 'Label "Dari IG Ads" ditambahkan', createdAt: daysAgo(1) },
    ],
    createdAt: daysAgo(1),
  },
  {
    id: 'crm4',
    name: 'Ahmad Fauzi',
    phone: '+62 857-1122-3344',
    channelIdentifiers: [{ channel: 'facebook', identifier: 'ahmad.fauzi.fb' }],
    pipelineStatus: 'new_lead',
    source: 'facebook',
    labels: [LABELS[0]],
    programInterest: 'Data Science',
    assignedAgentId: null,
    activityLog: [
      { id: 'al11', type: 'message_sent', description: 'Ahmad kirim pesan dari Facebook', createdAt: daysAgo(2) },
      { id: 'al12', type: 'ai_handoff', description: 'AI menyerahkan ke human', createdAt: daysAgo(2) },
    ],
    createdAt: daysAgo(2),
  },
  {
    id: 'crm5',
    name: 'Dewi Lestari',
    phone: '+62 821-5566-7788',
    channelIdentifiers: [{ channel: 'whatsapp', identifier: '+6282155667788' }],
    pipelineStatus: 'closed_won',
    source: 'whatsapp',
    labels: [LABELS[3], LABELS[5]],
    notes: 'Sudah daftar program Data Science Batch 12. Pembayaran lunas.',
    programInterest: 'Data Science',
    assignedAgentId: 'a3',
    activityLog: [
      { id: 'al13', type: 'message_sent', description: 'Dewi mengirim pesan pertama', createdAt: daysAgo(14) },
      { id: 'al14', type: 'assignment', description: 'Ditugaskan ke Nina Kusuma', agentName: 'Nina Kusuma', createdAt: daysAgo(14) },
      { id: 'al15', type: 'status_change', description: 'Status diubah ke Qualified', createdAt: daysAgo(12) },
      { id: 'al16', type: 'note_added', description: 'Sudah daftar program DS Batch 12', agentName: 'Nina Kusuma', createdAt: daysAgo(10) },
      { id: 'al17', type: 'status_change', description: 'Status diubah ke Closed Won', createdAt: daysAgo(8) },
    ],
    createdAt: daysAgo(14),
  },
  {
    id: 'crm6',
    name: 'Fajar Nugroho',
    phone: '+62 815-4433-2211',
    channelIdentifiers: [{ channel: 'whatsapp', identifier: '+6281544332211' }],
    pipelineStatus: 'new_lead',
    source: 'whatsapp',
    labels: [],
    programInterest: 'Full-Stack Web Dev',
    assignedAgentId: null,
    activityLog: [
      { id: 'al18', type: 'message_sent', description: 'Fajar mengirim pesan dari WhatsApp', createdAt: daysAgo(1) },
    ],
    createdAt: daysAgo(1),
  },
  {
    id: 'crm7',
    name: 'Sinta Rosa',
    email: 'sinta.rosa@email.com',
    channelIdentifiers: [{ channel: 'instagram', identifier: '@sintarosa' }],
    pipelineStatus: 'new_lead',
    source: 'instagram',
    labels: [LABELS[4]],
    programInterest: 'UX Design',
    assignedAgentId: null,
    activityLog: [
      { id: 'al19', type: 'message_sent', description: 'Sinta DM dari Instagram', createdAt: hoursAgo(4) },
      { id: 'al20', type: 'label_added', description: 'Label "Dari IG Ads" ditambahkan', createdAt: hoursAgo(4) },
    ],
    createdAt: hoursAgo(4),
  },
  {
    id: 'crm8',
    name: 'Hendra Wijaya',
    phone: '+62 878-9900-1122',
    channelIdentifiers: [{ channel: 'whatsapp', identifier: '+6287899001122' }],
    pipelineStatus: 'proposal_sent',
    source: 'whatsapp',
    labels: [LABELS[0], LABELS[3]],
    notes: 'Minta penawaran harga program Full-Stack. Sudah kirim brochure.',
    programInterest: 'Full-Stack Web Dev',
    assignedAgentId: 'a4',
    activityLog: [
      { id: 'al21', type: 'message_sent', description: 'Hendra mengirim pesan', createdAt: daysAgo(7) },
      { id: 'al22', type: 'assignment', description: 'Ditugaskan ke Andi Wijaya', agentName: 'Andi Wijaya', createdAt: daysAgo(7) },
      { id: 'al23', type: 'status_change', description: 'Status diubah ke Proposal Sent', createdAt: daysAgo(5) },
      { id: 'al24', type: 'note_added', description: 'Sudah kirim brochure', agentName: 'Andi Wijaya', createdAt: daysAgo(5) },
    ],
    createdAt: daysAgo(7),
  },
  {
    id: 'crm9',
    name: 'Lisa Anggraini',
    phone: '+62 819-8877-6655',
    channelIdentifiers: [
      { channel: 'whatsapp', identifier: '+6281988776655' },
      { channel: 'instagram', identifier: '@lisaanggraini' },
    ],
    pipelineStatus: 'contacted',
    source: 'facebook',
    labels: [LABELS[1], LABELS[2]],
    programInterest: 'UX Design',
    assignedAgentId: 'a1',
    activityLog: [
      { id: 'al25', type: 'message_sent', description: 'Lisa mengirim pesan dari Facebook', createdAt: daysAgo(4) },
      { id: 'al26', type: 'assignment', description: 'Ditugaskan ke Sari Dewi', agentName: 'Sari Dewi', createdAt: daysAgo(4) },
    ],
    createdAt: daysAgo(4),
  },
  {
    id: 'crm10',
    name: 'Dimas Aditya',
    phone: '+62 856-3344-5566',
    channelIdentifiers: [{ channel: 'whatsapp', identifier: '+6285633445566' }],
    pipelineStatus: 'new_lead',
    source: 'whatsapp',
    labels: [LABELS[5]],
    programInterest: 'Full-Stack Web Dev',
    assignedAgentId: null,
    activityLog: [
      { id: 'al27', type: 'message_sent', description: 'Dimas kirim pesan dari WhatsApp', createdAt: hoursAgo(6) },
    ],
    createdAt: hoursAgo(6),
  },
  {
    id: 'crm11',
    name: 'Putri Wulandari',
    phone: '+62 811-2233-4455',
    email: 'putri.w@email.com',
    channelIdentifiers: [{ channel: 'instagram', identifier: '@putriwulan' }],
    pipelineStatus: 'qualified',
    source: 'instagram',
    labels: [LABELS[0], LABELS[4]],
    notes: 'Senior data analyst. Mau upgrade ke ML/DL.',
    programInterest: 'Data Science',
    assignedAgentId: 'a2',
    activityLog: [
      { id: 'al28', type: 'message_sent', description: 'Putri DM dari Instagram', createdAt: daysAgo(6) },
      { id: 'al29', type: 'assignment', description: 'Ditugaskan ke Rizki Pratama', agentName: 'Rizki Pratama', createdAt: daysAgo(6) },
      { id: 'al30', type: 'status_change', description: 'Status diubah ke Qualified', createdAt: daysAgo(4) },
      { id: 'al31', type: 'note_added', description: 'Senior data analyst, mau upgrade ke ML', agentName: 'Rizki Pratama', createdAt: daysAgo(3) },
    ],
    createdAt: daysAgo(6),
  },
  {
    id: 'crm12',
    name: 'Raka Saputra',
    phone: '+62 822-9988-7766',
    channelIdentifiers: [{ channel: 'facebook', identifier: 'raka.saputra.fb' }],
    pipelineStatus: 'proposal_sent',
    source: 'facebook',
    labels: [LABELS[0]],
    programInterest: 'Data Science',
    assignedAgentId: 'a3',
    activityLog: [
      { id: 'al32', type: 'message_sent', description: 'Raka kirim pesan dari Facebook', createdAt: daysAgo(10) },
      { id: 'al33', type: 'assignment', description: 'Ditugaskan ke Nina Kusuma', agentName: 'Nina Kusuma', createdAt: daysAgo(10) },
      { id: 'al34', type: 'status_change', description: 'Status diubah ke Proposal Sent', createdAt: daysAgo(7) },
    ],
    createdAt: daysAgo(10),
  },
  {
    id: 'crm13',
    name: 'Citra Maharani',
    phone: '+62 838-1122-3344',
    channelIdentifiers: [{ channel: 'whatsapp', identifier: '+6283811223344' }],
    pipelineStatus: 'closed_lost',
    source: 'whatsapp',
    labels: [LABELS[1]],
    programInterest: 'UX Design',
    assignedAgentId: 'a4',
    activityLog: [
      { id: 'al35', type: 'message_sent', description: 'Citra kirim pesan', createdAt: daysAgo(20) },
      { id: 'al36', type: 'assignment', description: 'Ditugaskan ke Andi Wijaya', agentName: 'Andi Wijaya', createdAt: daysAgo(20) },
      { id: 'al37', type: 'status_change', description: 'Status diubah ke Closed Lost', createdAt: daysAgo(15) },
    ],
    createdAt: daysAgo(20),
  },
  {
    id: 'crm14',
    name: 'Yoga Pratama',
    phone: '+62 877-5566-3322',
    channelIdentifiers: [{ channel: 'whatsapp', identifier: '+6287755663322' }],
    pipelineStatus: 'new_lead',
    source: 'whatsapp',
    labels: [],
    programInterest: 'Data Science',
    assignedAgentId: null,
    activityLog: [
      { id: 'al38', type: 'message_sent', description: 'Yoga kirim pesan dari WhatsApp', createdAt: hoursAgo(2) },
    ],
    createdAt: hoursAgo(2),
  },
  {
    id: 'crm15',
    name: 'Anisa Rahmawati',
    email: 'anisa.r@email.com',
    channelIdentifiers: [{ channel: 'instagram', identifier: '@anisarahma' }],
    pipelineStatus: 'contacted',
    source: 'instagram',
    labels: [LABELS[4], LABELS[2]],
    programInterest: 'Full-Stack Web Dev',
    assignedAgentId: 'a1',
    activityLog: [
      { id: 'al39', type: 'message_sent', description: 'Anisa DM dari Instagram', createdAt: daysAgo(2) },
      { id: 'al40', type: 'assignment', description: 'Ditugaskan ke Sari Dewi', agentName: 'Sari Dewi', createdAt: daysAgo(2) },
    ],
    createdAt: daysAgo(2),
  },
  {
    id: 'crm16',
    name: 'Reza Firmansyah',
    phone: '+62 816-7788-9900',
    channelIdentifiers: [{ channel: 'facebook', identifier: 'reza.firmansyah.fb' }],
    pipelineStatus: 'qualified',
    source: 'facebook',
    labels: [LABELS[0], LABELS[3]],
    notes: 'Backend engineer, mau switch ke fullstack. Budget ready.',
    programInterest: 'Full-Stack Web Dev',
    assignedAgentId: 'a3',
    activityLog: [
      { id: 'al41', type: 'message_sent', description: 'Reza kirim pesan dari Facebook', createdAt: daysAgo(8) },
      { id: 'al42', type: 'assignment', description: 'Ditugaskan ke Nina Kusuma', agentName: 'Nina Kusuma', createdAt: daysAgo(8) },
      { id: 'al43', type: 'status_change', description: 'Status diubah ke Qualified', createdAt: daysAgo(5) },
      { id: 'al44', type: 'note_added', description: 'Backend engineer, mau switch ke fullstack', agentName: 'Nina Kusuma', createdAt: daysAgo(4) },
    ],
    createdAt: daysAgo(8),
  },
  {
    id: 'crm17',
    name: 'Salsa Nabila',
    phone: '+62 852-4433-2211',
    channelIdentifiers: [{ channel: 'whatsapp', identifier: '+6285244332211' }],
    pipelineStatus: 'closed_won',
    source: 'instagram',
    labels: [LABELS[3], LABELS[4]],
    notes: 'Daftar UX Design Bootcamp Batch 8. Sudah bayar full.',
    programInterest: 'UX Design',
    assignedAgentId: 'a2',
    activityLog: [
      { id: 'al45', type: 'message_sent', description: 'Salsa DM dari Instagram', createdAt: daysAgo(18) },
      { id: 'al46', type: 'assignment', description: 'Ditugaskan ke Rizki Pratama', agentName: 'Rizki Pratama', createdAt: daysAgo(18) },
      { id: 'al47', type: 'status_change', description: 'Status diubah ke Closed Won', createdAt: daysAgo(12) },
    ],
    createdAt: daysAgo(18),
  },
  {
    id: 'crm18',
    name: 'Taufik Hidayat',
    phone: '+62 818-6655-4433',
    channelIdentifiers: [{ channel: 'whatsapp', identifier: '+6281866554433' }],
    pipelineStatus: 'contacted',
    source: 'whatsapp',
    labels: [LABELS[0]],
    programInterest: 'Data Science',
    assignedAgentId: 'a4',
    activityLog: [
      { id: 'al48', type: 'message_sent', description: 'Taufik kirim pesan dari WhatsApp', createdAt: daysAgo(3) },
      { id: 'al49', type: 'assignment', description: 'Ditugaskan ke Andi Wijaya', agentName: 'Andi Wijaya', createdAt: daysAgo(3) },
    ],
    createdAt: daysAgo(3),
  },
]

export const PROGRAM_OPTIONS = [
  'Data Science',
  'Full-Stack Web Dev',
  'UX Design',
] as const

export const SOURCE_OPTIONS: { value: ChannelType; label: string }[] = [
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
]

export function getAgentById(id: string): Agent | undefined {
  return MOCK_AGENTS.find((a) => a.id === id)
}

export function getContactsByStatus(status: PipelineStatus): CrmContact[] {
  return MOCK_CRM_CONTACTS.filter((c) => c.pipelineStatus === status)
}

export function getContactCountByStatus(status: PipelineStatus): number {
  return MOCK_CRM_CONTACTS.filter((c) => c.pipelineStatus === status).length
}
