'use client'

import { useState } from 'react'
import { AdminButton } from '@/components/ui/AdminButton'
import { SectionCard } from '@/components/features/SectionCard'
import { DataTable } from '@/components/ui/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'

interface AuditLog {
  id: string
  action: string
  actor: string
  actorRole: string
  resource: string
  resourceId: string
  ipAddress: string
  severity: 'info' | 'warning' | 'critical'
  timestamp: string
  metadata: Record<string, string>
}

const logs: AuditLog[] = [
  { id: 'LOG-001', action: 'user.ban', actor: 'admin@homepulse.io', actorRole: 'super_admin', resource: 'User', resourceId: 'USR-1008', ipAddress: '192.168.1.10', severity: 'critical', timestamp: '2026-08-14T10:00:00Z', metadata: { reason: 'Fraudulent activity' } },
  { id: 'LOG-002', action: 'payment.refund', actor: 'j.kimani@homepulse.io', actorRole: 'admin', resource: 'Payment', resourceId: 'PAY-20492', ipAddress: '192.168.1.12', severity: 'info', timestamp: '2026-08-14T09:30:00Z', metadata: { amount: '$450' } },
  { id: 'LOG-003', action: 'property.approve', actor: 'moderator@homepulse.io', actorRole: 'moderator', resource: 'Property', resourceId: 'PROP-203', ipAddress: '192.168.1.15', severity: 'info', timestamp: '2026-08-14T08:15:00Z', metadata: {} },
  { id: 'LOG-004', action: 'auth.failed', actor: 'unknown', actorRole: 'n/a', resource: 'Auth', resourceId: 'N/A', ipAddress: '203.45.67.89', severity: 'warning', timestamp: '2026-08-14T07:45:00Z', metadata: { attempt: '5' } },
  { id: 'LOG-005', action: 'settings.update', actor: 'admin@homepulse.io', actorRole: 'super_admin', resource: 'Settings', resourceId: 'CFG-001', ipAddress: '192.168.1.10', severity: 'info', timestamp: '2026-08-13T22:00:00Z', metadata: { key: 'maintenance_mode' } },
]

function severityVariant(severity: AuditLog['severity']) {
  switch (severity) {
    case 'info': return 'default'
    case 'warning': return 'warning'
    case 'critical': return 'destructive'
  }
}

export default function AuditLogTable() {
  const [search, setSearch] = useState('')

  return (
    <DataTable<AuditLog>
      data={logs}
      searchPlaceholder="Search logs by action, actor or resource..."
      onRowClick={(log) => console.log('Log clicked', log.id)}
      columns={[
        { key: 'action', header: 'Action', render: (l) => <span className="font-mono text-xs">{l.action}</span> },
        { key: 'actor', header: 'Actor', render: (l) => <span className="text-slate-900">{l.actor}</span> },
        { key: 'actorRole', header: 'Role', render: (l) => <span className="capitalize text-slate-500">{l.actorRole.replace('_', ' ')}</span> },
        { key: 'resource', header: 'Resource', render: (l) => <span className="text-slate-900">{l.resource}</span> },
        { key: 'resourceId', header: 'Resource ID', render: (l) => <span className="font-mono text-xs text-slate-500">{l.resourceId}</span> },
        {
          key: 'severity',
          header: 'Severity',
          render: (l) => <StatusBadge variant={severityVariant(l.severity)} label={l.severity} />,
        },
        {
          key: 'timestamp',
          header: 'Timestamp',
          render: (l) => new Date(l.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        },
      ]}
    />
  )
}
