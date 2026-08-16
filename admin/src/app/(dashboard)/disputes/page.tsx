import { AdminHeader } from '@/components/ui/AdminHeader'
import DisputeAnalytics from './components/DisputeAnalytics'
import DisputeFilters from './components/DisputeFilters'
import DisputeTable from './components/DisputeTable'

export default function DisputesPage() {
  return (
    <div className="space-y-6">
      <AdminHeader
        title="Disputes"
        description="Review, investigate and resolve tenant-landlord disputes."
      />
      <DisputeAnalytics />
      <div className="admin-card">
        <div className="admin-card-header">
          <DisputeFilters />
        </div>
        <div className="admin-card-body p-0">
          <DisputeTable />
        </div>
      </div>
    </div>
  )
}