export type ChannelType = 'whatsapp' | 'instagram' | 'facebook'

export type ConversationStatus = 'open' | 'pending' | 'resolved' | 'snoozed'

export type SenderType = 'contact' | 'agent' | 'ai' | 'system'

export type MessageDirection = 'inbound' | 'outbound'

export type MessageStatus = 'sent' | 'delivered' | 'read' | 'failed'

export type MessageContentType = 'text' | 'image' | 'video' | 'document' | 'audio' | 'location'

export type PipelineStatus =
  | 'new_lead'
  | 'contacted'
  | 'qualified'
  | 'proposal_sent'
  | 'closed_won'
  | 'closed_lost'

export type ConversationPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Label {
  id: string
  name: string
  color: string
}

export interface ActivityLog {
  id: string
  type: 'status_change' | 'assignment' | 'note_added' | 'label_added' | 'message_sent' | 'ai_handoff'
  description: string
  agentName?: string
  createdAt: string
}

export interface Contact {
  id: string
  name: string
  avatarUrl?: string
  phone?: string
  email?: string
  channelIdentifiers: { channel: ChannelType; identifier: string }[]
  pipelineStatus: PipelineStatus
  source: ChannelType
  labels: Label[]
  notes?: string
  activityLog: ActivityLog[]
  createdAt: string
}

export interface Agent {
  id: string
  name: string
  initials: string
  status: 'online' | 'busy' | 'offline'
  activeConversationCount: number
}

export interface Conversation {
  id: string
  contactId: string
  contact: Contact
  channel: ChannelType
  status: ConversationStatus
  isAiHandling: boolean
  assignedAgent?: Agent
  lastMessage: string
  lastMessageAt: string
  unreadCount: number
  labels: Label[]
  priority: ConversationPriority
}

export interface Message {
  id: string
  conversationId: string
  direction: MessageDirection
  senderType: SenderType
  senderName?: string
  content: string
  contentType: MessageContentType
  status: MessageStatus
  createdAt: string
  mediaUrl?: string
  fileName?: string
  fileSize?: string
  location?: { lat: number; lng: number; name?: string }
}

export const LABELS: Label[] = [
  { id: 'l1', name: 'Minat Data Science', color: '#4A7AFF' },
  { id: 'l2', name: 'Minat UX Design', color: '#E84393' },
  { id: 'l3', name: 'Follow Up', color: '#FF6B5A' },
  { id: 'l4', name: 'Siap Daftar', color: '#10B981' },
  { id: 'l5', name: 'Dari IG Ads', color: '#7C3AED' },
  { id: 'l6', name: 'Dari WA Organik', color: '#25D366' },
]

export const MOCK_AGENTS: Agent[] = [
  { id: 'a1', name: 'Sari Dewi', initials: 'SD', status: 'online', activeConversationCount: 3 },
  { id: 'a2', name: 'Rizki Pratama', initials: 'RP', status: 'online', activeConversationCount: 5 },
  { id: 'a3', name: 'Nina Kusuma', initials: 'NK', status: 'busy', activeConversationCount: 8 },
  { id: 'a4', name: 'Andi Wijaya', initials: 'AW', status: 'offline', activeConversationCount: 0 },
]

const now = new Date()
const minutesAgo = (m: number) => new Date(now.getTime() - m * 60_000).toISOString()
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3_600_000).toISOString()
const daysAgo = (d: number) => new Date(now.getTime() - d * 86_400_000).toISOString()

export const MOCK_QUICK_REPLIES: QuickReply[] = [
  {
    id: 'qr1',
    shortcut: '/sapa',
    name: 'Sapaan Standar',
    content: 'Halo Kak {nama}! Selamat datang di Acme Learning. Ada yang bisa saya bantu?',
    category: 'Sapaan',
  },
  {
    id: 'qr2',
    shortcut: '/harga',
    name: 'Info Harga',
    content: 'Untuk informasi harga program kami:\n• Data Science: Rp 4.500.000\n• Full-Stack Web Dev: Rp 5.200.000\n• UX Design: Rp 3.800.000\n\nSemua sudah termasuk materi, project, dan sertifikat.',
    category: 'Info Program',
  },
  {
    id: 'qr3',
    shortcut: '/jadwal',
    name: 'Jadwal Batch',
    content: 'Batch selanjutnya mulai tanggal 15 Juli 2026. Untuk early bird ada diskon 10% jika mendaftar sebelum 30 Juni.',
    category: 'Info Program',
  },
  {
    id: 'qr4',
    shortcut: '/followup',
    name: 'Follow Up',
    content: 'Halo Kak {nama}, apa sudah ada keputusan terkait program yang diminati? Kami masih membuka pendaftaran untuk batch Juli.',
    category: 'Follow Up',
  },
  {
    id: 'qr5',
    shortcut: '/closing',
    name: 'Closing',
    content: 'Baik Kak {nama}! Untuk mendaftar, Kakak bisa langsung klik link berikut: [LINK_DAFTAR]. Jika ada pertanyaan, jangan ragu untuk menghubungi kami.',
    category: 'Closing',
  },
]

