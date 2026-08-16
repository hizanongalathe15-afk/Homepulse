'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link href="/" className="flex justify-center">
            <span className="text-3xl font-bold text-slate-900">HomePulse</span>
          </Link>
          <p className="mt-2 text-center text-sm text-slate-600">
            Admin Management Portal
          </p>
        </div>
        <div className="bg-white py-8 px-6 shadow-sm rounded-lg border border-slate-200">
          {children}
        </div>
      </div>
    </div>
  )
}
