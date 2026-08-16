'use client'

import { Cloud, Puzzle, CheckCircle2, AlertTriangle } from 'lucide-react'
import { StatCard } from '@/components/features/StatCard'
import { SectionCard } from '@/components/features/SectionCard'
import { AdminButton } from '@/components/ui/AdminButton'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Toggle } from '@/components/features/Toggle'

const stats = [
  { label: 'Active Integrations', value: '7', trend: 'up', trendValue: '1', icon: Puzzle, sub: 'connected' },
  { label: 'API Calls (24h)', value: '1.2M', trend: 'up', trendValue: '8%', icon: Cloud, sub: 'all services' },
  { label: 'Errors', value: '12', trend: 'down', trendValue: '5', icon: AlertTriangle, sub: 'last 24h' },
]

const integrations = [
  { id: '1', name: 'Stripe', category: 'Payment', status: 'connected', lastSync: '2 min ago' },
  { id: '2', name: 'M-Pesa', category: 'Payment', status: 'connected', lastSync: '5 min ago' },
  { id: '3', name: 'Mapbox', category: 'Maps', status: 'connected', lastSync: '1 min ago' },
  { id: '4', name: 'AWS S3', category: 'Storage', status: 'connected', lastSync: '3 min ago' },
  { id: '5', name: 'SendGrid', category: 'Email', status: 'error', lastSync: '2 hours ago' },
  { id: '6', name: 'Firebase', category: 'Push', status: 'connected', lastSync: '1 min ago' },
  { id: '7', name: 'Twilio', category: 'SMS', status: 'connected', lastSync: '4 min ago' },
]

export default function ThirdPartyIntegrations() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
      <SectionCard title="Third-Party Integrations" description="Monitor and manage connected services.">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead className="admin-table-header bg-slate-50">
              <tr>
                <th className="admin-table-cell text-left font-medium text-slate-500">Integration</th>
                <th className="admin-table-cell text-left font-medium text-slate-500">Category</th>
                <th className="admin-table-cell text-left font-medium text-slate-500">Status</th>
                <th className="admin-table-cell text-left font-medium text-slate-500">Last Sync</th>
                <th className="admin-table-cell text-left font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="admin-table-body">
              {integrations.map((item) => (
                <tr key={item.id} className="admin-table-row">
                  <td className="admin-table-cell text-slate-900 font-medium">{item.name}</td>
                  <td className="admin-table-cell text-slate-600">{item.category}</td>
                  <td className="admin-table-cell">
                    <StatusBadge variant={item.status === 'connected' ? 'success' : 'destructive'} label={item.status} />
                  </td>
                  <td className="admin-table-cell text-slate-500">{item.lastSync}</td>
                  <td className="admin-table-cell">
                    <button type="button" className="text-sm text-primary hover:underline mr-3">Configure</button>
                    <button type="button" className="text-sm text-slate-500 hover:underline">Disconnect</button>
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
