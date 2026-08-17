import { apiClient } from '@/lib/apiClient'
import type { SubscriptionPlan, Subscription } from '@/types/subscription.types'

export const subscriptionService = {
  async getPlans(activeOnly = true): Promise<SubscriptionPlan[]> {
    const response = await apiClient.get(`/subscriptions/plans?activeOnly=${activeOnly}`)
    return response.data
  },

  async getPlan(planId: string): Promise<SubscriptionPlan> {
    const response = await apiClient.get(`/subscriptions/plans/${planId}`)
    return response.data
  },

  async createPlan(data: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
    const response = await apiClient.post('/subscriptions/plans', data)
    return response.data
  },

  async updatePlan(planId: string, data: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
    const response = await apiClient.put(`/subscriptions/plans/${planId}`, data)
    return response.data
  },

  async deletePlan(planId: string): Promise<void> {
    await apiClient.delete(`/subscriptions/plans/${planId}`)
  },

  async getUserSubscription(userId: string): Promise<Subscription | null> {
    const response = await apiClient.get(`/subscriptions/user/${userId}`)
    return response.data
  },

  async createSubscription(data: any): Promise<Subscription> {
    const response = await apiClient.post('/subscriptions', data)
    return response.data
  },

  async cancelSubscription(subscriptionId: string): Promise<any> {
    const response = await apiClient.post(`/subscriptions/${subscriptionId}/cancel`)
    return response.data
  },

  async renewSubscription(subscriptionId: string): Promise<Subscription> {
    const response = await apiClient.post(`/subscriptions/${subscriptionId}/renew`)
    return response.data
  },

  async getRevenueStats(days: number = 30): Promise<any> {
    const response = await apiClient.get(`/subscriptions/revenue/stats?days=${days}`)
    return response.data
  },

  async getPopularPlans(): Promise<any[]> {
    const response = await apiClient.get('/subscriptions/revenue/popular-plans')
    return response.data
  },

  async getUserRevenue(userId: string): Promise<any> {
    const response = await apiClient.get(`/subscriptions/revenue/user/${userId}`)
    return response.data
  },
}
