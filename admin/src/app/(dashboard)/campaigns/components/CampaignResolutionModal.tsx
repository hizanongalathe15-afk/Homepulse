'use client'

import { useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import { AdminButton } from '@/components/ui/AdminButton'
import { AdminInput } from '@/components/ui/AdminInput'
import { AdminModal } from '@/components/ui/AdminModal'

export default function CampaignResolutionModal() {
  const [open, setOpen] = useState(false)
  const [outcome, setOutcome] = useState('warn')
  const [notes, setNotes] = useState('')

  return (
    <>
      <AdminButton onClick={() => setOpen(true)}>
        <ShieldCheck size={14} className="mr-1.5" /> Record Resolution
      </AdminButton>

      <AdminModal
        open={open}
        onOpenChange={setOpen}
        title="Resolution"
        description="Record how a flagged campaign was resolved"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Outcome</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'warn', label: 'Warning' },
                { value: 'approved', label: 'Approved' },
                { value: 'paused', label: 'Paused' },
                { value: 'removed', label: 'Removed' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setOutcome(option.value)}
                  className={`px-3 py-2 rounded-md border text-sm font-medium transition-colors ${
                    outcome === option.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <AdminInput
            label="Notes"
            placeholder="Add a note about the resolution..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <AdminButton variant="outline" onClick={() => setOpen(false)}>Cancel</AdminButton>
            <AdminButton disabled={notes.trim() === ''} onClick={() => setOpen(false)}>
              Save Resolution
            </AdminButton>
          </div>
        </div>
      </AdminModal>
    </>
  )
}