'use client'

import { AdminHeader } from '@/components/ui/AdminHeader'
import NotificationAnalytics from './components/NotificationAnalytics'
import NotificationTemplates from './components/NotificationTemplates'
import NotificationCreator from './components/NotificationCreator'
import NotificationScheduler from './components/NotificationScheduler'
import NotificationSegments from './components/NotificationSegments'
import NotificationHistory from './components/NotificationHistory'

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <AdminHeader
        title="Notifications"
        description="Create, schedule and monitor push notifications and in-app alerts."
        actions={<NotificationCreator />}
      />
      <NotificationAnalytics />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NotificationTemplates />
        <NotificationScheduler />
      </div>
      <NotificationSegments />
      <NotificationHistory />
    </div>
  )
}
