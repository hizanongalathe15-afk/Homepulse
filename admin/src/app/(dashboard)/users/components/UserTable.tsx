'use client'

import { useEffect, useState } from 'react'
import type { User } from '@/types/user.types'
import { DataTable } from '@/components/ui/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { generateInitials } from '@/utils/admin.helpers'
import { adminUserService } from '@/services/adminUser.service'

function statusVariant(status: string) {
  const normalized = String(status).toLowerCase()
  switch (normalized) {
    case 'active':
      return 'success'
    case 'suspended':
      return 'destructive'
    case 'pending':
    case 'pending_verification':
      return 'warning'
    default:
      return 'default'
  }
}

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await adminUserService.getUsers({}, 1, 50)
        setUsers(response.data || response.users || [])
      } catch (err) {
        setError('Failed to load users')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-12 bg-muted rounded animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>
  }

  return (
    <DataTable<User>
      data={users}
      searchPlaceholder="Search users by name or email..."
      columns={[
        {
          key: 'user',
          header: 'User',
          render: (user) => (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                {generateInitials(user.firstName, user.lastName)}
              </div>
              <div>
                <p className="font-medium text-slate-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
            </div>
          ),
        },
        {
          key: 'role',
          header: 'Role',
          render: (u) => <span className="capitalize">{String(u.role).toLowerCase()}</span>,
        },
        {
          key: 'status',
          header: 'Status',
          render: (u) => <StatusBadge variant={statusVariant(u.status)} label={String(u.status).toLowerCase()} />,
        },
        {
          key: 'verified',
          header: 'Verified',
          render: (u) => (
            <StatusBadge variant={u.verified ? 'success' : 'warning'} label={u.verified ? 'Yes' : 'No'} />
          ),
        },
        {
          key: 'trustScore',
          header: 'Trust Score',
          render: (u) => (
            <span className={(u.trustScore ?? 0) >= 80 ? 'text-green-600 font-medium' : (u.trustScore ?? 0) >= 60 ? 'text-yellow-600 font-medium' : 'text-red-600 font-medium'}>
              {u.trustScore ?? 0}
            </span>
          ),
        },
        {
          key: 'createdAt',
          header: 'Joined',
          render: (u) => new Date(u.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        },
      ]}
    />
  )
}
