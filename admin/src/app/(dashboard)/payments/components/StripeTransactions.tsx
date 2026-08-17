'use client'

import { useEffect, useState } from 'react'
import { RefreshCw, TrendingUp } from 'lucide-react'
import { SectionCard } from '@/components/features/SectionCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { AdminButton } from '@/components/ui/AdminButton'
import { adminPaymentService } from '@/services/adminPayment.service'

interface StripeCharge {
  id: string
  customer: string
  amount: number
  card: string
  status: string
  date: string
}

export default function StripeTransactions() {
  const [charges, setCharges] = useState<StripeCharge[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [syncing, setSyncing] = useState(false)

  const fetchCharges = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await adminPaymentService.getStripeTransactions(1, 20)
      const data = response.data || []
      const mapped: StripeCharge[] = data.map((c: any) => ({
        id: c.id || c.transactionId,
        customer: c.customerName || `${c.user?.firstName || ''} ${c.user?.lastName || ''}`.trim() || 'Unknown',
        amount: c.amount || 0,
        card: c.cardBrand ? `${c.cardBrand} ending in ${c.cardLast4 || '----'}` : c.card || 'Unknown card',
        status: c.status || 'succeeded',
        date: c.createdAt ? new Date(c.createdAt).toLocaleDateString() : c.date || '',
      }))
      setCharges(mapped)
    } catch (err) {
      setError('Failed to load Stripe transactions')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSync = async () => {
    try {
      setSyncing(true)
      await adminPaymentService.reconcilePayments(
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        new Date().toISOString().split('T')[0]
      )
      await fetchCharges()
    } catch (err) {
      console.error('Sync failed:', err)
    } finally {
      setSyncing(false)
    }
  }

  useEffect(() => {
    fetchCharges()
  }, [])

  if (loading) {
    return (
      <SectionCard title="Stripe Transactions" description="Card charges processed through Stripe">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </SectionCard>
    )
  }

  return (
    <SectionCard
      title="Stripe Transactions"
      description="Card charges processed through Stripe"
      action={
        <div className="flex items-center gap-2">
          <StatusBadge variant={charges.length > 0 ? 'success' : 'info'} label={charges.length > 0 ? 'Synced' : 'Awaiting sync'} />
          <AdminButton size="sm" variant="ghost" onClick={handleSync} loading={syncing}>
            <RefreshCw size={14} className="mr-1" />
            Sync
          </AdminButton>
        </div>
      }
    >
      <div className="space-y-3">
        {charges.map((charge) => (
          <div key={charge.id} className="flex items-center justify-between rounded-md border border-slate-100 p-3 glass-card">
            <div>
              <p className="font-mono text-xs font-medium text-slate-800">{charge.id}</p>
              <p className="text-xs text-slate-400">{charge.customer} · {charge.card} · {charge.date}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900">${(charge.amount / 100).toFixed(2)}</span>
              <StatusBadge
                variant={charge.status === 'succeeded' ? 'success' : 'warning'}
                label={charge.status}
              />
            </div>
          </div>
        ))}
        {charges.length === 0 && !error && (
          <p className="text-sm text-slate-500 py-4">No Stripe transactions found</p>
        )}
        {error && (
          <p className="text-sm text-red-500 py-4">{error}</p>
        )}
      </div>
    </SectionCard>
  )
}