import { apiClient } from '@/lib/apiClient'
import type { Banner } from '@/types/banner.types'

export const adminBannerService = {
  async getBanners(page = 1, limit = 20) {
    const response = await apiClient.get(`/banners?page=${page}&limit=${limit}`)
    return response.data
  },

  async getBanner(id: string): Promise<Banner> {
    const response = await apiClient.get(`/banners/${id}`)
    return response.data
  },

  async createBanner(data: Omit<Banner, 'id' | 'createdAt' | 'impressions' | 'clicks' | 'ctr'>) {
    const response = await apiClient.post('/banners', data)
    return response.data
  },

  async updateBanner(id: string, data: Partial<Banner>) {
    const response = await apiClient.patch(`/banners/${id}`, data)
    return response.data
  },

  async deleteBanner(id: string) {
    await apiClient.delete(`/banners/${id}`)
  },
}
