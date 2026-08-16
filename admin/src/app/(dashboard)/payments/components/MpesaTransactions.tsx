'use client'

import { useState } from 'react'
import { SectionCard } from '@/components/features/SectionCard'
import { StatusBadge } from '@/components/ui/StatusBadge'

interface MpesaTx {
  receipt: string
  phone: string
  amount: number
  status: 'completed' | 'pending' | 'failed'
  date: string
}

const initial: MpesaTx[] = [
  { receipt: 'QF2K98M1P2', phone: '+254712345678', amount: 4500, status: 'completed', date: '2026-08-14' },
  { receipt: 'QF2K98M1B4', phone: '+254723456789', amount: 850, status: 'completed', date: '2026-08-14' },
  { receipt: 'QF2K97J4N9', phone: '+254745678901', amount: 1200, status: 'pending', date: '2026-08-13' },
  { receipt: 'QF2K96K3P1', phone: '+254756789012', amount: 3200, status: 'failed', date: '2026-08-12' },
]

export default function MpesaTransactions() {
  const [transactions, setTransactions] = useState(initial)

  const verify = (receipt: string) => {
    setTransactions((prev) => prev.map((t) => (t.receipt === receipt ? { ...t, status: 'completed' as const } : t)))
  }

  return (
    <SectionCard title="M-Pesa Transactions" description="STK push and paybill transactions">
      <div className="space-y-3">
        {transactions.map((tx) => (
          <div key={tx.receipt} className="flex items-center justify-between rounded-md border border-slate-100 p-3">
            <div>
              <p className="font-mono text-xs font-medium text-slate-800">{tx.receipt}</p>
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
      </div>
    </SectionCard>
  )
}