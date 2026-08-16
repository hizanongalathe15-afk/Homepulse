'use client'

import { useMemo } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthProvider'
import { hasPermission, ROLE_PERMISSIONS, PERMISSIONS } from '@/utils/admin.permissions'
import type { Admin } from '@/types/admin.types'

export function useAdminPermissions() {
  const { admin } = useAdminAuth()

  const permissions = useMemo(() => {
    if (!admin) return []
    if (admin.role === 'super_admin') return Object.values(PERMISSIONS)
    return admin.permissions
  }, [admin])

  const can = useMemo(() => {
    return {
      readUsers: hasPermission(admin, PERMISSIONS.USERS_READ),
      writeUsers: hasPermission(admin, PERMISSIONS.USERS_WRITE),
      deleteUsers: hasPermission(admin, PERMISSIONS.USERS_DELETE),
      readProperties: hasPermission(admin, PERMISSIONS.PROPERTIES_READ),
      writeProperties: hasPermission(admin, PERMISSIONS.PROPERTIES_WRITE),
      deleteProperties: hasPermission(admin, PERMISSIONS.PROPERTIES_DELETE),
      readPayments: hasPermission(admin, PERMISSIONS.PAYMENTS_READ),
      writePayments: hasPermission(admin, PERMISSIONS.PAYMENTS_WRITE),
      refundPayments: hasPermission(admin, PERMISSIONS.PAYMENTS_REFUND),
      readDisputes: hasPermission(admin, PERMISSIONS.DISPUTES_READ),
      writeDisputes: hasPermission(admin, PERMISSIONS.DISPUTES_WRITE),
      resolveDisputes: hasPermission(admin, PERMISSIONS.DISPUTES_RESOLVE),
      readSettings: hasPermission(admin, PERMISSIONS.SETTINGS_READ),
      writeSettings: hasPermission(admin, PERMISSIONS.SETTINGS_WRITE),
      readReports: hasPermission(admin, PERMISSIONS.REPORTS_READ),
      generateReports: hasPermission(admin, PERMISSIONS.REPORTS_GENERATE),
      readAudit: hasPermission(admin, PERMISSIONS.AUDIT_READ),
      writeContent: hasPermission(admin, PERMISSIONS.CONTENT_WRITE),
    }
  }, [admin])

  const isSuperAdmin = admin?.role === 'super_admin'
  const isAdmin = admin?.role === 'admin'
  const isModerator = admin?.role === 'moderator'

  return {
    admin,
    permissions,
    can,
    isSuperAdmin,
    isAdmin,
    isModerator,
  }
}
