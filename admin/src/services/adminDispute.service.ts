import { apiClient } from '@/lib/apiClient'
import type { Dispute } from '@/types/dispute.types'

export interface DisputeFilters {
  status?: Dispute['status']
  type?: Dispute['type']
  priority?: Dispute['priority']
  search?: string
  dateFrom?: string
  dateTo?: string
}

export const adminDisputeService = {
  async getDisputes(filters?: DisputeFilters, page = 1, limit = 20) {
    const params = new URLSearchParams()
    if (filters?.status) params.set('status', filters.status)
    if (filters?.type) params.set('type', filters.type)
    if (filters?.priority) params.set('priority', filters.priority)
    if (filters?.search) params.set('search', filters.search)
    params.set('page', String(page))
    params.set('limit', String(limit))

    const response = await apiClient.get(`/disputes?${params.toString()}`)
    return response.data
  },

  async getDispute(id: string): Promise<Dispute> {
    const response = await apiClient.get(`/disputes/${id}`)
    return response.data
  },

  async resolveDispute(id: string, resolution: string, action: string) {
    const response = await apiClient.post(`/disputes/${id}/resolve`, { resolution, action })
    return response.data
  },

  async assignDispute(id: string, adminId: string) {
    const response = await apiClient.post(`/disputes/${id}/assign`, { adminId })
    return response.data
  },
}
