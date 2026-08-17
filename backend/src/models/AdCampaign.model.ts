export class AdCampaignModel {
  id: string
  title: string
  description?: string
  imageUrl?: string
  linkUrl?: string
  targetPage?: string
  targetType?: string
  targetId?: string
  startDate: Date
  endDate: Date
  budget: number
  spent: number
  impressions: number
  clicks: number
  status: string
  priority: number
  createdBy?: string
  metadata?: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
}

export class CreateAdCampaignData {
  title: string
  description?: string
  imageUrl?: string
  linkUrl?: string
  targetPage?: string
  targetType?: string
  targetId?: string
  startDate: Date
  endDate: Date
  budget: number
  priority?: number
  metadata?: Record<string, unknown>
}

export class UpdateAdCampaignData {
  title?: string
  description?: string
  imageUrl?: string
  linkUrl?: string
  targetPage?: string
  targetType?: string
  targetId?: string
  startDate?: Date
  endDate?: Date
  budget?: number
  status?: string
  priority?: number
  metadata?: Record<string, unknown>
}

export class AdCampaignFilters {
  status?: string
  targetType?: string
  page?: number
  limit?: number
  offset?: number
  search?: string
}
