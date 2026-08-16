'use client'

import { useState } from 'react'
import { Flag } from 'lucide-react'
import { AdminButton } from '@/components/ui/AdminButton'
import { AdminInput } from '@/components/ui/AdminInput'
import { AdminModal } from '@/components/ui/AdminModal'

export default function PropertyFlagModal() {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')

  return (
    <>
      <AdminButton variant="destructive" size="sm" onClick={() => setOpen(true)}>
        <Flag size={14} className="mr-1.5" /> Flag Property
      </AdminButton>

      <AdminModal
        open={open}
        onOpenChange={setOpen}
        title="Flag Property"
        description="Report this listing for review by the moderation team."
      >
        <div className="space-y-4">
          <AdminInput
            label="Reason"
            placeholder="e.g. Suspicious pricing, fake listing, policy violation"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <AdminButton variant="outline" onClick={() => setOpen(false)}>Cancel</AdminButton>
            <AdminButton variant="destructive" disabled={reason.trim() === ''} onClick={() => setOpen(false)}>
              Flag Listing
            </AdminButton>
          </div>
        </div>
      </AdminModal>
    </>
  )
}