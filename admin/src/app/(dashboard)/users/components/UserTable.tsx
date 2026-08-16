'use client'

import type { User } from '@/types/user.types'
import { DataTable } from '@/components/ui/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { generateInitials } from '@/utils/admin.helpers'

const users: User[] = [
  {
    id: 'USR-1001', email: 'mary.wanjiku@gmail.com', firstName: 'Mary', lastName: 'Wanjiku',
    phoneNumber: '+254712345678', role: 'landlord', status: 'active', verified: true, trustScore: 92,
    createdAt: new Date('2024-01-12'), updatedAt: new Date('2026-08-01'),
  },
  {
    id: 'USR-1002', email: 'john.mwangi@yahoo.com', firstName: 'John', lastName: 'Mwangi',
    phoneNumber: '+254723456789', role: 'tenant', status: 'active', verified: true, trustScore: 78,
    createdAt: new Date('2024-02-03'), updatedAt: new Date('2026-07-28'),
  },
  {
    id: 'USR-1003', email: 'amina.hassan@gmail.com', firstName: 'Amina', lastName: 'Hassan',
    phoneNumber: '+254734567890', role: 'agent', status: 'active', verified: true, trustScore: 85,
    createdAt: new Date('2024-02-19'), updatedAt: new Date('2026-08-05'),
  },
  {
    id: 'USR-1004', email: 'peter.otieno@gmail.com', firstName: 'Peter', lastName: 'Otieno',
    phoneNumber: '+254745678901', role: 'landlord', status: 'suspended', verified: false, trustScore: 34,
    createdAt: new Date('2024-03-11'), updatedAt: new Date('2026-06-30'),
  },
  {
    id: 'USR-1005', email: 'faith.nyambura@gmail.com', firstName: 'Faith', lastName: 'Nyambura',
    phoneNumber: '+254756789012', role: 'tenant', status: 'pending', verified: false, trustScore: 45,
    createdAt: new Date('2026-07-25'), updatedAt: new Date('2026-07-25'),
  },
  {
    id: 'USR-1006', email: 'david.kimani@gmail.com', firstName: 'David', lastName: 'Kimani',
    phoneNumber: '+254767890123', role: 'tenant', status: 'active', verified: true, trustScore: 88,
    createdAt: new Date('2024-04-08'), updatedAt: new Date('2026-08-02'),
  },
]

function statusVariant(status: User['status']) {
  switch (status) {
    case 'active': return 'success'
    case 'suspended': return 'destructive'
    case 'pending': return 'warning'
    default: return 'default'
  }
}

export default function UserTable() {
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
        { key: 'role', header: 'Role', render: (u) => <span className="capitalize">{u.role}</span> },
        {
          key: 'status',
          header: 'Status',
          render: (u) => <StatusBadge variant={statusVariant(u.status)} label={u.status} />,
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
            <span className={u.trustScore >= 80 ? 'text-green-600 font-medium' : u.trustScore >= 60 ? 'text-yellow-600 font-medium' : 'text-red-600 font-medium'}>
              {u.trustScore}
            </span>
          ),
        },
        {
          key: 'createdAt',
          header: 'Joined',
          render: (u) => u.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        },
      ]}
    />
  )
}