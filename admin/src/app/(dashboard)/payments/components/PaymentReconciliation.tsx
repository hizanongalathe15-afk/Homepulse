'use client'

import { useState } from 'react'
import { RefreshCcw } from 'lucide-react'
import { SectionCard } from '@/components/features/SectionCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { AdminButton } from '@/components/ui/AdminButton'

const accounts = [
  { gateway: 'M-Pesa Paybill', total: 412000, settled: 396400, difference: 15600, status: 'unreconciled' },
  { gateway: 'Stripe', total: 214000, settled: 214000, difference: 0, status: 'matched' },
  { gateway: 'Bank Transfer', total: 148000, settled: 141800, difference: 6200, status: 'unreconciled' },
]

export default function PaymentReconciliation() {
  const [reconciled, setReconciled] = useState(false)

  return (
    <SectionCard
      title="Reconciliation"
      description="Match platform transactions against gateway settlements"
      action={<StatusBadge variant={reconciled ? 'success' : 'warning'} label={reconciled ? 'Balanced' : 'Discrepancies'} />}
    >
      <div className="divide-y divide-slate-100">
        {accounts.map((account) => (
          <div key={account.gateway} className="py-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-800">{account.gateway}</span>
              <StatusBadge variant={account.difference === 0 ? 'success' : 'warning'} label={account.status} />
            </div>
            <div className="grid grid-cols-3 gap-3 mt-2 text-sm">
              <div>
                <p className="text-xs text-slate-400">Platform</p>
                <p className="text-slate-900 font-medium">${account.total.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Settled</p>
                <p className="text-slate-900 font-medium">${account.settled.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Difference</p>
                <p className={`font-medium ${account.difference === 0 ? 'text-green-600' : 'text-amber-600'}`}>
                  ${account.difference.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <AdminButton className="w-full mt-4" variant={reconciled ? 'outline' : 'default'} onClick={() => setReconciled(true)}>
        <RefreshCcw size={14} className="mr-1.5" /> {reconciled ? 'Re-run Reconciliation' : 'Run Reconciliation'}
      </AdminButton>
    </SectionCard>
  )
}