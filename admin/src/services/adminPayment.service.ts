import { apiClient } from '@/lib/apiClient'
import type { Payment, PaymentFilters } from '@/types/payment.types'

export const adminPaymentService = {
  async getPayments(filters?: PaymentFilters, page = 1, limit = 20) {
    const params = new URLSearchParams()
    if (filters?.search) params.set('search', filters.search)
    if (filters?.method) params.set('method', filters.method)
    if (filters?.status) params.set('status', filters.status)
    if (filters?.type) params.set('type', filters.type)
    params.set('page', String(page))
    params.set('limit', String(limit))

    const response = await apiClient.get(`/payments?${params.toString()}`)
    return response.data
  },

  async getPayment(id: string): Promise<Payment> {
    const response = await apiClient.get(`/payments/${id}`)
    return response.data
  },

  async refundPayment(id: string, amount: number, reason: string): Promise<Payment> {
    const response = await apiClient.post(`/payments/${id}/refund`, { amount, reason })
    return response.data
  },

  async getMpesaTransactions(page = 1, limit = 20) {
    const response = await apiClient.get(`/payments/mpesa?page=${page}&limit=${limit}`)
    return response.data
  },

  async getStripeTransactions(page = 1, limit = 20) {
    const response = await apiClient.get(`/payments/stripe?page=${page}&limit=${limit}`)
    return response.data
  },

  async reconcilePayments(dateFrom: string, dateTo: string) {
    const response = await apiClient.post('/payments/reconcile', { dateFrom, dateTo })
    return response.data
  },
}
