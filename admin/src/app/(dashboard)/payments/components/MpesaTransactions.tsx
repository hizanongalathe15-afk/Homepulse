'use client'

import { useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { SectionCard } from '@/components/features/SectionCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { AdminButton } from '@/components/ui/AdminButton'
import { adminPaymentService } from '@/services/adminPayment.service'

interface MpesaTransaction {
  id: string
  phone: string
  amount: number
  status: string
  date: string
}

export default function MpesaTransactions() {
  const [transactions, setTransactions] = useState<MpesaTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [syncing, setSyncing] = useState(false)

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await adminPaymentService.getMpesaTransactions(1, 20)
      const data = response.data || []
      const mapped: MpesaTransaction[] = data.map((tx: any) => ({
        id: tx.id || tx.transactionId,
        phone: tx.phoneNumber || tx.phone,
        amount: tx.amount || 0,
        status: tx.status || 'pending',
        date: tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : tx.date || '',
      }))
      setTransactions(mapped)
    } catch (err) {
      setError('Failed to load M-Pesa transactions')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSync = async () => {
    try {
      setSyncing(true)
      await adminPaymentService.reconcilePayments(
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        new Date().toISOString().split('T')[0]
      )
      await fetchTransactions()
    } catch (err) {
      console.error('Sync failed:', err)
    } finally {
      setSyncing(false)
    }
  }

  const verify = async (receipt: string) => {
    try {
      await fetchTransactions()
    } catch (err) {
      console.error('Verify failed:', err)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  if (loading) {
    return (
      <SectionCard title="M-Pesa Transactions" description="Safaricom M-Pesa payments">
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
      title="M-Pesa Transactions"
      description="Safaricom M-Pesa payments"
      action={
        <AdminButton size="sm" variant="ghost" onClick={handleSync} loading={syncing}>
          <RefreshCw size={14} className="mr-1" />
          Sync
        </AdminButton>
      }
    >
      <div className="space-y-3">
        {transactions.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between rounded-md border border-slate-100 p-3 glass-card">
            <div>
              <p className="font-mono text-xs font-medium text-slate-800">{tx.id}</p>
              <p className="text-xs text-slate-400">{tx.phone} · {tx.date}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900">KSh {tx.amount.toLocaleString()}</span>
              <StatusBadge
                variant={tx.status === 'completed' ? 'success' : tx.status === 'failed' ? 'destructive' : 'warning'}
                label={tx.status}
              />
            </div>
          </div>
        ))}
        {transactions.length === 0 && !error && (
          <p className="text-sm text-slate-500 py-4">No M-Pesa transactions found</p>
        )}
        {error && (
          <p className="text-sm text-red-500 py-4">{error}</p>
        )}
      </div>
    </SectionCard>
  )
}