export interface QuickReply {
  id: string
  shortcut: string
  name: string
  content: string
  category: string
}

export const MOCK_CONTACTS: Contact[] = [
  {
    id: 'c1',
    name: 'Rina Sari',
    phone: '+62 812-3456-7890',
    channelIdentifiers: [{ channel: 'whatsapp', identifier: '+6281234567890' }],
    pipelineStatus: 'qualified',
    source: 'whatsapp',
    labels: [LABELS[0], LABELS[2]],
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
    id: 'c2',
    name: 'Budi Pratama',
    phone: '+62 813-9876-5432',
    channelIdentifiers: [{ channel: 'whatsapp', identifier: '+6281398765432' }],
    pipelineStatus: 'contacted',
    source: 'whatsapp',
    labels: [LABELS[1]],
    activityLog: [
      { id: 'al6', type: 'message_sent', description: 'Budi mengirim pesan dari WhatsApp', createdAt: daysAgo(3) },
      { id: 'al7', type: 'ai_handoff', description: 'AI menyerahkan ke human agent', createdAt: daysAgo(3) },
      { id: 'al8', type: 'assignment', description: 'Ditugaskan ke Rizki Pratama', agentName: 'Rizki Pratama', createdAt: daysAgo(3) },
    ],
    createdAt: daysAgo(3),
  },
  {
    id: 'c3',
    name: 'Maya Putri',
    email: 'maya.putri@email.com',
    channelIdentifiers: [{ channel: 'instagram', identifier: '@mayaptr' }],
    pipelineStatus: 'new_lead',
    source: 'instagram',
    labels: [LABELS[1], LABELS[4]],
    activityLog: [
      { id: 'al9', type: 'message_sent', description: 'Maya DM dari Instagram', createdAt: daysAgo(1) },
      { id: 'al10', type: 'label_added', description: 'Label "Dari IG Ads" ditambahkan', createdAt: daysAgo(1) },
    ],
    createdAt: daysAgo(1),
  },
  {
    id: 'c4',
    name: 'Ahmad Fauzi',
    phone: '+62 857-1122-3344',
    channelIdentifiers: [{ channel: 'facebook', identifier: 'ahmad.fauzi.fb' }],
    pipelineStatus: 'new_lead',
    source: 'facebook',
    labels: [LABELS[0]],
    activityLog: [
      { id: 'al11', type: 'message_sent', description: 'Ahmad kirim pesan dari Facebook', createdAt: daysAgo(2) },
      { id: 'al12', type: 'ai_handoff', description: 'AI menyerahkan ke human', createdAt: daysAgo(2) },
    ],
    createdAt: daysAgo(2),
  },
  {
    id: 'c5',
    name: 'Dewi Lestari',
    phone: '+62 821-5566-7788',
    channelIdentifiers: [{ channel: 'whatsapp', identifier: '+6282155667788' }],
    pipelineStatus: 'closed_won',
    source: 'whatsapp',
    labels: [LABELS[3], LABELS[5]],
    notes: 'Sudah daftar program Data Science Batch 12. Pembayaran lunas.',
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
    id: 'c6',
    name: 'Fajar Nugroho',
    phone: '+62 815-4433-2211',
    channelIdentifiers: [{ channel: 'whatsapp', identifier: '+6281544332211' }],
    pipelineStatus: 'new_lead',
    source: 'whatsapp',
    labels: [],
    activityLog: [
      { id: 'al18', type: 'message_sent', description: 'Fajar mengirim pesan dari WhatsApp', createdAt: daysAgo(1) },
    ],
    createdAt: daysAgo(1),
  },
  {
    id: 'c7',
    name: 'Sinta Rosa',
    email: 'sinta.rosa@email.com',
    channelIdentifiers: [{ channel: 'instagram', identifier: '@sintarosa' }],
    pipelineStatus: 'new_lead',
    source: 'instagram',
    labels: [LABELS[4]],
    activityLog: [
      { id: 'al19', type: 'message_sent', description: 'Sinta DM dari Instagram', createdAt: hoursAgo(4) },
      { id: 'al20', type: 'label_added', description: 'Label "Dari IG Ads" ditambahkan', createdAt: hoursAgo(4) },
    ],
    createdAt: hoursAgo(4),
  },
  {
    id: 'c8',
    name: 'Hendra Wijaya',
    phone: '+62 878-9900-1122',
    channelIdentifiers: [{ channel: 'whatsapp', identifier: '+6287899001122' }],
    pipelineStatus: 'proposal_sent',
    source: 'whatsapp',
    labels: [LABELS[0], LABELS[3]],
    notes: 'Minta penawaran harga program Full-Stack. Sudah kirim brochure.',
    activityLog: [
      { id: 'al21', type: 'message_sent', description: 'Hendra mengirim pesan', createdAt: daysAgo(7) },
      { id: 'al22', type: 'assignment', description: 'Ditugaskan ke Andi Wijaya', agentName: 'Andi Wijaya', createdAt: daysAgo(7) },
      { id: 'al23', type: 'status_change', description: 'Status diubah ke Proposal Sent', createdAt: daysAgo(5) },
      { id: 'al24', type: 'note_added', description: 'Sudah kirim brochure', agentName: 'Andi Wijaya', createdAt: daysAgo(5) },
    ],
    createdAt: daysAgo(7),
  },
  {
    id: 'c9',
    name: 'Lisa Anggraini',
    phone: '+62 819-8877-6655',
    channelIdentifiers: [
      { channel: 'whatsapp', identifier: '+6281988776655' },
      { channel: 'instagram', identifier: '@lisaanggraini' },
    ],
    pipelineStatus: 'contacted',
    source: 'facebook',
    labels: [LABELS[1], LABELS[2]],
    activityLog: [
      { id: 'al25', type: 'message_sent', description: 'Lisa mengirim pesan dari Facebook', createdAt: daysAgo(4) },
      { id: 'al26', type: 'assignment', description: 'Ditugaskan ke Sari Dewi', agentName: 'Sari Dewi', createdAt: daysAgo(4) },
    ],
    createdAt: daysAgo(4),
  },
]

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv1',
    contactId: 'c1',
    contact: MOCK_CONTACTS[0],
    channel: 'whatsapp',
    status: 'open',
    isAiHandling: true,
    lastMessage: 'Kalau program Data Science-nya berapa biayanya ya?',
    lastMessageAt: minutesAgo(2),
    unreadCount: 2,
    labels: [LABELS[0], LABELS[2]],
    priority: 'high',
  },
  {
    id: 'conv2',
    contactId: 'c2',
    contact: MOCK_CONTACTS[1],
    channel: 'whatsapp',
    status: 'open',
    isAiHandling: false,
    assignedAgent: MOCK_AGENTS[0],
    lastMessage: 'Baik Kak, saya tunggu info jadwal batch selanjutnya',
    lastMessageAt: minutesAgo(15),
    unreadCount: 0,
    labels: [LABELS[1]],
    priority: 'medium',
  },
  {
    id: 'conv3',
    contactId: 'c3',
    contact: MOCK_CONTACTS[2],
    channel: 'instagram',
    status: 'pending',
    isAiHandling: false,
    assignedAgent: MOCK_AGENTS[1],
    lastMessage: 'Halo kak, mau tanya soal bootcamp UX Design dong',
    lastMessageAt: minutesAgo(45),
    unreadCount: 1,
    labels: [LABELS[1], LABELS[4]],
    priority: 'medium',
  },
  {
    id: 'conv4',
    contactId: 'c4',
    contact: MOCK_CONTACTS[3],
    channel: 'facebook',
    status: 'open',
    isAiHandling: true,
    lastMessage: 'Ada diskon ngga kalau daftar rame-rame?',
    lastMessageAt: hoursAgo(1),
    unreadCount: 3,
    labels: [LABELS[0]],
    priority: 'high',
  },
  {
    id: 'conv5',
    contactId: 'c5',
    contact: MOCK_CONTACTS[4],
    channel: 'whatsapp',
    status: 'resolved',
    isAiHandling: false,
    assignedAgent: MOCK_AGENTS[0],
    lastMessage: 'Terima kasih banyak kak, sudah daftar!',
    lastMessageAt: daysAgo(3),
    unreadCount: 0,
    labels: [LABELS[3], LABELS[5]],
    priority: 'low',
  },
  {
    id: 'conv6',
    contactId: 'c6',
    contact: MOCK_CONTACTS[5],
    channel: 'whatsapp',
    status: 'open',
    isAiHandling: false,
    assignedAgent: MOCK_AGENTS[2],
    lastMessage: 'Mau tanya program apa saja yang tersedia',
    lastMessageAt: hoursAgo(2),
    unreadCount: 0,
    labels: [],
    priority: 'low',
  },
  {
    id: 'conv7',
    contactId: 'c7',
    contact: MOCK_CONTACTS[6],
    channel: 'instagram',
    status: 'pending',
    isAiHandling: true,
    lastMessage: 'Kak, ada program UI/UX ngga? Liat dari story kakak',
    lastMessageAt: hoursAgo(4),
    unreadCount: 1,
    labels: [LABELS[4]],
    priority: 'medium',
  },
  {
    id: 'conv8',
    contactId: 'c8',
    contact: MOCK_CONTACTS[7],
    channel: 'whatsapp',
    status: 'open',
    isAiHandling: false,
    assignedAgent: MOCK_AGENTS[1],
    lastMessage: 'Oke saya transfer hari ini ya kakddd',
    lastMessageAt: minutesAgo(5),
    unreadCount: 0,
    labels: [LABELS[0], LABELS[3]],
    priority: 'urgent',
  },
  {
    id: 'conv9',
    contactId: 'c9',
    contact: MOCK_CONTACTS[8],
    channel: 'facebook',
    status: 'snoozed',
    isAiHandling: false,
    assignedAgent: MOCK_AGENTS[2],
    lastMessage: 'Nanti saya hubungi lagi minggu depan ya kak',
    lastMessageAt: daysAgo(1),
    unreadCount: 0,
    labels: [LABELS[1], LABELS[2]],
    priority: 'low',
  },
]

