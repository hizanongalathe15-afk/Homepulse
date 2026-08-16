import { apiClient } from '@/lib/apiClient'
import type { QRCode } from '@/types/qr.types'

export const adminQRService = {
  async getQRCodes(page = 1, limit = 20) {
    const response = await apiClient.get(`/qr?page=${page}&limit=${limit}`)
    return response.data
  },

  async getQR(id: string): Promise<QRCode> {
    const response = await apiClient.get(`/qr/${id}`)
    return response.data
  },

  async generateQR(data: { propertyId?: string; type: QRCode['type']; expiresAt?: Date }) {
    const response = await apiClient.post('/qr/generate', data)
    return response.data
  },

  async deleteQR(id: string) {
    await apiClient.delete(`/qr/${id}`)
  },
}
