import { apiClient } from '@/lib/apiClient'

export interface DashboardStats {
  totalUsers: number
  totalProperties: number
  totalListings: number
  totalRevenue: number
  activeListings: number
  pendingApprovals: number
  totalPayments: number
  recentActivity: Array<{ id: string; type: string; message: string; timestamp: string }>
}

export const adminDashboardService = {
  async getStats(): Promise<DashboardStats> {
    const response = await apiClient.get('/admin/dashboard')
    return response.data.data
  },
}
