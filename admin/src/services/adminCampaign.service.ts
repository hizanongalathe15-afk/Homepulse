import { apiClient } from '@/lib/apiClient'

export const adminCampaignService = {
  async getCampaigns(page = 1, limit = 20) {
    const response = await apiClient.get(`/campaigns?page=${page}&limit=${limit}`)
    return response.data
  },

  async getCampaign(id: string) {
    const response = await apiClient.get(`/campaigns/${id}`)
    return response.data
  },

  async createCampaign(data: Record<string, unknown>) {
    const response = await apiClient.post('/campaigns', data)
    return response.data
  },

  async updateCampaign(id: string, data: Record<string, unknown>) {
    const response = await apiClient.patch(`/campaigns/${id}`, data)
    return response.data
  },

  async deleteCampaign(id: string) {
    await apiClient.delete(`/campaigns/${id}`)
  },
}
