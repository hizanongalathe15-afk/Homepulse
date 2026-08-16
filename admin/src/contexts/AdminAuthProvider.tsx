'use client'

import { useState, useEffect } from 'react'
import { AdminAuthContext } from './AdminAuthContext'
import type { AdminAuthContextValue } from './AdminAuthContext'
import { adminAuthService } from '@/services/adminAuth.service'
import type { Admin } from '@/types/admin.types'

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!token && !!admin

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
      if (storedToken) {
        try {
          const adminData = await adminAuthService.me()
          setAdmin(adminData)
          setToken(storedToken)
        } catch {
          localStorage.removeItem('admin_token')
        }
      }
      setIsLoading(false)
    }
    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const response = await adminAuthService.login({ email, password })
    setToken(response.token)
    setAdmin(response.admin)
    localStorage.setItem('admin_token', response.token)
  }

  const logout = async () => {
    try {
      await adminAuthService.logout()
    } finally {
      setToken(null)
      setAdmin(null)
      localStorage.removeItem('admin_token')
    }
  }

  const refreshToken = async () => {
    const response = await adminAuthService.refreshToken()
    setToken(response.token)
    localStorage.setItem('admin_token', response.token)
  }

  const value: AdminAuthContextValue = {
    admin,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshToken,
  }

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}
