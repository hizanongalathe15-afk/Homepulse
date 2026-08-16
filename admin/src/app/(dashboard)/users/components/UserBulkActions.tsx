'use client'

import { useState } from 'react'
import { Ban, UserCheck, UserX } from 'lucide-react'
import { AdminButton } from '@/components/ui/AdminButton'

export default function UserBulkActions() {
  const [selectedCount, setSelectedCount] = useState(3)

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-500">{selectedCount} selected</span>
      <AdminButton variant="outline" size="sm" onClick={() => setSelectedCount(0)}>
        <UserCheck size={14} className="mr-1.5" /> Activate
      </AdminButton>
      <AdminButton variant="outline" size="sm" onClick={() => setSelectedCount(0)}>
        <Ban size={14} className="mr-1.5" /> Suspend
      </AdminButton>
      <AdminButton variant="destructive" size="sm" onClick={() => setSelectedCount(0)}>
        <UserX size={14} className="mr-1.5" /> Deactivate
      </AdminButton>
    </div>
  )
}