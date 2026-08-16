'use client'

import { useParams } from 'next/navigation'
import { AdminHeader } from '@/components/ui/AdminHeader'
import { SectionCard } from '@/components/features/SectionCard'
import { InfoRow } from '@/components/features/InfoRow'
import { StatusBadge } from '@/components/ui/StatusBadge'

const log = {
  id: 'LOG-001',
  action: 'user.ban',
  actor: 'admin@homepulse.io',
  actorRole: 'super_admin',
  resource: 'User',
  resourceId: 'USR-1008',
  ipAddress: '192.168.1.10',
  severity: 'critical',
  timestamp: '2026-08-14T10:00:00Z',
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  metadata: { reason: 'Fraudulent activity', previousWarnings: '3' },
}

export default function AuditLogDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id ?? log.id

  return (
    <div className="space-y-6">
      <AdminHeader
        title={`Audit Log ${id}`}
        description={`${log.action} by ${log.actor}`}
        breadcrumbs={[{ label: 'Audit Logs', href: '/audit-logs' }, { label: id }]}
        actions={
          <StatusBadge variant={log.severity === 'critical' ? 'destructive' : log.severity === 'warning' ? 'warning' : 'default'} label={log.severity} />
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <SectionCard title="Event Info">
            <div>
              <InfoRow label="Action" value={<span className="font-mono text-xs">{log.action}</span>} />
              <InfoRow label="Actor" value={log.actor} />
              <InfoRow label="Role" value={log.actorRole.replace('_', ' ')} />
              <InfoRow label="Resource" value={log.resource} />
              <InfoRow label="Resource ID" value={log.resourceId} />
              <InfoRow label="IP Address" value={log.ipAddress} />
              <InfoRow label="Timestamp" value={new Date(log.timestamp).toLocaleString()} />
            </div>
          </SectionCard>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <SectionCard title="Context">
            <div className="bg-slate-50 rounded-lg p-4 space-y-2">
              <p className="text-xs text-slate-500 font-mono break-all">{log.userAgent}</p>
            </div>
          </SectionCard>
          <SectionCard title="Metadata">
            <div className="space-y-2">
              {Object.entries(log.metadata).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 last:border-0">
                  <span className="text-sm text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="text-sm font-medium text-slate-900">{value}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  )
}
