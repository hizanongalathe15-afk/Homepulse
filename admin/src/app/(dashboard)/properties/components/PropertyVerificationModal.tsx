'use client'

import { useState } from 'react'
import { BadgeCheck } from 'lucide-react'
import { AdminButton } from '@/components/ui/AdminButton'
import { AdminModal } from '@/components/ui/AdminModal'
import { InfoRow } from '@/components/features/InfoRow'

const checklist = [
  { label: 'Land title/lease deed present', ok: true },
  { label: 'Physical address verified', ok: true },
  { label: 'Landlord identity verified', ok: true },
  { label: 'Photos match property type', ok: false },
]

export default function PropertyVerificationModal() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <AdminButton size="sm" onClick={() => setOpen(true)}>
        <BadgeCheck size={14} className="mr-1.5" /> Verify
      </AdminButton>

      <AdminModal
        open={open}
        onOpenChange={setOpen}
        title="Verify Property"
        description="Confirm listing documents and details before approval."
      >
        <div className="space-y-3 mb-5">
          {checklist.map((item) => (
            <div key={item.label} className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2 text-sm">
              <span className="text-slate-700">{item.label}</span>
              <span className={item.ok ? 'text-green-600 font-medium' : 'text-red-500 font-medium'}>
                {item.ok ? '✓ Verified' : '✕ Pending'}
              </span>
            </div>
          ))}
        </div>

        <div className="rounded-md bg-slate-50 border border-slate-100 divide-y divide-slate-200/60">
          <InfoRow label="Verification level" value="Full (ID + deed + address)" />
          <InfoRow label="Risk score" value="Low" />
          <InfoRow label="Recheck interval" value="6 months" />
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <AdminButton variant="outline" onClick={() => setOpen(false)}>Cancel</AdminButton>
          <AdminButton onClick={() => setOpen(false)}>Approve Verification</AdminButton>
        </div>
      </AdminModal>
    </>
  )
}