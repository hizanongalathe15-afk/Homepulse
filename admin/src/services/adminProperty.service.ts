import { apiClient } from '@/lib/apiClient'
import type { Property, PropertyFilters } from '@/types/property.types'

export interface CreatePropertyInput {
  title: string
  description?: string
  type: string
  price: number
  currency: string
  city: string
  neighborhood?: string
  address?: string
  landlordId: string
  images: string[]
  amenities: string[]
}

export const adminPropertyService = {
  async getProperties(filters?: PropertyFilters, page = 1, limit = 20) {
    const params = new URLSearchParams()
    if (filters?.search) params.set('search', filters.search)
    if (filters?.type) params.set('type', filters.type)
    if (filters?.status) params.set('status', filters.status)
    if (filters?.city) params.set('city', filters.city)
    params.set('page', String(page))
    params.set('limit', String(limit))

    const response = await apiClient.get(`/properties?${params.toString()}`)
    return response.data
  },

  async getProperty(id: string): Promise<Property> {
    const response = await apiClient.get(`/properties/${id}`)
    return response.data
  },

  async createProperty(input: CreatePropertyInput): Promise<Property> {
    const response = await apiClient.post('/properties', input)
    return response.data
  },

  async updateProperty(id: string, data: Partial<Property>): Promise<Property> {
    const response = await apiClient.patch(`/properties/${id}`, data)
    return response.data
  },

  async deleteProperty(id: string): Promise<void> {
    await apiClient.delete(`/properties/${id}`)
  },

  async approveProperty(id: string): Promise<Property> {
    const response = await apiClient.post(`/properties/${id}/approve`)
    return response.data
  },

  async rejectProperty(id: string, reason: string): Promise<Property> {
    const response = await apiClient.post(`/properties/${id}/reject`, { reason })
    return response.data
  },

  async flagProperty(id: string, reason: string): Promise<Property> {
    const response = await apiClient.post(`/properties/${id}/flag`, { reason })
    return response.data
  },
}
