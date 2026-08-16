'use client'

import { createContext, useContext } from 'react'
import type { Admin } from '@/types/admin.types'
import { ROLE_PERMISSIONS, PERMISSIONS } from '@/utils/admin.permissions'

export interface AdminPermissionContextValue {
  admin: Admin | null
  hasPermission: (permission: string) => boolean
  canAccess: (requiredPermissions: string[]) => boolean
}

export const AdminPermissionContext = createContext<AdminPermissionContextValue | undefined>(undefined)

export function useAdminPermissionsContext() {
  const context = useContext(AdminPermissionContext)
  if (context === undefined) {
    throw new Error('useAdminPermissionsContext must be used within an AdminPermissionProvider')
  }
  return context
}
