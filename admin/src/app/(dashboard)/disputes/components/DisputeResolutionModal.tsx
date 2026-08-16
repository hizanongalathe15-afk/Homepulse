'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { AdminButton } from '@/components/ui/AdminButton'
import { AdminInput } from '@/components/ui/AdminInput'
import { AdminModal } from '@/components/ui/AdminModal'

const actions = [
  'Refund full deposit',
  'Refund partial deposit',
  'Withhold deposit',
  'Cancel lease',
  'Compensate tenant',
  'Close as no-fault',
]

export default function DisputeResolutionModal() {
  const [open, setOpen] = useState(false)
  const [action, setAction] = useState(actions[0])
  const [resolution, setResolution] = useState('')

  return (
    <>
      <AdminButton onClick={() => setOpen(true)}>
        <Send size={14} className="mr-1.5" /> Resolve Dispute
      </AdminButton>

      <AdminModal
        open={open}
        onOpenChange={setOpen}
        title="Resolve Dispute"
        description="Record the resolution decision and notify both parties."
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Resolution Action</label>
            <select className="admin-input" value={action} onChange={(e) => setAction(e.target.value)}>
              {actions.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
          <AdminInput
            label="Resolution Notes"
            placeholder="Summarize the outcome and reasoning..."
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
          />
          <div className="rounded-md bg-slate-50 border border-slate-100 p-3 text-sm text-slate-600">
            Both parties will be notified by email and the case will be closed once confirmed.
          </div>
          <div className="flex justify-end gap-2">
            <AdminButton variant="outline" onClick={() => setOpen(false)}>Cancel</AdminButton>
            <AdminButton disabled={resolution.trim() === ''} onClick={() => setOpen(false)}>
              Submit Resolution
            </AdminButton>
          </div>
        </div>
      </AdminModal>
    </>
  )
}