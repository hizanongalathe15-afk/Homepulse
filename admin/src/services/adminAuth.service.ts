import { apiClient } from '@/lib/apiClient'

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  admin: {
    id: string
    email: string
    name: string
    role: string
    permissions: string[]
  }
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
