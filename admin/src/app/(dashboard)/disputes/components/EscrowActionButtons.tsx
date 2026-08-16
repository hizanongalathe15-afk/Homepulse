'use client'

import { useState } from 'react'
import { Lock, Banknote, ArrowLeftRight } from 'lucide-react'
import { AdminButton } from '@/components/ui/AdminButton'
import { StatusBadge } from '@/components/ui/StatusBadge'

export default function EscrowActionButtons() {
  const [held, setHeld] = useState(true)

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <StatusBadge variant={held ? 'warning' : 'success'} label={held ? 'Funds held' : 'Released'} />
      <AdminButton variant="outline" size="sm" disabled={!held} onClick={() => setHeld(false)}>
        <Banknote size={14} className="mr-1.5" /> Release to Landlord
      </AdminButton>
      <AdminButton variant="outline" size="sm" disabled={!held} onClick={() => setHeld(false)}>
        <ArrowLeftRight size={14} className="mr-1.5" /> Refund Tenant
      </AdminButton>
      <AdminButton variant="destructive" size="sm" disabled={!held} onClick={() => setHeld(false)}>
        <Lock size={14} className="mr-1.5" /> Hold Indefinitely
      </AdminButton>
    </div>
  )
}