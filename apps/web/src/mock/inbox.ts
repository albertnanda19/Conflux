export type ChannelType = 'whatsapp' | 'instagram' | 'facebook'

export type ConversationStatus = 'open' | 'pending' | 'resolved' | 'snoozed'

export type SenderType = 'contact' | 'agent' | 'ai' | 'system'

export type MessageDirection = 'inbound' | 'outbound'

export type MessageStatus = 'sent' | 'delivered' | 'read' | 'failed'

export type PipelineStatus =
  | 'new_lead'
  | 'contacted'
  | 'qualified'
  | 'proposal_sent'
  | 'closed_won'
  | 'closed_lost'

export interface Label {
  id: string
  name: string
  color: string
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
  createdAt: string
}

export interface Agent {
  id: string
  name: string
  initials: string
  status: 'online' | 'busy' | 'offline'
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
}

export interface Message {
  id: string
  conversationId: string
  direction: MessageDirection
  senderType: SenderType
  senderName?: string
  content: string
  status: MessageStatus
  createdAt: string
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
  { id: 'a1', name: 'Sari Dewi', initials: 'SD', status: 'online' },
  { id: 'a2', name: 'Rizki Pratama', initials: 'RP', status: 'online' },
  { id: 'a3', name: 'Nina Kusuma', initials: 'NK', status: 'busy' },
  { id: 'a4', name: 'Andi Wijaya', initials: 'AW', status: 'offline' },
]

const now = new Date()
const minutesAgo = (m: number) => new Date(now.getTime() - m * 60_000).toISOString()
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3_600_000).toISOString()
const daysAgo = (d: number) => new Date(now.getTime() - d * 86_400_000).toISOString()

export const MOCK_CONTACTS: Contact[] = [
  {
    id: 'c1',
    name: 'Rina Sari',
    phone: '+62 812-3456-7890',
    channelIdentifiers: [{ channel: 'whatsapp', identifier: '+6281234567890' }],
    pipelineStatus: 'qualified',
    source: 'whatsapp',
    labels: [LABELS[0], LABELS[2]],
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
      status: 'delivered',
      createdAt: minutesAgo(19),
    },
    {
      id: 'm3',
      conversationId: 'conv1',
      direction: 'inbound',
      senderType: 'contact',
      content: 'Wah keren, saya tertarik sama Data Science. Kalo boleh tau detailnya dong',
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
      status: 'delivered',
      createdAt: minutesAgo(14),
    },
    {
      id: 'm5',
      conversationId: 'conv1',
      direction: 'inbound',
      senderType: 'contact',
      content: 'Saya lulusan Teknik Informatika, baru kerja 1 tahun sih',
      status: 'read',
      createdAt: minutesAgo(10),
    },
    {
      id: 'm6',
      conversationId: 'conv1',
      direction: 'outbound',
      senderType: 'ai',
      senderName: 'AI Assistant',
      content:
        'Wah pas banget Kak! Dengan background IF, Kakak sudah punya dasar programming yang kuat. Program Data Science ini akan upgrade skill Kakak ke level berikutnya 🚀\n\nBanyak alumni kami yang berhasil pivot karier ke Data Scientist dengan gaji 2x lipat setelah lulus.\n\nKalau program Data Science-nya berapa biayanya ya?',
      status: 'delivered',
      createdAt: minutesAgo(8),
    },
    {
      id: 'm7',
      conversationId: 'conv1',
      direction: 'inbound',
      senderType: 'contact',
      content: 'Kalau program Data Science-nya berapa biayanya ya?',
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
      status: 'read',
      createdAt: minutesAgo(40),
    },
    {
      id: 'm22',
      conversationId: 'conv2',
      direction: 'inbound',
      senderType: 'contact',
      content: 'Oh ok, masih ada waktu ya. Ada early bird discount ngga kak?',
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
      status: 'read',
      createdAt: minutesAgo(30),
    },
    {
      id: 'm24',
      conversationId: 'conv2',
      direction: 'inbound',
      senderType: 'contact',
      content: 'Baik Kak, saya tunggu info jadwal batch selanjutnya',
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
      status: 'read',
      createdAt: hoursAgo(3),
    },
    {
      id: 'm42',
      conversationId: 'conv4',
      direction: 'inbound',
      senderType: 'contact',
      content: 'Kalo Full-Stack berapa lama ya programnya?',
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
      status: 'read',
      createdAt: hoursAgo(2),
    },
    {
      id: 'm44',
      conversationId: 'conv4',
      direction: 'inbound',
      senderType: 'contact',
      content: 'Harganya segitu udah termasuk semua ya? Ada diskon ngga kalau daftar rame-rame?',
      status: 'delivered',
      createdAt: hoursAgo(1),
    },
    {
      id: 'm45',
      conversationId: 'conv4',
      direction: 'outbound',
      senderType: 'ai',
      senderName: 'AI Assistant',
      content:
        ' Sudah termasuk semua Kak (materi, project, sertifikat). Untuk group discount ada diskon 15% untuk 3+ orang. Mau saya hubungkan dengan tim kami untuk detail lebih lanjut?',
      status: 'delivered',
      createdAt: minutesAgo(55),
    },
    {
      id: 'm46',
      conversationId: 'conv4',
      direction: 'inbound',
      senderType: 'contact',
      content: 'Ada diskon ngga kalau daftar rame-rame?',
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
      status: 'read',
      createdAt: hoursAgo(1),
    },
    {
      id: 'm32',
      conversationId: 'conv3',
      direction: 'inbound',
      senderType: 'contact',
      content: 'Untuk UX Design-nya itu berapa lama ya kak dan harganya berapa?',
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
      status: 'read',
      createdAt: minutesAgo(25),
    },
    {
      id: 'm82',
      conversationId: 'conv8',
      direction: 'inbound',
      senderType: 'contact',
      content: 'Ini buktinya kak 📎',
      status: 'read',
      createdAt: minutesAgo(20),
    },
    {
      id: 'm83',
      conversationId: 'conv8',
      direction: 'outbound',
      senderType: 'agent',
      senderName: 'Rizki Pratama',
      content: 'Terima kasih Kak! Pembayaran sudah terkonfirmasi ✅\n\nSaya akan kirimkan link registrasi dan jadwal orientasi via email ya. Batch dimulai tanggal 15 Juli.',
      status: 'read',
      createdAt: minutesAgo(15),
    },
    {
      id: 'm84',
      conversationId: 'conv8',
      direction: 'inbound',
      senderType: 'contact',
      content: 'Oke saya transfer hari ini ya kakddd',
      status: 'delivered',
      createdAt: minutesAgo(5),
    },
  ],
}
