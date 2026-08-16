import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { PERMISSIONS } from '@/utils/admin.permissions'

const permissionMap: Record<string, string[]> = {
  '/users': [PERMISSIONS.USERS_READ],
  '/properties': [PERMISSIONS.PROPERTIES_READ],
  '/payments': [PERMISSIONS.PAYMENTS_READ],
  '/disputes': [PERMISSIONS.DISPUTES_READ],
  '/settings': [PERMISSIONS.SETTINGS_READ],
  '/reports': [PERMISSIONS.REPORTS_READ],
  '/audit-logs': [PERMISSIONS.AUDIT_READ],
}

export function adminPermissionsMiddleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const token = request.cookies.get('admin_token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  for (const [route, requiredPermissions] of Object.entries(permissionMap)) {
    if (pathname.startsWith(route)) {
      const adminPermissions = request.headers.get('x-admin-permissions')?.split(',') || []
      const hasPermission = requiredPermissions.some((p) => adminPermissions.includes(p))

      if (!hasPermission) {
        return NextResponse.json(
          { error: 'Forbidden' },
          { status: 403 }
        )
      }
    }
  }

  return NextResponse.next()
}
