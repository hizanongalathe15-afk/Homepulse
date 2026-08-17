'use client'

import { Wrench, AlertTriangle, ShieldCheck, type LucideIcon } from 'lucide-react'
import { StatCard } from '@/components/features/StatCard'
import { SectionCard } from '@/components/features/SectionCard'
import { AdminInput } from '@/components/ui/AdminInput'
import { AdminButton } from '@/components/ui/AdminButton'
import { Toggle } from '@/components/features/Toggle'
import { StatusBadge } from '@/components/ui/StatusBadge'

interface StatItem {
  label: string
  value: string
  trend: 'up' | 'down' | 'neutral'
  trendValue: string
  icon: LucideIcon
  sub: string
}

const stats: StatItem[] = [
  { label: 'Uptime', value: '99.98%', trend: 'up', trendValue: '0.02%', icon: ShieldCheck, sub: 'last 30 days' },
  { label: 'Incidents', value: '2', trend: 'down', trendValue: '1', icon: AlertTriangle, sub: 'this month' },
]

const maintenanceLog = [
  { id: '1', date: '2026-08-10', duration: '15 min', reason: 'Database migration', status: 'completed' },
  { id: '2', date: '2026-07-22', duration: '45 min', reason: 'CDN cache flush', status: 'completed' },
  { id: '3', date: '2026-07-05', duration: '30 min', reason: 'Security patch', status: 'completed' },
]

export default function MaintenanceMode() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
      <SectionCard title="Maintenance Mode" description="Temporarily take the platform offline for updates.">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">Maintenance Mode</p>
              <p className="text-xs text-slate-500">Show a maintenance page to all visitors</p>
            </div>
            <Toggle checked={false} onChange={() => {}} />
          </div>
          <AdminInput label="Maintenance Message" defaultValue="We'll be back soon! Scheduled maintenance in progress." />
          <AdminInput label="Allowed IPs (comma separated)" placeholder="192.168.1.1, 10.0.0.1" />
          <div className="flex justify-end pt-2">
            <AdminButton type="button">Apply</AdminButton>
          </div>
        </div>
      </SectionCard>
      <SectionCard title="Recent Maintenance" description="History of past maintenance windows.">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead className="admin-table-header bg-slate-50">
              <tr>
                <th className="admin-table-cell text-left font-medium text-slate-500">Date</th>
                <th className="admin-table-cell text-left font-medium text-slate-500">Duration</th>
                <th className="admin-table-cell text-left font-medium text-slate-500">Reason</th>
                <th className="admin-table-cell text-left font-medium text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody className="admin-table-body">
              {maintenanceLog.map((row) => (
                <tr key={row.id} className="admin-table-row">
                  <td className="admin-table-cell text-slate-900">{row.date}</td>
                  <td className="admin-table-cell text-slate-900">{row.duration}</td>
                  <td className="admin-table-cell text-slate-900">{row.reason}</td>
                  <td className="admin-table-cell">
                    <StatusBadge variant="success" label={row.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  )
}
