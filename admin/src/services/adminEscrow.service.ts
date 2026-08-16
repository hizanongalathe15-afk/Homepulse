import { apiClient } from '@/lib/apiClient'

export const adminEscrowService = {
  async getEscrows(page = 1, limit = 20) {
    const response = await apiClient.get(`/escrow?page=${page}&limit=${limit}`)
    return response.data
  },

  async getEscrow(id: string) {
    const response = await apiClient.get(`/escrow/${id}`)
    return response.data
  },

  async releaseEscrow(id: string) {
    const response = await apiClient.post(`/escrow/${id}/release`)
    return response.data
  },

  async refundEscrow(id: string, reason: string) {
    const response = await apiClient.post(`/escrow/${id}/refund`, { reason })
    return response.data
  },
}
