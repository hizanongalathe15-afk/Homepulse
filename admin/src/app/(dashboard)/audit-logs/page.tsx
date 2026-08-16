'use client'

import { AdminHeader } from '@/components/ui/AdminHeader'
import AuditLogAnalytics from './components/AuditLogAnalytics'
import AuditLogFilters from './components/AuditLogFilters'
import AuditLogTable from './components/AuditLogTable'
import AuditLogExport from './components/AuditLogExport'

export default function AuditLogsPage() {
  return (
    <div className="space-y-6">
      <AdminHeader
        title="Audit Logs"
        description="Track administrative actions, authentication events and system changes."
        actions={<AuditLogExport />}
      />
      <AuditLogAnalytics />
      <div className="admin-card">
        <div className="admin-card-header">
          <AuditLogFilters />
        </div>
        <div className="admin-card-body p-0">
          <AuditLogTable />
        </div>
      </div>
    </div>
  )
}
