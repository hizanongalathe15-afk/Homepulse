'use client'

import type { Dispute } from '@/types/dispute.types'
import { DataTable } from '@/components/ui/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'

const disputes: Dispute[] = [
  {
    id: 'DSP-1001', caseNumber: 'HP-CASE-482', userId: 'USR-1002', userName: 'John Mwangi',
    propertyId: 'PROP-001', propertyTitle: 'Sunset Apartments, Westlands', type: 'security_deposit',
    status: 'under_review', priority: 'high', description: 'Deposit not refunded after lease end.',
    evidence: ['receipt.pdf', 'photos/clean.jpg'], createdAt: new Date('2026-07-28'), updatedAt: new Date('2026-08-02'),
  },
  {
    id: 'DSP-1002', caseNumber: 'HP-CASE-203', userId: 'USR-1005', userName: 'Faith Nyambura',
    propertyId: 'PROP-004', propertyTitle: 'Lakeview Flats, Kisumu', type: 'lease_violation',
    status: 'open', priority: 'critical', description: 'Landlord entered unit without notice.',
    evidence: ['cctv.mp4'], createdAt: new Date('2026-08-01'), updatedAt: new Date('2026-08-04'),
  },
  {
    id: 'DSP-1003', caseNumber: 'HP-CASE-204', userId: 'USR-1006', userName: 'David Kimani',
    propertyId: 'PROP-003', propertyTitle: 'Hillcrest House, Nakuru', type: 'payment',
    status: 'mediation', priority: 'medium', description: 'Rent payment dispute for June.',
    evidence: ['mpesa.png', 'bank_stmt.pdf'], createdAt: new Date('2026-07-20'), updatedAt: new Date('2026-07-30'),
  },
  {
    id: 'DSP-1004', caseNumber: 'HP-CASE-205', userId: 'USR-1001', userName: 'Mary Wanjiku',
    propertyId: 'PROP-002', propertyTitle: 'Beachside Villa, Mombasa', type: 'property_condition',
    status: 'resolved', priority: 'low', description: 'Minor wall damage dispute settled.',
    evidence: ['invoice.jpg'], createdAt: new Date('2026-06-15'), updatedAt: new Date('2026-06-28'), resolvedAt: new Date('2026-06-28'),
  },
]

function statusVariant(status: Dispute['status']) {
  switch (status) {
    case 'resolved': case 'closed': return 'success'
    case 'under_review': case 'mediation': return 'warning'
    default: return 'destructive'
  }
}

function priorityVariant(priority: Dispute['priority']) {
  return priority === 'critical' ? 'destructive' : priority === 'high' ? 'warning' : 'default'
}

export default function DisputeTable() {
  return (
    <DataTable<Dispute>
      data={disputes}
      searchPlaceholder="Search disputes by case number, user or property..."
      columns={[
        {
          key: 'caseNumber',
          header: 'Case',
          render: (d) => (
            <div>
              <p className="font-medium text-slate-900">{d.caseNumber}</p>
              <p className="text-xs text-slate-500">{d.propertyTitle}</p>
            </div>
          ),
        },
        { key: 'type', header: 'Type', render: (d) => <span className="capitalize">{d.type.replace('_', ' ')}</span> },
        {
          key: 'priority',
          header: 'Priority',
          render: (d) => <StatusBadge variant={priorityVariant(d.priority)} label={d.priority} />,
        },
        {
          key: 'status',
          header: 'Status',
          render: (d) => <StatusBadge variant={statusVariant(d.status)} label={d.status} />,
        },
        {
          key: 'createdAt',
          header: 'Opened',
          render: (d) => d.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        },
      ]}
    />
  )
}