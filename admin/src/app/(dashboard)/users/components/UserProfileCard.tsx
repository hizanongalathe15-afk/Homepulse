'use client'

import { Mail, Phone, BadgeCheck } from 'lucide-react'
import type { User } from '@/types/user.types'
import { SectionCard } from '@/components/features/SectionCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { generateInitials, capitalize } from '@/utils/admin.helpers'

export default function UserProfileCard({ user }: { user: User }) {
  return (
    <SectionCard title="Profile" description={user.email}>
      <div className="flex items-center gap-4 mb-5">
        <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold">
          {generateInitials(user.firstName, user.lastName)}
        </div>
        <div>
          <p className="text-lg font-semibold text-slate-900">
            {user.firstName} {user.lastName}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <StatusBadge variant={user.verified ? 'success' : 'warning'} label={user.verified ? 'Verified' : 'Unverified'} />
            <StatusBadge
              variant={user.status === 'active' ? 'success' : user.status === 'suspended' ? 'destructive' : 'default'}
              label={user.status}
            />
          </div>
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-3 text-slate-700">
          <Mail size={16} className="text-slate-400" />
          {user.email}
        </div>
        <div className="flex items-center gap-3 text-slate-700">
          <Phone size={16} className="text-slate-400" />
          {user.phoneNumber}
        </div>
        <div className="flex items-center gap-3 text-slate-700">
          <BadgeCheck size={16} className="text-slate-400" />
          {user.verified ? 'Identity confirmed' : 'Identity pending'}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100">
        <p className="text-sm text-slate-500 mb-1.5">Trust Score</p>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${user.trustScore >= 80 ? 'bg-green-500' : user.trustScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${user.trustScore}%` }}
            />
          </div>
          <span className="text-lg font-bold text-slate-900">{user.trustScore}</span>
        </div>
      </div>
    </SectionCard>
  )
}