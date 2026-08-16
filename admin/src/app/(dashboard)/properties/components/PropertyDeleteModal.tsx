'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { AdminButton } from '@/components/ui/AdminButton'
import { AdminModal } from '@/components/ui/AdminModal'

export default function PropertyDeleteModal() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <AdminButton variant="destructive" size="sm" onClick={() => setOpen(true)}>
        <Trash2 size={14} className="mr-1.5" /> Delete
      </AdminButton>

      <AdminModal
        open={open}
        onOpenChange={setOpen}
        title="Delete Property"
        description="This action permanently removes the listing and cannot be undone."
      >
        <div className="rounded-md bg-red-50 border border-red-100 p-3 text-sm text-red-700 mb-4">
          All tenants, visitors and booking data linked to this property will also be removed.
        </div>
        <div className="flex justify-end gap-2">
          <AdminButton variant="outline" onClick={() => setOpen(false)}>Cancel</AdminButton>
          <AdminButton variant="destructive" onClick={() => setOpen(false)}>Delete Permanently</AdminButton>
        </div>
      </AdminModal>
    </>
  )
}