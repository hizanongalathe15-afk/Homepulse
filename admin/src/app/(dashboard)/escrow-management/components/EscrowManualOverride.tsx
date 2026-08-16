'use client'

import { useState } from 'react'
import { ShieldAlert } from 'lucide-react'
import { AdminButton } from '@/components/ui/AdminButton'
import { AdminInput } from '@/components/ui/AdminInput'
import { AdminModal } from '@/components/ui/AdminModal'
import { SectionCard } from '@/components/features/SectionCard'
import { StatusBadge } from '@/components/ui/StatusBadge'

export default function EscrowManualOverride() {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [action, setAction] = useState<'release' | 'refund' | 'hold'>('release')

  return (
    <SectionCard
      title="Manual Override"
      description="Admin-initiated action on an escrow account"
      action={<StatusBadge variant="warning" label="Requires 2FA" />}
    >
      <p className="text-sm text-slate-600 mb-4">
        Override the automatic escrow flow. This is logged to the audit trail and notifies both parties.
      </p>
      <div className="flex gap-2">
        <AdminButton variant="outline" onClick={() => { setAction('release'); setOpen(true) }}>
          Release
        </AdminButton>
        <AdminButton variant="outline" onClick={() => { setAction('refund'); setOpen(true) }}>
          Refund
        </AdminButton>
        <AdminButton variant="destructive" onClick={() => { setAction('hold'); setOpen(true) }}>
          Hold
        </AdminButton>
      </div>

      <AdminModal
        open={open}
        onOpenChange={setOpen}
        title={`Manual ${action}`}
        description="This action overrides automatic escrow rules."
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2 rounded-md bg-amber-50 border border-amber-100 p-3 text-sm text-amber-700">
            <ShieldAlert size={16} />
            You must provide a reason. Both parties will receive a notification.
          </div>
          <AdminInput
            label="Reason"
            placeholder="Explain the override..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <AdminButton variant="outline" onClick={() => setOpen(false)}>Cancel</AdminButton>
            <AdminButton disabled={reason.trim() === ''} onClick={() => setOpen(false)}>
              Confirm {action}
            </AdminButton>
          </div>
        </div>
      </AdminModal>
    </SectionCard>
  )
}