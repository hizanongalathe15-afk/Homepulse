'use client'

import { useParams } from 'next/navigation'
import { AdminHeader } from '@/components/ui/AdminHeader'
import { SectionCard } from '@/components/features/SectionCard'
import { InfoRow } from '@/components/features/InfoRow'
import { StatusBadge } from '@/components/ui/StatusBadge'

const notification = {
  id: 'NTF-001',
  title: 'Welcome Message',
  channel: 'push',
  segment: 'New Users (7d)',
  status: 'sent',
  sentAt: '2026-08-14T08:00:00Z',
  delivered: 620,
  opened: 312,
  clicked: 45,
  content: 'Welcome to Homepulse! Explore verified listings and find your perfect home today.',
  scheduledFor: '2026-08-14T08:00:00Z',
  createdBy: 'Admin User',
}

export default function NotificationDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id ?? notification.id

  return (
    <div className="space-y-6">
      <AdminHeader
        title={notification.title}
        description={`Notification ID: ${id}`}
        breadcrumbs={[{ label: 'Notifications', href: '/notifications' }, { label: notification.title }]}
        actions={
          <div className="flex items-center gap-3">
            <StatusBadge variant={notification.status === 'sent' ? 'success' : 'warning'} label={notification.status} />
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <SectionCard title="Details">
            <div>
              <InfoRow label="Channel" value={notification.channel.toUpperCase()} />
              <InfoRow label="Segment" value={notification.segment} />
              <InfoRow label="Sent At" value={new Date(notification.sentAt).toLocaleString()} />
              <InfoRow label="Scheduled" value={new Date(notification.scheduledFor).toLocaleString()} />
              <InfoRow label="Created By" value={notification.createdBy} />
            </div>
          </SectionCard>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <SectionCard title="Content">
            <p className="text-sm text-slate-700 leading-relaxed">{notification.content}</p>
          </SectionCard>
          <SectionCard title="Delivery Metrics">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <p className="text-2xl font-bold text-slate-900">{notification.delivered}</p>
                <p className="text-xs text-slate-500 mt-1">Delivered</p>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <p className="text-2xl font-bold text-slate-900">{notification.opened}</p>
                <p className="text-xs text-slate-500 mt-1">Opened</p>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <p className="text-2xl font-bold text-slate-900">{notification.clicked}</p>
                <p className="text-xs text-slate-500 mt-1">Clicked</p>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  )
}
