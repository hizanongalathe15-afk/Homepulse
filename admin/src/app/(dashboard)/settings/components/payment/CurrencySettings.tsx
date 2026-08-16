'use client'

import { SectionCard } from '@/components/features/SectionCard'
import { AdminInput } from '@/components/ui/AdminInput'
import { AdminButton } from '@/components/ui/AdminButton'
import { Toggle } from '@/components/features/Toggle'

const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: '1.00', enabled: true },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', rate: '153.45', enabled: true },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: '0.92', enabled: true },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: '0.79', enabled: false },
  { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh', rate: '3,780.00', enabled: false },
]

export default function CurrencySettings() {
  return (
    <SectionCard title="Currency Settings" description="Manage supported currencies and exchange rates.">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-900">Auto-update Exchange Rates</p>
            <p className="text-xs text-slate-500">Sync rates daily from provider</p>
          </div>
          <Toggle checked={true} onChange={() => {}} />
        </div>
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead className="admin-table-header bg-slate-50">
              <tr>
                <th className="admin-table-cell text-left font-medium text-slate-500">Currency</th>
                <th className="admin-table-cell text-left font-medium text-slate-500">Code</th>
                <th className="admin-table-cell text-left font-medium text-slate-500">Symbol</th>
                <th className="admin-table-cell text-left font-medium text-slate-500">Rate to USD</th>
                <th className="admin-table-cell text-left font-medium text-slate-500">Enabled</th>
              </tr>
            </thead>
            <tbody className="admin-table-body">
              {currencies.map((c) => (
                <tr key={c.code} className="admin-table-row">
                  <td className="admin-table-cell text-slate-900">{c.name}</td>
                  <td className="admin-table-cell text-slate-900">{c.code}</td>
                  <td className="admin-table-cell text-slate-900">{c.symbol}</td>
                  <td className="admin-table-cell text-slate-900">{c.rate}</td>
                  <td className="admin-table-cell">
                    <Toggle checked={c.enabled} onChange={() => {}} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end pt-2">
          <AdminButton type="button">Save Currency Settings</AdminButton>
        </div>
      </div>
    </SectionCard>
  )
}
