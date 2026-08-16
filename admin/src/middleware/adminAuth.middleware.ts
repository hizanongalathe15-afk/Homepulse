import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function adminAuthMiddleware(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export function adminAuthMiddlewareOptions(authRequired = true) {
  return (request: NextRequest) => {
    if (!authRequired) return NextResponse.next()

    const token = request.cookies.get('admin_token')?.value
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
  }
}
