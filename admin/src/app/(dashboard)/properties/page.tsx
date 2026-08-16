import { AdminHeader } from '@/components/ui/AdminHeader'
import PropertyTable from './components/PropertyTable'
import PropertyFilters from './components/PropertyFilters'
import PropertyApprovalQueue from './components/PropertyApprovalQueue'
import PropertyBulkActions from './components/PropertyBulkActions'

export default function PropertiesPage() {
  return (
    <div className="space-y-6">
      <AdminHeader
        title="Property Management"
        description="Review, moderate and manage all property listings."
      />

      <PropertyApprovalQueue />

      <div className="admin-card">
        <div className="admin-card-header flex flex-wrap items-center justify-between gap-3">
          <PropertyFilters />
          <PropertyBulkActions />
        </div>
        <div className="admin-card-body p-0">
          <PropertyTable />
        </div>
      </div>
    </div>
  )
}