'use client'

import { useState } from 'react'
import { Shield } from 'lucide-react'
import type { User } from '@/types/user.types'
import { AdminButton } from '@/components/ui/AdminButton'
import { AdminModal } from '@/components/ui/AdminModal'
import { StatusBadge } from '@/components/ui/StatusBadge'

const roles: User['role'][] = ['tenant', 'landlord', 'agent', 'admin']

export default function UserRoleChanger({ user }: { user: User }) {
  const [open, setOpen] = useState(false)
  const [role, setRole] = useState<User['role']>(user.role)

  const handleSave = () => {
    // In production: adminUserService.updateUserRole(user.id, role)
    setOpen(false)
  }

  return (
    <>
      <AdminButton variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Shield size={14} className="mr-1.5" /> Change Role
      </AdminButton>

      <AdminModal
        open={open}
        onOpenChange={setOpen}
        title="Change User Role"
        description={`Update the role for ${user.firstName} ${user.lastName}`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
            <div className="grid grid-cols-2 gap-2">
              {roles.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`px-3 py-2 rounded-md border text-sm font-medium capitalize transition-colors ${
                    role === r
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
            <span className="text-sm text-slate-500">Current role</span>
            <StatusBadge variant="info" label={user.role} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <AdminButton variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton onClick={handleSave}>Save Role</AdminButton>
          </div>
        </div>
      </AdminModal>
    </>
  )
}