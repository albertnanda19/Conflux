import { create } from 'zustand'

export type DateRangePreset = '7d' | '30d' | '90d' | 'custom'

export interface DateRange {
  from: string
  to: string
}

const DAYS_RANGE: Record<string, number> = { '7d': 7, '30d': 30, '90d': 90 }

function getPresetRange(preset: DateRangePreset): DateRange {
  if (preset === 'custom') {
    const now = new Date()
    return {
      from: new Date(now.getTime() - 30 * 86_400_000).toISOString().split('T')[0],
      to: now.toISOString().split('T')[0],
    }
  }
  const days = DAYS_RANGE[preset]
  const now = new Date()
  return {
    from: new Date(now.getTime() - days * 86_400_000).toISOString().split('T')[0],
    to: now.toISOString().split('T')[0],
  }
}

interface ReportsState {
  dateRangePreset: DateRangePreset
  dateRange: DateRange
  selectedAgent: string | null
  selectedChannel: string | null
  setDateRangePreset: (preset: DateRangePreset) => void
  setCustomDateRange: (range: DateRange) => void
  setSelectedAgent: (agentId: string | null) => void
  setSelectedChannel: (channel: string | null) => void
}

export const useReportsStore = create<ReportsState>((set) => ({
  dateRangePreset: '30d',
  dateRange: getPresetRange('30d'),
  selectedAgent: null,
  selectedChannel: null,
  setDateRangePreset: (preset) =>
    set({ dateRangePreset: preset, dateRange: getPresetRange(preset) }),
  setCustomDateRange: (range) =>
    set({ dateRangePreset: 'custom', dateRange: range }),
  setSelectedAgent: (agentId) => set({ selectedAgent: agentId }),
  setSelectedChannel: (channel) => set({ selectedChannel: channel }),
}))
