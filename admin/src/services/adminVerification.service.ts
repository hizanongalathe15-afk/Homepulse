import { apiClient } from '@/lib/apiClient'

export const adminVerificationService = {
  async getVerifications(page = 1, limit = 20) {
    const response = await apiClient.get(`/verifications?page=${page}&limit=${limit}`)
    return response.data
  },

  async getVerification(id: string) {
    const response = await apiClient.get(`/verifications/${id}`)
    return response.data
  },

  async approveVerification(id: string) {
    const response = await apiClient.post(`/verifications/${id}/approve`)
    return response.data
  },

  async rejectVerification(id: string, reason: string) {
    const response = await apiClient.post(`/verifications/${id}/reject`, { reason })
    return response.data
  },
}
