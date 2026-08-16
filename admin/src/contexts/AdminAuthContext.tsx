import type { Admin } from '@/types/admin.types'
import { createContext, useContext } from 'react'

export interface AdminAuthState {
  admin: Admin | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface AdminAuthContextValue extends AdminAuthState {
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
}

export const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined)

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}
