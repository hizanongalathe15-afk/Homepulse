'use client'

import { useState } from 'react'
import { QrCode } from 'lucide-react'
import { AdminButton } from '@/components/ui/AdminButton'
import { AdminInput } from '@/components/ui/AdminInput'
import { SectionCard } from '@/components/features/SectionCard'

const propertyOptions = [
  'PROP-001 — Sunset Apartments, Westlands',
  'PROP-002 — Beachside Villa, Mombasa',
  'PROP-003 — Hillcrest House, Nakuru',
  'PROP-004 — Lakeview Flats, Kisumu',
]

export default function QRGenerator() {
  const [property, setProperty] = useState(propertyOptions[0])
  const [expiresAt, setExpiresAt] = useState('')
  const [generated, setGenerated] = useState<string | null>(null)

  const generate = () => {
    // In production: adminQRService.generateQR({ propertyId, type: 'property', expiresAt })
    setGenerated(`HP-${property.split(' — ')[0].replace('PROP-', '').padStart(4, '0')}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`)
  }

  return (
    <SectionCard title="Generate QR Code" description="Create a new scannable code for a property, campaign or neighbourhood">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
          <div className="flex gap-2">
            {['property', 'campaign', 'neighborhood'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setGenerated(null)}
                className={`px-3 py-1.5 rounded-md border text-sm capitalize ${
                  generated ? 'border-slate-200 text-slate-600' : 'border-primary bg-primary/10 text-primary font-medium'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Link to</label>
          <select className="admin-input" value={property} onChange={(e) => setProperty(e.target.value)}>
            {propertyOptions.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <AdminInput
          label="Expiry date (optional)"
          type="date"
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
        />

        <div className="flex items-center gap-3 pt-2">
          <AdminButton onClick={generate}>
            <QrCode size={14} className="mr-1.5" /> Generate Code
          </AdminButton>
          {generated && (
            <div className="text-sm">
              <span className="text-slate-500">New code:</span>{' '}
              <span className="font-mono font-semibold text-primary">{generated}</span>
            </div>
          )}
        </div>
      </div>
    </SectionCard>
  )
}