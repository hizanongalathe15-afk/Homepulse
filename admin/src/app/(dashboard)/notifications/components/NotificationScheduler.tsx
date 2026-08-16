'use client'

import { useState } from 'react'
import { SectionCard } from '@/components/features/SectionCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { AdminButton } from '@/components/ui/AdminButton'

interface ScheduledNotification {
  id: string
  title: string
  segment: string
  scheduledFor: string
  channel: string
  status: 'scheduled' | 'sending' | 'sent' | 'failed'
}

const scheduled: ScheduledNotification[] = [
  { id: 'SCH-001', title: 'Weekend Promo', segment: 'All Users', scheduledFor: '2026-08-17T09:00:00Z', channel: 'push', status: 'scheduled' },
  { id: 'SCH-002', title: 'Rent Due Reminder', segment: 'Tenants', scheduledFor: '2026-08-18T08:00:00Z', channel: 'email', status: 'scheduled' },
  { id: 'SCH-003', title: 'New Listing Alert', segment: 'Landlords', scheduledFor: '2026-08-16T12:00:00Z', channel: 'in_app', status: 'sending' },
  { id: 'SCH-004', title: 'Maintenance Update', segment: 'Tenants', scheduledFor: '2026-08-15T10:00:00Z', channel: 'sms', status: 'sent' },
]

function statusVariant(status: ScheduledNotification['status']) {
  switch (status) {
    case 'scheduled': return 'info'
    case 'sending': return 'warning'
    case 'sent': return 'success'
    case 'failed': return 'destructive'
  }
}

export default function NotificationScheduler() {
  const [scheduleOpen, setScheduleOpen] = useState(false)

  return (
    <SectionCard
      title="Scheduler"
      description="Upcoming and in-flight notification sends."
      action={
        <AdminButton variant="outline" size="sm" onClick={() => setScheduleOpen(true)}>Schedule</AdminButton>
      }
    >
      <div className="space-y-3">
        {scheduled.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-4 py-3 border-b border-slate-100 last:border-0">
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{item.title}</p>
              <p className="text-xs text-slate-500">{item.segment} · {item.channel.toUpperCase()}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-slate-500">
                {new Date(item.scheduledFor).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
              <StatusBadge variant={statusVariant(item.status)} label={item.status} />
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}
