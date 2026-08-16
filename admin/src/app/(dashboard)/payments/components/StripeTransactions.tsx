'use client'

import { useState } from 'react'
import { SectionCard } from '@/components/features/SectionCard'
import { StatusBadge } from '@/components/ui/StatusBadge'

const charges = [
  { id: 'pi_3QXt8kL9ZX', customer: 'cus_1012 (Diana Njeri)', amount: 12480, card: 'Visa •••• 4242', status: 'succeeded', date: '2026-08-13' },
  { id: 'pi_3QXt2kL7ZX', customer: 'cus_1018 (Grace Muthoni)', amount: 3200, card: 'Mastercard •••• 5510', status: 'succeeded', date: '2026-08-11' },
  { id: 'pi_3QXs9kL1ZX', customer: 'cus_1022 (Samuel Kariuki)', amount: 25000, card: 'Visa •••• 4812', status: 'pending', date: '2026-08-14' },
]

export default function StripeTransactions() {
  const [refreshed, setRefreshed] = useState(false)

  return (
    <SectionCard
      title="Stripe Transactions"
      description="Card charges processed through Stripe"
      action={refreshed ? <StatusBadge variant="success" label="Synced" /> : <StatusBadge variant="info" label="Awaiting sync" />}
    >
      <div className="space-y-3">
        {charges.map((charge) => (
          <div key={charge.id} className="flex items-center justify-between rounded-md border border-slate-100 p-3">
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
        <button onClick={() => setRefreshed(true)} className="admin-btn-secondary w-full">
          Sync from Stripe
        </button>
      </div>
    </SectionCard>
  )
}