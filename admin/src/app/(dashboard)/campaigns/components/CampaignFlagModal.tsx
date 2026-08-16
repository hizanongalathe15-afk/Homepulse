'use client'

import { useState } from 'react'
import { Flag } from 'lucide-react'
import { AdminButton } from '@/components/ui/AdminButton'
import { AdminInput } from '@/components/ui/AdminInput'
import { AdminModal } from '@/components/ui/AdminModal'

export default function CampaignFlagModal() {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')

  return (
    <>
      <AdminButton variant="destructive" onClick={() => setOpen(true)}>
        <Flag size={14} className="mr-1.5" /> Flag Campaign
      </AdminButton>

      <AdminModal
        open={open}
        onOpenChange={setOpen}
        title="Flag Campaign"
        description="Flag this campaign for compliance review."
      >
        <div className="space-y-4">
          <AdminInput
            label="Reason"
            placeholder="e.g. Prohibited incentive, misleading claims"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <div className="rounded-md bg-red-50 border border-red-100 p-3 text-sm text-red-700">
            Flagging pauses the campaign and notifies the campaign owner.
          </div>
          <div className="flex justify-end gap-2">
            <AdminButton variant="outline" onClick={() => setOpen(false)}>Cancel</AdminButton>
            <AdminButton variant="destructive" disabled={reason.trim() === ''} onClick={() => setOpen(false)}>
              Flag & Pause
            </AdminButton>
          </div>
        </div>
      </AdminModal>
    </>
  )
}