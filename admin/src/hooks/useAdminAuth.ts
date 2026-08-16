'use client'

import { useAdminAuth } from '@/contexts/AdminAuthContext'

export function useAdminAuthState() {
  const { admin, isAuthenticated, isLoading } = useAdminAuth()
  return { admin, isAuthenticated, isLoading }
}
