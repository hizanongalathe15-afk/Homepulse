import { AdminHeader } from '@/components/ui/AdminHeader'
import UserTable from './components/UserTable'
import UserFilters from './components/UserFilters'
import UserExport from './components/UserExport'
import UserBulkActions from './components/UserBulkActions'

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <AdminHeader
        title="User Management"
        description="Manage and monitor all users on the platform."
      />
      <div className="admin-card">
        <div className="admin-card-header flex flex-wrap items-center justify-between gap-3">
          <UserFilters />
          <div className="flex items-center gap-2">
            <UserBulkActions />
            <UserExport />
          </div>
        </div>
        <div className="admin-card-body p-0">
          <UserTable />
        </div>
      </div>
    </div>
  )
}
