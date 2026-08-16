import { AdminHeader } from '@/components/ui/AdminHeader'
import SegmentBuilder from './components/SegmentBuilder'
import SegmentPreview from './components/SegmentPreview'
import SegmentActions from './components/SegmentActions'
import { SectionCard } from '@/components/features/SectionCard'
import { StatusBadge } from '@/components/ui/StatusBadge'

const segments = [
  { id: 'SEG-001', name: 'Verified Landlords in Nairobi', users: 4820, avgTrust: 87 },
  { id: 'SEG-002', name: 'Inactive Tenants (90d)', users: 4211, avgTrust: 62 },
  { id: 'SEG-003', name: 'High-trust Agents', users: 920, avgTrust: 94 },
]

export default function SegmentsPage() {
  return (
    <div className="space-y-6">
      <AdminHeader
        title="Segments"
        description="Create and manage audience segments for campaigns and notifications."
        breadcrumbs={[{ label: 'Users', href: '/users' }, { label: 'Segments' }]}
        actions={<SegmentActions />}
      />

      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="text-lg font-semibold text-slate-900">Saved Segments</h3>
        </div>
        <div className="admin-card-body p-0">
          <table className="admin-table">
            <thead className="admin-table-header bg-slate-50">
              <tr>
                <th className="admin-table-cell text-left font-medium text-slate-500">Name</th>
                <th className="admin-table-cell text-left font-medium text-slate-500">Users</th>
                <th className="admin-table-cell text-left font-medium text-slate-500">Avg. Trust</th>
                <th className="admin-table-cell text-left font-medium text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody className="admin-table-body">
              {segments.map((segment) => (
                <tr key={segment.id} className="admin-table-row">
                  <td className="admin-table-cell font-medium text-slate-900">{segment.name}</td>
                  <td className="admin-table-cell text-slate-900">{segment.users.toLocaleString()}</td>
                  <td className="admin-table-cell text-slate-900">{segment.avgTrust}%</td>
                  <td className="admin-table-cell">
                    <StatusBadge variant="success" label="Active" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SegmentBuilder />
        <SegmentPreview />
      </div>
    </div>
  )
}