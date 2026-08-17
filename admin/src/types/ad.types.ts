export interface AdCampaign {
  id: string
  title: string
  description?: string
  imageUrl?: string
  linkUrl?: string
  targetPage?: string
  targetType?: string
  targetId?: string
  startDate: string
  endDate: string
  budget: number
  spent: number
  impressions: number
  clicks: number
  status: string
  priority: number
  createdBy?: string
  metadata?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface CreateAdCampaignInput {
  title: string
  description?: string
  imageUrl?: string
  linkUrl?: string
  targetPage?: string
  targetType?: string
  targetId?: string
  startDate: string
  endDate: string
  budget: number
  priority?: number
  metadata?: Record<string, unknown>
}

export interface UpdateAdCampaignInput {
  title?: string
  description?: string
  imageUrl?: string
  linkUrl?: string
  targetPage?: string
  targetType?: string
  targetId?: string
  startDate?: string
  endDate?: string
  budget?: number
  status?: string
  priority?: number
  metadata?: Record<string, unknown>
}

export interface AdCampaignFilters {
  status?: string
  targetType?: string
  search?: string
  page?: number
  limit?: number
}

export interface AdCampaignStats {
  totalCampaigns: number
  activeCampaigns: number
  totalImpressions: number
  totalClicks: number
  ctr: number
}
