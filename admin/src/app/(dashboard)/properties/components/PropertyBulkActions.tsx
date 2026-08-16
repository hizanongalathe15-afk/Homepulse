'use client'

import { useState } from 'react'
import { CheckCircle2, Flag, Trash2 } from 'lucide-react'
import { AdminButton } from '@/components/ui/AdminButton'

export default function PropertyBulkActions() {
  const [selected, setSelected] = useState(0)

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-slate-500">{selected} selected</span>
      <AdminButton
        variant="outline"
        size="sm"
        disabled={selected === 0}
        onClick={() => setSelected(0)}
      >
        <CheckCircle2 size={14} className="mr-1.5" /> Approve
      </AdminButton>
      <AdminButton
        variant="outline"
        size="sm"
        disabled={selected === 0}
        onClick={() => setSelected(0)}
      >
        <Flag size={14} className="mr-1.5" /> Flag
      </AdminButton>
      <AdminButton
        variant="destructive"
        size="sm"
        disabled={selected === 0}
        onClick={() => setSelected(0)}
      >
        <Trash2 size={14} className="mr-1.5" /> Delete
      </AdminButton>
    </div>
  )
}