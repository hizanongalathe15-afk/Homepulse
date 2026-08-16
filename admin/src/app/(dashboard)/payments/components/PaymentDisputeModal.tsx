'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { AdminButton } from '@/components/ui/AdminButton'
import { AdminInput } from '@/components/ui/AdminInput'
import { AdminModal } from '@/components/ui/AdminModal'

export default function PaymentDisputeModal() {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')

  return (
    <>
      <AdminButton variant="destructive" size="sm" onClick={() => setOpen(true)}>
        <AlertTriangle size={14} className="mr-1.5" /> Open Dispute
      </AdminButton>

      <AdminModal
        open={open}
        onOpenChange={setOpen}
        title="Open Payment Dispute"
        description="Flag this transaction and create a dispute case."
      >
        <div className="space-y-4">
          <AdminInput
            label="Dispute reason"
            placeholder="e.g. Payment not received by landlord"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <div className="rounded-md bg-red-50 border border-red-100 p-3 text-sm text-red-700">
            Any escrow funds linked to this payment will be frozen while the dispute is open.
          </div>
          <div className="flex justify-end gap-2">
            <AdminButton variant="outline" onClick={() => setOpen(false)}>Cancel</AdminButton>
            <AdminButton variant="destructive" disabled={reason.trim() === ''} onClick={() => setOpen(false)}>
              Create Case
            </AdminButton>
          </div>
        </div>
      </AdminModal>
    </>
  )
}