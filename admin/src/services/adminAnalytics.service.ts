import { apiClient } from '@/lib/apiClient'
import type { AnalyticsOverview, RevenueAnalytics, UserAnalytics, PropertyAnalytics } from '@/types/analytics.types'

export const adminAnalyticsService = {
  async getOverview(): Promise<AnalyticsOverview> {
    const response = await apiClient.get('/analytics/overview')
    return response.data
  },

  async getRevenueAnalytics(dateFrom: string, dateTo: string): Promise<RevenueAnalytics> {
    const response = await apiClient.get(`/analytics/revenue?from=${dateFrom}&to=${dateTo}`)
    return response.data
  },

  async getUserAnalytics(dateFrom: string, dateTo: string): Promise<UserAnalytics> {
    const response = await apiClient.get(`/analytics/users?from=${dateFrom}&to=${dateTo}`)
    return response.data
  },

  async getPropertyAnalytics(dateFrom: string, dateTo: string): Promise<PropertyAnalytics> {
    const response = await apiClient.get(`/analytics/properties?from=${dateFrom}&to=${dateTo}`)
    return response.data
  },

  async getMostVisitedPages(limit: number = 20): Promise<Array<{ page: string; visits: number }>> {
    const response = await apiClient.get(`/analytics/most-visited?limit=${limit}`)
    return response.data
  },

  async getVisitTrends(days: number = 30): Promise<Array<{ date: string; visits: number }>> {
    const response = await apiClient.get(`/analytics/visit-trends?days=${days}`)
    return response.data
  },

  async getMostFollowedProperties(limit: number = 10): Promise<Array<{ propertyId: string; saves: number }>> {
    const response = await apiClient.get(`/analytics/most-followed?limit=${limit}`)
    return response.data
  },
}
