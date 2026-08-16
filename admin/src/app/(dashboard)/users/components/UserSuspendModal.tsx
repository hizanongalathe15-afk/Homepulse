'use client'

import { useState } from 'react'
import { Ban } from 'lucide-react'
import type { User } from '@/types/user.types'
import { AdminButton } from '@/components/ui/AdminButton'
import { AdminInput } from '@/components/ui/AdminInput'
import { AdminModal } from '@/components/ui/AdminModal'

export default function UserSuspendModal({ user }: { user: User }) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')

  const handleSuspend = () => {
    // In production: adminUserService.suspendUser(user.id, reason)
    setOpen(false)
    setReason('')
  }

  return (
    <>
      <AdminButton variant="destructive" size="sm" onClick={() => setOpen(true)}>
        <Ban size={14} className="mr-1.5" /> Suspend
      </AdminButton>

      <AdminModal
        open={open}
        onOpenChange={setOpen}
        title="Suspend User"
        description={`Suspending ${user.firstName} ${user.lastName} will prevent them from using the platform.`}
      >
        <div className="space-y-4">
          <AdminInput
            label="Reason"
            placeholder="e.g. Multiple policy violations"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            error={open && reason.trim() === '' ? 'Reason is required' : undefined}
          />
          <div className="flex justify-end gap-2">
            <AdminButton variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton variant="destructive" onClick={handleSuspend} disabled={reason.trim() === ''}>
              Confirm Suspension
            </AdminButton>
          </div>
        </div>
      </AdminModal>
    </>
  )
}