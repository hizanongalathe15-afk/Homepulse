'use client'

import type { FraudRule } from '@/types/fraud.types'
import { SectionCard } from '@/components/features/SectionCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { AdminButton } from '@/components/ui/AdminButton'
import { ToggleLeft, Plus } from 'lucide-react'

const rules: FraudRule[] = [
  { id: 'RUL-1', name: 'Multiple Failed Payments', description: 'Flag users with more than 3 failed payments in 24h', category: 'payment', severity: 'high', enabled: true, actions: ['notify', 'restrict'], lastTriggered: new Date('2026-08-15T08:00:00'), triggeredCount: 14 },
  { id: 'RUL-2', name: 'Duplicate Listings', description: 'Detect listings with identical images or descriptions', category: 'listing', severity: 'medium', enabled: true, actions: ['flag', 'notify'], lastTriggered: new Date('2026-08-14T12:00:00'), triggeredCount: 7 },
  { id: 'RUL-3', name: 'Geolocation Anomaly', description: 'Flag logins from multiple countries within 1 hour', category: 'account', severity: 'high', enabled: true, actions: ['notify', 'restrict'], lastTriggered: new Date('2026-08-13T16:00:00'), triggeredCount: 3 },
  { id: 'RUL-4', name: 'Bulk Messaging', description: 'Detect users sending bulk messages to many contacts', category: 'behavior', severity: 'medium', enabled: true, actions: ['flag', 'restrict'], lastTriggered: new Date('2026-08-12T09:00:00'), triggeredCount: 5 },
  { id: 'RUL-5', name: 'Refund Abuse', description: 'Flag users requesting refunds for multiple bookings', category: 'payment', severity: 'low', enabled: false, actions: ['notify'], triggeredCount: 0 },
]

export default function FraudRules() {
  return (
    <div className="admin-card">
      <div className="admin-card-header flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-slate-900">Fraud Detection Rules</h3>
        <AdminButton size="sm"><Plus size={16} className="mr-2" />Add Rule</AdminButton>
      </div>
      <div className="admin-card-body p-0">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead className="admin-table-header bg-slate-50">
              <tr>
                <th className="admin-table-cell text-left font-medium text-slate-500">Status</th>
                <th className="admin-table-cell text-left font-medium text-slate-500">Rule</th>
                <th className="admin-table-cell text-left font-medium text-slate-500">Category</th>
                <th className="admin-table-cell text-left font-medium text-slate-500">Severity</th>
                <th className="admin-table-cell text-left font-medium text-slate-500">Actions</th>
                <th className="admin-table-cell text-left font-medium text-slate-500">Triggered</th>
                <th className="admin-table-cell text-left font-medium text-slate-500">Last Triggered</th>
              </tr>
            </thead>
            <tbody className="admin-table-body">
              {rules.map((rule) => (
                <tr key={rule.id} className="admin-table-row">
                  <td className="admin-table-cell">
                    <AdminButton variant="ghost" size="icon" className="h-8 w-8">
                      <ToggleLeft size={18} className={rule.enabled ? 'text-green-600' : 'text-slate-300'} />
                    </AdminButton>
                  </td>
                  <td className="admin-table-cell">
                    <p className="font-medium text-slate-900">{rule.name}</p>
                    <p className="text-xs text-slate-500">{rule.description}</p>
                  </td>
                  <td className="admin-table-cell capitalize text-sm">{rule.category}</td>
                  <td className="admin-table-cell">
                    <StatusBadge variant={rule.severity === 'critical' || rule.severity === 'high' ? 'destructive' : rule.severity === 'medium' ? 'warning' : 'default'} label={rule.severity} />
                  </td>
                  <td className="admin-table-cell">
                    <div className="flex gap-1">
                      {rule.actions.map((action) => (
                        <StatusBadge key={action} variant="default" label={action} />
                      ))}
                    </div>
                  </td>
                  <td className="admin-table-cell text-sm">{rule.triggeredCount}</td>
                  <td className="admin-table-cell text-sm">{rule.lastTriggered ? rule.lastTriggered.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
