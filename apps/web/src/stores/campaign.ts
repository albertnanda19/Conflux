import { create } from 'zustand'
import {
  MOCK_CAMPAIGNS,
  MOCK_TEMPLATES,
  MOCK_CAMPAIGN_STATS,
  type Campaign,
  type Template,
  type CampaignStats,
  type CampaignStatus,
  type CampaignGoal,
  type SegmentFilter,
  type TemplateType,
  type TemplateCategory,
} from '@/mock/campaign'

interface CampaignState {
  campaigns: Campaign[]
  templates: Template[]
  campaignStats: Record<string, CampaignStats>
  selectedCampaignId: string | null

  selectCampaign: (id: string | null) => void

  createCampaign: (data: {
    name: string
    description: string
    goal: CampaignGoal
    templateId: string | null
    templateName: string | null
    segmentFilters: SegmentFilter
    totalRecipients: number
    scheduledAt: string | null
  }) => Campaign

  updateCampaign: (id: string, data: Partial<Pick<Campaign, 'name' | 'description' | 'goal' | 'templateId' | 'templateName' | 'segmentFilters' | 'scheduledAt'>>) => void
  deleteCampaign: (id: string) => void
  cancelCampaign: (id: string) => void

  createTemplate: (data: {
    name: string
    category: TemplateCategory
    type: TemplateType
    content: string
    variables: string[]
    mediaUrl?: string
    buttonText?: string
  }) => Template

  updateTemplate: (id: string, data: Partial<Pick<Template, 'name' | 'category' | 'type' | 'content' | 'variables' | 'mediaUrl' | 'buttonText'>>) => void
  deleteTemplate: (id: string) => void
  toggleTemplateActive: (id: string) => void
}

let nextCampaignId = 6
let nextTemplateId = 7

export const useCampaignStore = create<CampaignState>((set) => ({
  campaigns: [...MOCK_CAMPAIGNS],
  templates: [...MOCK_TEMPLATES],
  campaignStats: { ...MOCK_CAMPAIGN_STATS },
  selectedCampaignId: null,

  selectCampaign: (id) => set({ selectedCampaignId: id }),

  createCampaign: (data) => {
    const now = new Date().toISOString()
    const campaign: Campaign = {
      id: `c${nextCampaignId++}`,
      name: data.name,
      description: data.description,
      goal: data.goal,
      status: data.scheduledAt ? 'scheduled' : 'draft',
      channel: 'whatsapp',
      templateId: data.templateId,
      templateName: data.templateName,
      segmentFilters: data.segmentFilters,
      totalRecipients: data.totalRecipients,
      sentCount: 0,
      deliveredCount: 0,
      readCount: 0,
      repliedCount: 0,
      failedCount: 0,
      scheduledAt: data.scheduledAt,
      startedAt: null,
      completedAt: null,
      createdBy: 'Admin User',
      createdAt: now,
    }
    set((s) => ({
      campaigns: [campaign, ...s.campaigns],
      campaignStats: {
        ...s.campaignStats,
        [campaign.id]: {
          campaignId: campaign.id,
          sent: 0,
          delivered: 0,
          read: 0,
          replied: 0,
          failed: 0,
          timeline: [{ timestamp: now, event: 'Campaign dibuat' }],
          failedRecipients: [],
        },
      },
    }))
    return campaign
  },

  updateCampaign: (id, data) =>
    set((s) => ({
      campaigns: s.campaigns.map((c) => (c.id === id ? { ...c, ...data } : c)),
    })),

  deleteCampaign: (id) =>
    set((s) => {
      const { [id]: _removed, ...rest } = s.campaignStats
      return {
        campaigns: s.campaigns.filter((c) => c.id !== id),
        campaignStats: rest,
        selectedCampaignId: s.selectedCampaignId === id ? null : s.selectedCampaignId,
      }
    }),

  cancelCampaign: (id) =>
    set((s) => ({
      campaigns: s.campaigns.map((c) =>
        c.id === id ? { ...c, status: 'cancelled' as CampaignStatus } : c,
      ),
    })),

  createTemplate: (data) => {
    const now = new Date().toISOString()
    const template: Template = {
      id: `t${nextTemplateId++}`,
      name: data.name,
      category: data.category,
      type: data.type,
      content: data.content,
      variables: data.variables,
      mediaUrl: data.mediaUrl,
      buttonText: data.buttonText,
      isActive: true,
      createdBy: 'Admin User',
      createdAt: now,
      updatedAt: now,
    }
    set((s) => ({ templates: [template, ...s.templates] }))
    return template
  },

  updateTemplate: (id, data) =>
    set((s) => ({
      templates: s.templates.map((t) =>
        t.id === id ? { ...t, ...data, updatedAt: new Date().toISOString() } : t,
      ),
    })),

  deleteTemplate: (id) =>
    set((s) => ({
      templates: s.templates.filter((t) => t.id !== id),
    })),

  toggleTemplateActive: (id) =>
    set((s) => ({
      templates: s.templates.map((t) =>
        t.id === id ? { ...t, isActive: !t.isActive } : t,
      ),
    })),
}))
