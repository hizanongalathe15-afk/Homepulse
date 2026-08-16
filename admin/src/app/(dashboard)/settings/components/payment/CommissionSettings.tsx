'use client'

import { SectionCard } from '@/components/features/SectionCard'
import { AdminInput } from '@/components/ui/AdminInput'
import { AdminButton } from '@/components/ui/AdminButton'
import { DataTable } from '@/components/ui/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'

interface CommissionRule {
  id: string
  propertyType: string
  landlordRate: string
  tenantRate: string
  minAmount: string
  maxAmount: string
  status: string
}

const commissions: CommissionRule[] = [
  { id: '1', propertyType: 'Apartment', landlordRate: '5%', tenantRate: '2%', minAmount: '$50', maxAmount: '$500', status: 'active' },
  { id: '2', propertyType: 'House', landlordRate: '6%', tenantRate: '2.5%', minAmount: '$100', maxAmount: '$1,000', status: 'active' },
  { id: '3', propertyType: 'Commercial', landlordRate: '4%', tenantRate: '1.5%', minAmount: '$200', maxAmount: '$2,000', status: 'active' },
  { id: '4', propertyType: 'Short Stay', landlordRate: '8%', tenantRate: '3%', minAmount: '$30', maxAmount: '$300', status: 'draft' },
]

export default function CommissionSettings() {
  return (
    <SectionCard title="Commission Settings" description="Define commission rates per property type and transaction band.">
      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead className="admin-table-header bg-slate-50">
            <tr>
              <th className="admin-table-cell text-left font-medium text-slate-500">Property Type</th>
              <th className="admin-table-cell text-left font-medium text-slate-500">Landlord Rate</th>
              <th className="admin-table-cell text-left font-medium text-slate-500">Tenant Rate</th>
              <th className="admin-table-cell text-left font-medium text-slate-500">Min Amount</th>
              <th className="admin-table-cell text-left font-medium text-slate-500">Max Amount</th>
              <th className="admin-table-cell text-left font-medium text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody className="admin-table-body">
            {commissions.map((row) => (
              <tr key={row.id} className="admin-table-row">
                <td className="admin-table-cell text-slate-900">{row.propertyType}</td>
                <td className="admin-table-cell text-slate-900">{row.landlordRate}</td>
                <td className="admin-table-cell text-slate-900">{row.tenantRate}</td>
                <td className="admin-table-cell text-slate-900">{row.minAmount}</td>
                <td className="admin-table-cell text-slate-900">{row.maxAmount}</td>
                <td className="admin-table-cell">
                  <StatusBadge variant={row.status === 'active' ? 'success' : 'warning'} label={row.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end pt-4">
        <AdminButton type="button">Add Commission Rule</AdminButton>
      </div>
    </SectionCard>
  )
}
