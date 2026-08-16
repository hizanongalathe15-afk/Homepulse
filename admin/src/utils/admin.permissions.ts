import type { Admin } from '@/types/admin.types'

export const PERMISSIONS = {
  USERS_READ: 'users:read',
  USERS_WRITE: 'users:write',
  USERS_DELETE: 'users:delete',
  PROPERTIES_READ: 'properties:read',
  PROPERTIES_WRITE: 'properties:write',
  PROPERTIES_DELETE: 'properties:delete',
  PAYMENTS_READ: 'payments:read',
  PAYMENTS_WRITE: 'payments:write',
  PAYMENTS_REFUND: 'payments:refund',
  DISPUTES_READ: 'disputes:read',
  DISPUTES_WRITE: 'disputes:write',
  DISPUTES_RESOLVE: 'disputes:resolve',
  SETTINGS_READ: 'settings:read',
  SETTINGS_WRITE: 'settings:write',
  REPORTS_READ: 'reports:read',
  REPORTS_GENERATE: 'reports:generate',
  AUDIT_READ: 'audit:read',
  CONTENT_WRITE: 'content:write',
} as const

export const hasPermission = (admin: Admin | null, permission: string): boolean => {
  if (!admin) return false
  if (admin.role === 'super_admin') return true
  return admin.permissions.includes(permission)
}

export const ROLE_PERMISSIONS = {
  super_admin: Object.values(PERMISSIONS),
  admin: [
    PERMISSIONS.USERS_READ,
    PERMISSIONS.USERS_WRITE,
    PERMISSIONS.PROPERTIES_READ,
    PERMISSIONS.PROPERTIES_WRITE,
    PERMISSIONS.PAYMENTS_READ,
    PERMISSIONS.PAYMENTS_WRITE,
    PERMISSIONS.DISPUTES_READ,
    PERMISSIONS.DISPUTES_WRITE,
    PERMISSIONS.REPORTS_READ,
    PERMISSIONS.REPORTS_GENERATE,
    PERMISSIONS.AUDIT_READ,
    PERMISSIONS.CONTENT_WRITE,
  ],
  moderator: [
    PERMISSIONS.USERS_READ,
    PERMISSIONS.USERS_WRITE,
    PERMISSIONS.PROPERTIES_READ,
    PERMISSIONS.PROPERTIES_WRITE,
    PERMISSIONS.DISPUTES_READ,
    PERMISSIONS.DISPUTES_WRITE,
    PERMISSIONS.AUDIT_READ,
  ],
}
