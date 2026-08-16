'use client'

import { useState } from 'react'
import { SectionCard } from '@/components/features/SectionCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { AdminDrawer } from '@/components/ui/AdminDrawer'
import { AdminButton } from '@/components/ui/AdminButton'

const codes = [
  { code: 'HP-NBO-WST-0012', property: 'Sunset Apartments, Westlands', city: 'Nairobi', scans: 48210, conversions: 5420, status: 'active', conversionRate: 11.2, lastScan: '2 min ago', type: 'property' },
  { code: 'HP-MSA-0088', property: 'Beachside Villa, Mombasa', city: 'Mombasa', scans: 31045, conversions: 3821, status: 'active', conversionRate: 12.3, lastScan: '5 min ago', type: 'property' },
  { code: 'HP-NKU-0156', property: 'Hillcrest House, Nakuru', city: 'Nakuru', scans: 22118, conversions: 1904, status: 'active', conversionRate: 8.6, lastScan: '12 min ago', type: 'property' },
  { code: 'HP-KSM-0092', property: 'Lakeview Flats, Kisumu', city: 'Kisumu', scans: 18560, conversions: 2012, status: 'expired', conversionRate: 10.8, lastScan: '1 hour ago', type: 'property' },
  { code: 'HP-NBO-0412', property: 'Green Park Residences', city: 'Nairobi', scans: 14903, conversions: 1130, status: 'inactive', conversionRate: 7.6, lastScan: '3 hours ago', type: 'property' },
]

export default function QRPerformance() {
  const [selected, setSelected] = useState<(typeof codes)[0] | null>(null)

  return (
    <>
      <SectionCard title="QR Performance" description="Top performing QR codes by scan count">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead className="admin-table-header bg-slate-50/50">
              <tr>
                <th className="admin-table-cell text-left font-medium text-slate-500">Code</th>
                <th className="admin-table-cell text-left font-medium text-slate-500">Property</th>
                <th className="admin-table-cell text-left font-medium text-slate-500">Scans</th>
                <th className="admin-table-cell text-left font-medium text-slate-500">Conversions</th>
                <th className="admin-table-cell text-left font-medium text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody className="admin-table-body">
              {codes.map((c) => (
                <tr
                  key={c.code}
                  className="admin-table-row cursor-pointer"
                  onClick={() => setSelected(c)}
                >
                  <td className="admin-table-cell font-mono text-xs text-slate-900">{c.code}</td>
                  <td className="admin-table-cell text-slate-900">{c.property}</td>
                  <td className="admin-table-cell text-slate-900">{c.scans.toLocaleString()}</td>
                  <td className="admin-table-cell text-slate-900">{c.conversions.toLocaleString()}</td>
                  <td className="admin-table-cell">
                    <StatusBadge
                      variant={c.status === 'active' ? 'success' : c.status === 'expired' ? 'default' : 'warning'}
                      label={c.status}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <AdminDrawer
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
        title={selected?.code}
        description={selected?.property}
      >
        {selected && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-slate-200/60 bg-white/50 p-4">
                <p className="text-xs font-medium text-slate-500">Total Scans</p>
                <p className="text-xl font-bold text-slate-900 mt-1">{selected.scans.toLocaleString()}</p>
              </div>
              <div className="rounded-lg border border-slate-200/60 bg-white/50 p-4">
                <p className="text-xs font-medium text-slate-500">Conversions</p>
                <p className="text-xl font-bold text-slate-900 mt-1">{selected.conversions.toLocaleString()}</p>
              </div>
              <div className="rounded-lg border border-slate-200/60 bg-white/50 p-4">
                <p className="text-xs font-medium text-slate-500">Conversion Rate</p>
                <p className="text-xl font-bold text-slate-900 mt-1">{selected.conversionRate}%</p>
              </div>
              <div className="rounded-lg border border-slate-200/60 bg-white/50 p-4">
                <p className="text-xs font-medium text-slate-500">Last Scan</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">{selected.lastScan}</p>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200/60 bg-white/50 p-4">
              <p className="text-xs font-medium text-slate-500 mb-1">QR Type</p>
              <StatusBadge variant="info" label={selected.type} />
            </div>

            <div className="rounded-lg border border-slate-200/60 bg-white/50 p-4">
              <p className="text-xs font-medium text-slate-500 mb-1">Status</p>
              <StatusBadge
                variant={selected.status === 'active' ? 'success' : selected.status === 'expired' ? 'default' : 'warning'}
                label={selected.status}
              />
            </div>

            <div className="rounded-lg border border-slate-200/60 bg-white/50 p-4">
              <p className="text-xs font-medium text-slate-500 mb-3">Conversion Funnel</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(selected.conversionRate * 5, 100)}%` }} />
                </div>
                <span className="text-xs font-medium text-slate-700">{selected.conversionRate}%</span>
              </div>
            </div>

            <AdminButton variant="outline" className="w-full" onClick={() => setSelected(null)}>
              Close Details
            </AdminButton>
          </div>
        )}
      </AdminDrawer>
    </>
  )
}
