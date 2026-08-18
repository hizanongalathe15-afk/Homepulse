'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AdminInput } from '@/components/ui/AdminInput'
import { AdminButton } from '@/components/ui/AdminButton'
import { Mail, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Failed to send reset link')
      }

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/login" className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900">
          <ArrowLeft size={16} className="mr-2" />
          Back to login
        </Link>
      </div>

      <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">Reset your password</h2>
      <p className="text-center text-sm text-slate-600 mb-6">
        Enter your email address and we will send you a reset link
      </p>

      {success ? (
        <div className="mt-8 space-y-6">
          <div className="p-4 rounded-md bg-green-50 border border-green-200 text-green-700 text-sm">
            If an account with that email exists, we have sent a password reset link.
          </div>
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="w-full admin-btn-primary"
          >
            Return to login
          </button>
        </div>
      ) : (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Email address
            </label>
            <div className="relative">
              <AdminInput
                id="email"
                name="email"
                type="email"
                required
                placeholder="admin@homepulse.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            </div>
          </div>

          <button type="submit" className="w-full admin-btn-primary" disabled={loading}>
            {loading ? 'Sending...' : 'Send reset link'}
          </button>

          <p className="text-center text-sm text-slate-600">
            Remember your password?{' '}
            <Link href="/login" className="font-medium text-primary hover:text-primary/80">
              Sign in
            </Link>
          </p>
        </form>
      )}
    </div>
  )
}
