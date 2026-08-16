import { apiClient } from '@/lib/apiClient'

export const adminFraudService = {
  async getAlerts(page = 1, limit = 20) {
    const response = await apiClient.get(`/fraud/alerts?page=${page}&limit=${limit}`)
    return response.data
  },

  async getRules() {
    const response = await apiClient.get('/fraud/rules')
    return response.data
  },

  async createRule(data: Record<string, unknown>) {
    const response = await apiClient.post('/fraud/rules', data)
    return response.data
  },

  async updateRule(id: string, data: Record<string, unknown>) {
    const response = await apiClient.patch(`/fraud/rules/${id}`, data)
    return response.data
  },
}
