'use client'

import { useState } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import { AdminButton } from '@/components/ui/AdminButton'
import { SectionCard } from '@/components/features/SectionCard'
import { StatusBadge } from '@/components/ui/StatusBadge'

const documents = [
  { name: 'National ID (Front)', status: 'verified', date: '2026-07-10' },
  { name: 'National ID (Back)', status: 'verified', date: '2026-07-10' },
  { name: 'Proof of Address', status: 'pending', date: '2026-08-01' },
]

export default function DocumentVerification() {
  const [items, setItems] = useState(documents)

  const setStatus = (name: string, status: 'verified' | 'rejected') => {
    setItems((prev) => prev.map((d) => (d.name === name ? { ...d, status } : d)))
  }

  return (
    <SectionCard title="Document Verification" description="Uploaded identification documents">
      <div className="space-y-3">
        {items.map((doc) => (
          <div key={doc.name} className="flex items-center justify-between rounded-md border border-slate-100 p-3">
            <div>
              <p className="text-sm font-medium text-slate-800">{doc.name}</p>
              <p className="text-xs text-slate-400">Uploaded {doc.date}</p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge
                variant={doc.status === 'verified' ? 'success' : doc.status === 'rejected' ? 'destructive' : 'warning'}
                label={doc.status}
              />
              {doc.status === 'pending' && (
                <>
                  <AdminButton size="sm" onClick={() => setStatus(doc.name, 'verified')}>
                    <CheckCircle2 size={14} className="mr-1" /> Approve
                  </AdminButton>
                  <AdminButton size="sm" variant="destructive" onClick={() => setStatus(doc.name, 'rejected')}>
                    <XCircle size={14} className="mr-1" /> Reject
                  </AdminButton>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}