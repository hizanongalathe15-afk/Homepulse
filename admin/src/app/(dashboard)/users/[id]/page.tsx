'use client'

import { useParams } from 'next/navigation'
import type { User } from '@/types/user.types'
import { AdminHeader } from '@/components/ui/AdminHeader'
import { AdminButton } from '@/components/ui/AdminButton'
import UserProfileCard from '../components/UserProfileCard'
import UserVerificationStatus from '../components/UserVerificationStatus'
import UserActivityLog from '../components/UserActivityLog'
import UserRoleChanger from '../components/UserRoleChanger'
import UserSuspendModal from '../components/UserSuspendModal'

const user: User = {
  id: 'USR-1001', email: 'mary.wanjiku@gmail.com', firstName: 'Mary', lastName: 'Wanjiku',
  phoneNumber: '+254712345678', role: 'landlord', status: 'active', verified: true, trustScore: 92,
  createdAt: new Date('2024-01-12'), updatedAt: new Date('2026-08-01'),
}

export default function UserDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id ?? user.id

  return (
    <div className="space-y-6">
      <AdminHeader
        title={user ? `${user.firstName} ${user.lastName}` : 'User Profile'}
        description={`User ID: ${id}`}
        breadcrumbs={[
          { label: 'Users', href: '/users' },
          { label: id },
        ]}
        actions={
          <>
            <UserRoleChanger user={user} />
            <UserSuspendModal user={user} />
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <UserProfileCard user={user} />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <UserVerificationStatus />
          <UserActivityLog />
        </div>
      </div>
    </div>
  )
}