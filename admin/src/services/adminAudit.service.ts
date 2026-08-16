import { apiClient } from '@/lib/apiClient'

export const adminAuditService = {
  async getAuditLogs(page = 1, limit = 20, filters?: Record<string, unknown>) {
    const params = new URLSearchParams()
    params.set('page', String(page))
    params.set('limit', String(limit))
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, String(value))
      })
    }

    const response = await apiClient.get(`/audit?${params.toString()}`)
    return response.data
  },

  async getAuditLog(id: string) {
    const response = await apiClient.get(`/audit/${id}`)
    return response.data
  },
}
