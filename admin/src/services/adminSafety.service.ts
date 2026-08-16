import { apiClient } from '@/lib/apiClient'

export const adminSafetyService = {
  async getSOSAlerts(page = 1, limit = 20) {
    const response = await apiClient.get(`/safety/sos?page=${page}&limit=${limit}`)
    return response.data
  },

  async getIncidents(page = 1, limit = 20) {
    const response = await apiClient.get(`/safety/incidents?page=${page}&limit=${limit}`)
    return response.data
  },

  async getSafetyScores() {
    const response = await apiClient.get('/safety/scores')
    return response.data
  },
}
