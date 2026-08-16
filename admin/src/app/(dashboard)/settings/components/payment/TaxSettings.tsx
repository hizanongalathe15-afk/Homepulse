'use client'

import { SectionCard } from '@/components/features/SectionCard'
import { AdminInput } from '@/components/ui/AdminInput'
import { AdminButton } from '@/components/ui/AdminButton'
import { Toggle } from '@/components/features/Toggle'

export default function TaxSettings() {
  return (
    <SectionCard title="Tax Settings" description="Configure VAT and tax calculation rules.">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-900">Enable Tax Calculation</p>
            <p className="text-xs text-slate-500">Automatically calculate tax on transactions</p>
          </div>
          <Toggle checked={true} onChange={() => {}} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminInput label="Tax Name" defaultValue="VAT" />
          <AdminInput label="Tax Rate (%)" type="number" defaultValue="16" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminInput label="Tax Registration Number" defaultValue="P05123456K" />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Apply To</label>
            <select className="admin-input">
              <option>All Transactions</option>
              <option>Rentals Only</option>
              <option>Service Fees Only</option>
            </select>
          </div>
        </div>
        <AdminInput label="Tax Inclusive Label" defaultValue="Price includes VAT" />
        <div className="flex justify-end pt-2">
          <AdminButton type="button">Save Tax Settings</AdminButton>
        </div>
      </div>
    </SectionCard>
  )
}
