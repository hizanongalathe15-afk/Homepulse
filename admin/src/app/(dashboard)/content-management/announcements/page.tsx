import { AdminHeader } from '@/components/ui/AdminHeader'
import AnnouncementCreator from './components/AnnouncementCreator'
import AnnouncementList from './components/AnnouncementList'
import AnnouncementTargeting from './components/AnnouncementTargeting'

export default function AnnouncementsPage() {
  return (
    <div className="space-y-6">
      <AdminHeader
        title="Announcements"
        description="Create and manage platform announcements."
        breadcrumbs={[{ label: 'Content', href: '/content-management' }, { label: 'Announcements' }]}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnnouncementCreator />
        <AnnouncementTargeting />
      </div>
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="text-lg font-semibold text-slate-900">All Announcements</h3>
        </div>
        <div className="admin-card-body p-0">
          <AnnouncementList />
        </div>
      </div>
    </div>
  )
}