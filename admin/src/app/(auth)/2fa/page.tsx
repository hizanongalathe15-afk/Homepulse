'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminInput } from '@/components/ui/AdminInput'
import { AdminButton } from '@/components/ui/AdminButton'
import { ShieldCheck } from 'lucide-react'

export default function TwoFactorPage() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/v1/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Invalid code')
      }

      router.push('/overview')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex justify-center mb-6">
        <div className="p-3 rounded-full bg-primary/10">
          <ShieldCheck className="text-primary" size={32} />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">Two-Factor Authentication</h2>
      <p className="text-center text-sm text-slate-600 mb-6">
        Enter the 6-digit code from your authenticator app
      </p>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="code" className="block text-sm font-medium text-slate-700 mb-1">
            Verification Code
          </label>
          <AdminInput
            id="code"
            name="code"
            type="text"
            inputMode="numeric"
            maxLength={6}
            required
            placeholder="000000"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="text-center text-2xl tracking-widest"
          />
        </div>

        <button type="submit" className="w-full admin-btn-primary" disabled={loading || code.length !== 6}>
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </form>
    </div>
  )
}