export const MOCK_MESSAGES: Record<string, Message[]> = {
  conv1: [
    {
      id: 'm1',
      conversationId: 'conv1',
      direction: 'inbound',
      senderType: 'contact',
      content: 'Halo kak, saya mau tanya-tanya soal program',
      contentType: 'text',
      status: 'read',
      createdAt: minutesAgo(20),
    },
    {
      id: 'm2',
      conversationId: 'conv1',
      direction: 'outbound',
      senderType: 'ai',
      senderName: 'AI Assistant',
      content:
        'Halo Kak Rina! Selamat datang 👋 Ada yang bisa saya bantu? Kami punya beberapa program unggulan, antara lain:\n\n• Data Science (12 minggu)\n• Full-Stack Web Development (16 minggu)\n• UX Design Bootcamp (10 minggu)\n\nProgram mana yang Kakak minati?',
      contentType: 'text',
      status: 'delivered',
      createdAt: minutesAgo(19),
    },
    {
      id: 'm3',
      conversationId: 'conv1',
      direction: 'inbound',
      senderType: 'contact',
      content: 'Wah keren, saya tertarik sama Data Science. Kalo boleh tau detailnya dong',
      contentType: 'text',
      status: 'read',
      createdAt: minutesAgo(15),
    },
    {
      id: 'm4',
      conversationId: 'conv1',
      direction: 'outbound',
      senderType: 'ai',
      senderName: 'AI Assistant',
      content:
        'Tentu Kak! Program Data Science kami mencakup:\n\n📚 Materi:\n• Python & Statistics\n• Machine Learning\n• Deep Learning\n• Data Visualization\n• Capstone Project\n\n⏰ Durasi: 12 minggu (3x pertemuan/minggu)\n💰 Investasi: Rp 4.500.000\n\nKakak berlatar belakang apa? Biar saya bisa kasih rekomendasi yang tepat 😊',
      contentType: 'text',
      status: 'delivered',
      createdAt: minutesAgo(14),
    },
    {
      id: 'm5',
      conversationId: 'conv1',
      direction: 'inbound',
      senderType: 'contact',
      content: 'Saya lulusan Teknik Informatika, baru kerja 1 tahun sih',
      contentType: 'text',
      status: 'read',
      createdAt: minutesAgo(10),
    },
    {
      id: 'm6',
      conversationId: 'conv1',
      direction: 'outbound',
      senderType: 'ai',
      senderName: 'AI Assistant',
      content: 'Ini brosur program Data Science-nya kak 📎',
      contentType: 'document',
      status: 'delivered',
      createdAt: minutesAgo(8),
      fileName: 'Brochure-DataScience-2026.pdf',
      fileSize: '2.4 MB',
    },
    {
      id: 'm7',
      conversationId: 'conv1',
      direction: 'inbound',
      senderType: 'contact',
      content: 'Kalau program Data Science-nya berapa biayanya ya?',
      contentType: 'text',
      status: 'delivered',
      createdAt: minutesAgo(2),
    },
  ],
  conv2: [
    {
      id: 'm20',
      conversationId: 'conv2',
      direction: 'inbound',
      senderType: 'contact',
      content: 'Kak, mau tanya kapan batch selanjutnya mulai?',
      contentType: 'text',
      status: 'read',
      createdAt: minutesAgo(45),
    },
    {
      id: 'm21',
      conversationId: 'conv2',
      direction: 'outbound',
      senderType: 'agent',
      senderName: 'Sari Dewi',
      content: 'Halo Kak Budi! Batch berikutnya mulai tanggal 15 Juli 2026. Masih ada waktu sekitar 1 bulan lagi.',
      contentType: 'text',
      status: 'read',
      createdAt: minutesAgo(40),
    },
    {
      id: 'm22',
      conversationId: 'conv2',
      direction: 'inbound',
      senderType: 'contact',
      content: 'Oh ok, masih ada waktu ya. Ada early bird discount ngga kak?',
      contentType: 'text',
      status: 'read',
      createdAt: minutesAgo(35),
    },
    {
      id: 'm23',
      conversationId: 'conv2',
      direction: 'outbound',
      senderType: 'agent',
      senderName: 'Sari Dewi',
      content: 'Ada Kak! Early bird diskon 10% kalau daftar sebelum 30 Juni. Mau saya kirim detailnya?',
      contentType: 'text',
      status: 'read',
      createdAt: minutesAgo(30),
    },
    {
      id: 'm24',
      conversationId: 'conv2',
      direction: 'inbound',
      senderType: 'contact',
      content: 'Baik Kak, saya tunggu info jadwal batch selanjutnya',
      contentType: 'text',
      status: 'read',
      createdAt: minutesAgo(15),
    },
  ],
  conv4: [
    {
      id: 'm40',
      conversationId: 'conv4',
      direction: 'inbound',
      senderType: 'contact',
      content: 'Halo, saya lihat iklan di Facebook tentang bootcamp programming',
      contentType: 'text',
      status: 'read',
      createdAt: hoursAgo(3),
    },
    {
      id: 'm41',
      conversationId: 'conv4',
      direction: 'outbound',
      senderType: 'ai',
      senderName: 'AI Assistant',
      content:
        'Halo Kak Ahmad! Terima kasih sudah tertarik dengan program kami 🎉\n\nKami punya beberapa program:\n• Data Science — Rp 4.500.000\n• Full-Stack Web Dev — Rp 5.200.000\n• UX Design — Rp 3.800.000\n\nProgram mana yang Kakak minati?',
      contentType: 'text',
      status: 'read',
      createdAt: hoursAgo(3),
    },
    {
      id: 'm42',
      conversationId: 'conv4',
      direction: 'inbound',
      senderType: 'contact',
      content: 'Kalo Full-Stack berapa lama ya programnya?',
      contentType: 'text',
      status: 'read',
      createdAt: hoursAgo(2),
    },
    {
      id: 'm43',
      conversationId: 'conv4',
      direction: 'outbound',
      senderType: 'ai',
      senderName: 'AI Assistant',
      content:
        'Program Full-Stack Web Development berlangsung selama 16 minggu Kak. Materinya mencakup:\n\n• HTML, CSS, JavaScript\n• React & Node.js\n• Database & Deployment\n• Capstone Project\n\nSangat comprehensive untuk yang mau mulai career di web development!',
      contentType: 'text',
      status: 'read',
      createdAt: hoursAgo(2),
    },
    {
      id: 'm44',
      conversationId: 'conv4',
      direction: 'inbound',
      senderType: 'contact',
      content: 'Lokasi kampusnya di mana kak?',
      contentType: 'text',
      status: 'read',
      createdAt: hoursAgo(1),
    },
    {
      id: 'm45',
      conversationId: 'conv4',
      direction: 'inbound',
      senderType: 'contact',
      content: '',
      contentType: 'location',
      status: 'delivered',
      createdAt: minutesAgo(58),
      location: { lat: -6.2088, lng: 106.8456, name: 'Acme Learning Center, Jakarta Selatan' },
    },
    {
      id: 'm46',
      conversationId: 'conv4',
      direction: 'outbound',
      senderType: 'ai',
      senderName: 'AI Assistant',
      content:
        ' Sudah termasuk semua Kak (materi, project, sertifikat). Untuk group discount ada diskon 15% untuk 3+ orang. Mau saya hubungkan dengan tim kami untuk detail lebih lanjut?',
      contentType: 'text',
      status: 'delivered',
      createdAt: minutesAgo(55),
    },
    {
      id: 'm47',
      conversationId: 'conv4',
      direction: 'inbound',
      senderType: 'contact',
      content: 'Ada diskon ngga kalau daftar rame-rame?',
      contentType: 'text',
      status: 'sent',
      createdAt: minutesAgo(30),
    },
  ],
  conv3: [
    {
      id: 'm30',
      conversationId: 'conv3',
      direction: 'inbound',
      senderType: 'contact',
      content: 'Halo kak, mau tanya soal bootcamp UX Design dong',
      contentType: 'text',
      status: 'read',
      createdAt: hoursAgo(2),
    },
    {
      id: 'm31',
      conversationId: 'conv3',
      direction: 'outbound',
      senderType: 'agent',
      senderName: 'Rizki Pratama',
      content: 'Halo Kak Maya! Tentu, ada yang ingin diketahui? 😊',
      contentType: 'text',
      status: 'read',
      createdAt: hoursAgo(1),
    },
    {
      id: 'm32',
      conversationId: 'conv3',
      direction: 'inbound',
      senderType: 'contact',
      content: 'Untuk UX Design-nya itu berapa lama ya kak dan harganya berapa?',
      contentType: 'text',
      status: 'delivered',
      createdAt: minutesAgo(45),
    },
  ],
  conv8: [
    {
      id: 'm80',
      conversationId: 'conv8',
      direction: 'inbound',
      senderType: 'contact',
      content: 'Kak, saya sudah transfer untuk program Full-Stack',
      contentType: 'text',
      status: 'read',
      createdAt: minutesAgo(30),
    },
    {
      id: 'm81',
      conversationId: 'conv8',
      direction: 'outbound',
      senderType: 'agent',
      senderName: 'Rizki Pratama',
      content: 'Baik Kak Hendra, saya cek dulu ya. Bisa kirimkan bukti transfernya?',
      contentType: 'text',
      status: 'read',
      createdAt: minutesAgo(25),
    },
    {
      id: 'm82',
      conversationId: 'conv8',
      direction: 'inbound',
      senderType: 'contact',
      content: '',
      contentType: 'image',
      status: 'read',
      createdAt: minutesAgo(20),
      mediaUrl: 'https://placehold.co/600x400/f5f5f5/888?text=Bukti+Transfer',
      fileName: 'bukti-transfer.jpg',
    },
    {
      id: 'm83',
      conversationId: 'conv8',
      direction: 'outbound',
      senderType: 'agent',
      senderName: 'Rizki Pratama',
      content: 'Terima kasih Kak! Pembayaran sudah terkonfirmasi ✅\n\nSaya akan kirimkan link registrasi dan jadwal orientasi via email ya. Batch dimulai tanggal 15 Juli.',
      contentType: 'text',
      status: 'read',
      createdAt: minutesAgo(15),
    },
    {
      id: 'm84',
      conversationId: 'conv8',
      direction: 'inbound',
      senderType: 'contact',
      content: 'Oke saya transfer hari ini ya kakddd',
      contentType: 'text',
      status: 'delivered',
      createdAt: minutesAgo(5),
    },
  ],
}
