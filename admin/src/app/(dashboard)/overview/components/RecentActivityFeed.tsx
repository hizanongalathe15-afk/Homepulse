'use client'

import { Bell, UserPlus, FileText, CreditCard, Settings, Shield } from 'lucide-react'
import { SectionCard } from '@/components/features/SectionCard'
import { AdminButton } from '@/components/ui/AdminButton'

const activities = [
  { id: 1, text: 'New property listed in Westlands', time: '2 min ago', icon: FileText },
  { id: 2, text: 'Payment received from John Mwangi', time: '15 min ago', icon: CreditCard },
  { id: 3, text: 'New user registration: Amina Hassan', time: '1 hour ago', icon: UserPlus },
  { id: 4, text: 'Dispute filed on PROP-003', time: '3 hours ago', icon: Shield },
  { id: 5, text: 'System settings updated by admin', time: '5 hours ago', icon: Settings },
  { id: 6, text: '3 new property approvals pending', time: 'Yesterday', icon: Bell },
]

export default function RecentActivityFeed() {
  return (
    <SectionCard title="Recent Activity" description="Latest events across the platform">
      <div className="divide-y divide-slate-100">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 py-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
              <activity.icon size={14} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-800">{activity.text}</p>
              <p className="text-xs text-slate-400 mt-0.5">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <AdminButton variant="outline" size="sm" className="w-full">
          View all activity
        </AdminButton>
      </div>
    </SectionCard>
  )
}
