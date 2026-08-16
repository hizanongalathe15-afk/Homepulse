'use client'

import type { FraudCase } from '@/types/fraud.types'
import { DataTable } from '@/components/ui/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { AdminButton } from '@/components/ui/AdminButton'
import { Eye, Ban, CheckCircle2 } from 'lucide-react'

const flaggedCases: FraudCase[] = [
  {
    id: 'FRA-1001', caseNumber: 'HP-FRA-482', alertId: 'ALR-1001', type: 'payment', severity: 'critical', status: 'open',
    assignee: 'Mike T.', userId: 'USR-1001', userName: 'Unknown User', description: 'Multiple failed payment attempts from same user',
    evidence: ['screenshot1.png', 'logs.csv'], createdAt: new Date('2026-08-15T08:30:00'), updatedAt: new Date('2026-08-15T09:00:00'),
  },
  {
    id: 'FRA-1002', caseNumber: 'HP-FRA-483', alertId: 'ALR-1002', type: 'listing', severity: 'high', status: 'under_review',
    assignee: 'Jane D.', userId: 'USR-1002', userName: 'John Mwangi', propertyId: 'PROP-001', propertyTitle: 'Sunset Apartments',
    description: 'Duplicate listing images detected',
    evidence: ['images.zip'], createdAt: new Date('2026-08-14T14:20:00'), updatedAt: new Date('2026-08-14T15:00:00'),
  },
  {
    id: 'FRA-1003', caseNumber: 'HP-FRA-484', alertId: 'ALR-1003', type: 'account', severity: 'medium', status: 'open',
    assignee: 'Unassigned', userId: 'USR-1003', userName: 'Amina Hassan',
    description: 'Unusual login pattern: 5 countries in 1 hour',
    evidence: ['access_logs.txt'], createdAt: new Date('2026-08-14T09:15:00'), updatedAt: new Date('2026-08-14T09:15:00'),
  },
  {
    id: 'FRA-1004', caseNumber: 'HP-FRA-485', alertId: 'ALR-1004', type: 'behavior', severity: 'high', status: 'resolved',
    assignee: 'Mike T.', userId: 'USR-1004', userName: 'Peter Otieno',
    description: 'Bulk messaging to potential victims',
    evidence: ['messages.json', 'user_list.csv'], createdAt: new Date('2026-08-13T16:45:00'), updatedAt: new Date('2026-08-14T10:00:00'), resolvedAt: new Date('2026-08-14T10:00:00'),
  },
]

function severityVariant(severity: FraudCase['severity']) {
  switch (severity) {
    case 'critical': return 'destructive'
    case 'high': return 'destructive'
    case 'medium': return 'warning'
    case 'low': return 'default'
    default: return 'default'
  }
}

export default function FraudFlaggedListings() {
  return (
    <div className="admin-card">
      <div className="admin-card-header flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-slate-900">Flagged Cases</h3>
        <div className="flex items-center gap-2">
          <AdminButton variant="outline" size="sm">
            <Eye size={16} className="mr-2" />
            View All
          </AdminButton>
          <AdminButton variant="destructive" size="sm">
            <Ban size={16} className="mr-2" />
            Bulk Ban
          </AdminButton>
        </div>
      </div>
      <div className="admin-card-body p-0">
        <DataTable
          data={flaggedCases}
          searchPlaceholder="Search cases by ID, user, or description..."
          columns={[
            {
              key: 'caseNumber',
              header: 'Case',
              render: (c) => (
                <div>
                  <p className="font-medium text-slate-900">{c.caseNumber}</p>
                  <p className="text-xs text-slate-500">{c.description}</p>
                </div>
              ),
            },
            {
              key: 'type',
              header: 'Type',
              render: (c) => <span className="capitalize text-sm">{c.type}</span>,
            },
            {
              key: 'severity',
              header: 'Severity',
              render: (c) => <StatusBadge variant={severityVariant(c.severity)} label={c.severity} />,
            },
            {
              key: 'userName',
              header: 'User',
              render: (c) => <span className="text-sm">{c.userName}</span>,
            },
            {
              key: 'status',
              header: 'Status',
              render: (c) => <StatusBadge variant={c.status === 'open' ? 'destructive' : c.status === 'under_review' ? 'warning' : c.status === 'resolved' ? 'success' : 'default'} label={c.status} />,
            },
            {
              key: 'assignee',
              header: 'Assignee',
              render: (c) => <span className="text-sm">{c.assignee}</span>,
            },
            {
              key: 'createdAt',
              header: 'Created',
              render: (c) => c.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            },
            {
              key: 'actions',
              header: '',
              render: (c) => (
                <div className="flex items-center gap-1">
                  <AdminButton variant="ghost" size="icon" className="h-8 w-8"><Eye size={16} /></AdminButton>
                  <AdminButton variant="ghost" size="icon" className="h-8 w-8"><CheckCircle2 size={16} /></AdminButton>
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  )
}
