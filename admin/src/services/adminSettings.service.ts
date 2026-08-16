import { apiClient } from '@/lib/apiClient'

export const adminSettingsService = {
  async getSettings() {
    const response = await apiClient.get('/settings')
    return response.data
  },

  async updateSettings(data: Record<string, unknown>) {
    const response = await apiClient.patch('/settings', data)
    return response.data
  },

  async getMpesaConfig() {
    const response = await apiClient.get('/settings/mpesa')
    return response.data
  },

  async updateMpesaConfig(data: Record<string, unknown>) {
    const response = await apiClient.patch('/settings/mpesa', data)
    return response.data
  },

  async getStripeConfig() {
    const response = await apiClient.get('/settings/stripe')
    return response.data
  },

  async updateStripeConfig(data: Record<string, unknown>) {
    const response = await apiClient.patch('/settings/stripe', data)
    return response.data
  },
}
