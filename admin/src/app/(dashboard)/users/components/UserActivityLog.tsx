'use client'

import { SectionCard } from '@/components/features/SectionCard'
import { StatusBadge } from '@/components/ui/StatusBadge'

const activities = [
  { action: 'Logged in', detail: 'Web client · Nairobi, Kenya', time: '12 min ago', status: 'info' },
  { action: 'Listed a property', detail: '"Sunset Apartments, Westlands"', time: '2 hours ago', status: 'success' },
  { action: 'Updated profile photo', detail: 'Profile photo changed', time: '1 day ago', status: 'default' },
  { action: 'Failed login attempt', detail: 'Wrong password entered', time: '3 days ago', status: 'destructive' },
  { action: 'Verified phone number', detail: 'Phone confirmed via M-Pesa prompt', time: '5 days ago', status: 'success' },
] as const

export default function UserActivityLog() {
  return (
    <SectionCard title="Recent Activity" description="Latest account events">
      <div className="relative">
        <div className="absolute left-[7px] top-1 bottom-1 w-px bg-slate-200" />
        <div className="space-y-5">
          {activities.map((activity) => (
            <div key={activity.action} className="relative pl-6">
              <span className="absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border-2 border-white bg-primary shadow" />
              <p className="text-sm font-medium text-slate-800">{activity.action}</p>
              <p className="text-xs text-slate-400">{activity.detail}</p>
              <p className="text-xs text-slate-400 mt-0.5">{activity.time}</p>
              <div className="mt-1">
                <StatusBadge variant={activity.status} label={activity.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  )
}