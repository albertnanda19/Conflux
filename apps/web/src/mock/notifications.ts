export type NotificationType = 'new_message' | 'new_assignment' | 'ai_handoff' | 'stale_message'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  body: string
  conversationId?: string
  read: boolean
  createdAt: string
}

const now = new Date()
const minutesAgo = (m: number) => new Date(now.getTime() - m * 60_000).toISOString()
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3_600_000).toISOString()

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'new_message',
    title: 'Pesan Baru dari Rina Sari',
    body: 'Kalau program Data Science-nya berapa biayanya ya?',
    conversationId: 'conv1',
    read: false,
    createdAt: minutesAgo(2),
  },
  {
    id: 'n2',
    type: 'ai_handoff',
    title: 'AI Menyerahkan ke Human',
    body: 'AI tidak bisa menjawab pertanyaan pricing. Percakapan dengan Budi Pratama perlu ditangani agent.',
    conversationId: 'conv2',
    read: false,
    createdAt: minutesAgo(15),
  },
  {
    id: 'n3',
    type: 'new_assignment',
    title: 'Percakapan Ditugaskan',
    body: 'Anda ditugaskan menangani percakapan dengan Maya Putri dari Instagram.',
    conversationId: 'conv3',
    read: true,
    createdAt: hoursAgo(1),
  },
  {
    id: 'n4',
    type: 'stale_message',
    title: 'Percakapan Stall',
    body: 'Percakapan dengan Ahmad Fauzi sudah 2 jam tanpa respons.',
    conversationId: 'conv4',
    read: false,
    createdAt: hoursAgo(2),
  },
  {
    id: 'n5',
    type: 'new_message',
    title: 'Pesan Baru dari Dewi Lestari',
    body: 'Terima kasih infonya kak!',
    conversationId: 'conv5',
    read: true,
    createdAt: hoursAgo(3),
  },
  {
    id: 'n6',
    type: 'ai_handoff',
    title: 'AI Menyerahkan ke Human',
    body: 'Fajar Nugroho menanyakan hal teknis yang di luar kapasitas AI.',
    conversationId: 'conv6',
    read: false,
    createdAt: minutesAgo(45),
  },
]
