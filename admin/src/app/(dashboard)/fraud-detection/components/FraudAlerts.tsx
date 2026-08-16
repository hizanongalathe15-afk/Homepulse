'use client'

import type { FraudAlert } from '@/types/fraud.types'
import { DataTable } from '@/components/ui/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { AdminButton } from '@/components/ui/AdminButton'
import { ShieldAlert, ShieldCheck } from 'lucide-react'

const alerts: FraudAlert[] = [
  { id: 'ALR-1001', type: 'payment', severity: 'critical', description: 'Multiple failed payment attempts from same user', userId: 'USR-1001', userName: 'Unknown User', status: 'new', createdAt: new Date('2026-08-15T08:30:00') },
  { id: 'ALR-1002', type: 'listing', severity: 'high', description: 'Duplicate listing images detected', propertyId: 'PROP-001', propertyTitle: 'Sunset Apartments', status: 'investigating', createdAt: new Date('2026-08-14T14:20:00') },
  { id: 'ALR-1003', type: 'account', severity: 'medium', description: 'Unusual login pattern: 5 countries in 1 hour', userId: 'USR-1003', userName: 'Amina Hassan', status: 'new', createdAt: new Date('2026-08-14T09:15:00') },
  { id: 'ALR-1004', type: 'behavior', severity: 'high', description: 'Bulk messaging to potential victims', userId: 'USR-1004', userName: 'Peter Otieno', status: 'resolved', createdAt: new Date('2026-08-13T16:45:00') },
  { id: 'ALR-1005', type: 'payment', severity: 'medium', description: 'Refund abuse pattern detected', userId: 'USR-1005', userName: 'Grace Njoroge', status: 'investigating', createdAt: new Date('2026-08-13T11:00:00') },
]

function severityVariant(severity: FraudAlert['severity']) {
  switch (severity) {
    case 'critical': return 'destructive'
    case 'high': return 'destructive'
    case 'medium': return 'warning'
    case 'low': return 'default'
    default: return 'default'
  }
}

export default function FraudAlerts() {
  return (
    <div className="admin-card">
      <div className="admin-card-header flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-slate-900">Fraud Alerts</h3>
        <div className="flex items-center gap-2">
          <AdminButton variant="outline" size="sm">
            <ShieldCheck size={16} className="mr-2" />
            Mark all read
          </AdminButton>
          <AdminButton size="sm">
            <ShieldAlert size={16} className="mr-2" />
            Run scan
          </AdminButton>
        </div>
      </div>
      <div className="admin-card-body p-0">
        <DataTable
          data={alerts}
          searchPlaceholder="Search alerts by ID, user, or description..."
          columns={[
            {
              key: 'id',
              header: 'Alert',
              render: (a) => (
                <div>
                  <p className="font-medium text-slate-900">{a.id}</p>
                  <p className="text-xs text-slate-500">{a.description}</p>
                </div>
              ),
            },
            {
              key: 'type',
              header: 'Type',
              render: (a) => <span className="capitalize text-sm">{a.type}</span>,
            },
            {
              key: 'severity',
              header: 'Severity',
              render: (a) => <StatusBadge variant={severityVariant(a.severity)} label={a.severity} />,
            },
            {
              key: 'userName',
              header: 'User',
              render: (a) => <span className="text-sm">{a.userName ?? '-'}</span>,
            },
            {
              key: 'status',
              header: 'Status',
              render: (a) => <StatusBadge variant={a.status === 'new' ? 'destructive' : a.status === 'investigating' ? 'warning' : a.status === 'resolved' ? 'success' : 'default'} label={a.status} />,
            },
            {
              key: 'createdAt',
              header: 'Created',
              render: (a) => a.createdAt.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
            },
          ]}
        />
      </div>
    </div>
  )
}
