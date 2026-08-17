import { apiClient } from '@/lib/apiClient'
import type {
  AdCampaign,
  CreateAdCampaignInput,
  UpdateAdCampaignInput,
  AdCampaignFilters,
  AdCampaignStats,
} from '@/types/ad.types'

export const adminAdService = {
  async getAdCampaigns(filters?: AdCampaignFilters) {
    const params = new URLSearchParams()
    if (filters?.status) params.set('status', filters.status)
    if (filters?.targetType) params.set('targetType', filters.targetType)
    if (filters?.search) params.set('search', filters.search)
    if (filters?.page) params.set('page', String(filters.page))
    if (filters?.limit) params.set('limit', String(filters.limit))

    const response = await apiClient.get(`/ads?${params.toString()}`)
    return response.data
  },

  async getAdCampaign(id: string): Promise<AdCampaign> {
    const response = await apiClient.get(`/ads/${id}`)
    return response.data.data
  },

  async createAdCampaign(input: CreateAdCampaignInput): Promise<AdCampaign> {
    const response = await apiClient.post('/ads', input)
    return response.data.data
  },

  async updateAdCampaign(id: string, data: UpdateAdCampaignInput): Promise<AdCampaign> {
    const response = await apiClient.put(`/ads/${id}`, data)
    return response.data.data
  },

  async deleteAdCampaign(id: string): Promise<void> {
    await apiClient.delete(`/ads/${id}`)
  },

  async recordImpression(id: string) {
    const response = await apiClient.post(`/ads/${id}/impression`)
    return response.data
  },

  async recordClick(id: string) {
    const response = await apiClient.post(`/ads/${id}/click`)
    return response.data
  },

  async getActiveAdCampaigns() {
    const response = await apiClient.get('/ads/active')
    return response.data
  },

  async getAdCampaignStats(): Promise<AdCampaignStats> {
    const response = await apiClient.get('/ads/stats')
    return response.data.data
  },
}
