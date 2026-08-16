import { apiClient } from '@/lib/apiClient'
import type { Admin } from '@/types/admin.types'

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  admin: Admin
}

export const adminAuthService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/login', credentials)
    return response.data
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout')
  },

  async refreshToken(): Promise<{ token: string }> {
    const response = await apiClient.post('/auth/refresh')
    return response.data
  },

  async me(): Promise<AuthResponse['admin']> {
    const response = await apiClient.get('/auth/me')
    return response.data
  },
}
