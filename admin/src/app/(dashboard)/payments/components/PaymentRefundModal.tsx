'use client'

import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { AdminButton } from '@/components/ui/AdminButton'
import { AdminInput } from '@/components/ui/AdminInput'
import { AdminModal } from '@/components/ui/AdminModal'

export default function PaymentRefundModal() {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')

  return (
    <>
      <AdminButton variant="outline" size="sm" onClick={() => setOpen(true)}>
        <RotateCcw size={14} className="mr-1.5" /> Refund
      </AdminButton>

      <AdminModal
        open={open}
        onOpenChange={setOpen}
        title="Refund Payment"
        description="Process a full or partial refund back to the payer."
      >
        <div className="space-y-4">
          <AdminInput
            label="Refund amount (USD)"
            type="number"
            placeholder="4500"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <AdminInput
            label="Reason"
            placeholder="e.g. Duplicate charge, booking cancelled"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <div className="rounded-md bg-slate-50 border border-slate-100 p-3 text-sm text-slate-600">
            Refunds are sent via the original payment method. M-Pesa refunds may take up to 48 hours.
          </div>
          <div className="flex justify-end gap-2">
            <AdminButton variant="outline" onClick={() => setOpen(false)}>Cancel</AdminButton>
            <AdminButton disabled={amount === '' || reason.trim() === ''} onClick={() => setOpen(false)}>
              Process Refund
            </AdminButton>
          </div>
        </div>
      </AdminModal>
    </>
  )
}