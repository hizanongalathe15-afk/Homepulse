'use client'

import { useAdminAuth } from '@/contexts/AdminAuthProvider'

export function useAdminAuthState() {
  const { admin, isAuthenticated, isLoading } = useAdminAuth()
  return { admin, isAuthenticated, isLoading }
}
