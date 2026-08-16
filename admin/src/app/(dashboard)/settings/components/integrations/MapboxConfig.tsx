'use client'

import { Map } from 'lucide-react'
import { SectionCard } from '@/components/features/SectionCard'
import { AdminInput } from '@/components/ui/AdminInput'
import { AdminButton } from '@/components/ui/AdminButton'
import { Toggle } from '@/components/features/Toggle'
import { StatusBadge } from '@/components/ui/StatusBadge'

export default function MapboxConfig() {
  return (
    <SectionCard title="Mapbox Configuration" description="Configure map provider for property locations.">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-900">Enable Maps</p>
            <p className="text-xs text-slate-500">Show interactive maps on property pages</p>
          </div>
          <Toggle checked={true} onChange={() => {}} />
        </div>
        <AdminInput label="Mapbox Public Token" defaultValue="pk.eyJ1Ijoi..." />
        <AdminInput label="Mapbox Secret Token" type="password" defaultValue="sk.eyJ1Ijoi..." />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Default Style</label>
            <select className="admin-input">
              <option>Mapbox Streets</option>
              <option>Mapbox Satellite</option>
              <option>Mapbox Light</option>
              <option>Mapbox Dark</option>
            </select>
          </div>
          <AdminInput label="Default Zoom" type="number" defaultValue="12" />
        </div>
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
          <div>
            <p className="text-sm font-medium text-slate-900">Geocoding Enabled</p>
            <p className="text-xs text-slate-500">Convert addresses to coordinates automatically</p>
          </div>
          <StatusBadge variant="success" label="Active" />
        </div>
        <div className="flex justify-end pt-2">
          <AdminButton type="button">Save Map Settings</AdminButton>
        </div>
      </div>
    </SectionCard>
  )
}
