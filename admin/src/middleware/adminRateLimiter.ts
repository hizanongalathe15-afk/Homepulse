import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function adminRateLimiter(maxRequests = 100, windowMs = 60000) {
  const requests = new Map<string, { count: number; resetTime: number }>()

  return (request: NextRequest) => {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    const now = Date.now()
    const clientData = requests.get(ip)

    if (!clientData || now > clientData.resetTime) {
      requests.set(ip, { count: 1, resetTime: now + windowMs })
      return NextResponse.next()
    }

    clientData.count++

    if (clientData.count > maxRequests) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }

    return NextResponse.next()
  }
}
