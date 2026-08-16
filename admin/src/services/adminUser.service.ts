import { apiClient } from '@/lib/apiClient'
import type { User, UserFilters } from '@/types/user.types'

export interface CreateUserInput {
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
  role: User['role']
}

export const adminUserService = {
  async getUsers(filters?: UserFilters, page = 1, limit = 20) {
    const params = new URLSearchParams()
    if (filters?.search) params.set('search', filters.search)
    if (filters?.role) params.set('role', filters.role)
    if (filters?.status) params.set('status', filters.status)
    params.set('page', String(page))
    params.set('limit', String(limit))

    const response = await apiClient.get(`/users?${params.toString()}`)
    return response.data
  },

  async getUser(id: string): Promise<User> {
    const response = await apiClient.get(`/users/${id}`)
    return response.data
  },

  async createUser(input: CreateUserInput): Promise<User> {
    const response = await apiClient.post('/users', input)
    return response.data
  },

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const response = await apiClient.patch(`/users/${id}`, data)
    return response.data
  },

  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`)
  },

  async suspendUser(id: string, reason: string): Promise<void> {
    await apiClient.post(`/users/${id}/suspend`, { reason })
  },

  async updateUserRole(id: string, role: User['role']): Promise<User> {
    const response = await apiClient.patch(`/users/${id}/role`, { role })
    return response.data
  },
}
