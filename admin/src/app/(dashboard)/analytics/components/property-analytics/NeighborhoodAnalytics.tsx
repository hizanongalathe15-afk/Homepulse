'use client'

import { useState } from 'react'
import { SectionCard } from '@/components/features/SectionCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { AdminDrawer } from '@/components/ui/AdminDrawer'
import { AdminButton } from '@/components/ui/AdminButton'

const neighborhoods = [
  { name: 'Westlands', city: 'Nairobi', listings: 1240, avgPrice: 1850, occupancy: 92, trend: 'up', activeListings: 1142, avgDays: 12, topType: 'apartment' },
  { name: 'Kilimani', city: 'Nairobi', listings: 1680, avgPrice: 1720, occupancy: 89, trend: 'up', activeListings: 1495, avgDays: 18, topType: 'apartment' },
  { name: 'Karen', city: 'Nairobi', listings: 690, avgPrice: 2400, occupancy: 84, trend: 'neutral', activeListings: 579, avgDays: 24, topType: 'house' },
  { name: 'Kasarani', city: 'Nairobi', listings: 980, avgPrice: 880, occupancy: 86, trend: 'up', activeListings: 842, avgDays: 15, topType: 'apartment' },
  { name: 'Ngong Rd', city: 'Nairobi', listings: 720, avgPrice: 1280, occupancy: 79, trend: 'down', activeListings: 568, avgDays: 28, topType: 'apartment' },
  { name: 'Ruiru', city: 'Nairobi', listings: 410, avgPrice: 650, occupancy: 81, trend: 'up', activeListings: 332, avgDays: 20, topType: 'house' },
]

export default function NeighborhoodAnalytics() {
  const [selected, setSelected] = useState<(typeof neighborhoods)[0] | null>(null)

  return (
    <>
      <SectionCard title="Neighborhood Analytics" description="Listing performance by neighborhood">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead className="admin-table-header bg-slate-50/50">
              <tr>
                <th className="admin-table-cell text-left font-medium text-slate-500">Neighborhood</th>
                <th className="admin-table-cell text-left font-medium text-slate-500">City</th>
                <th className="admin-table-cell text-left font-medium text-slate-500">Listings</th>
                <th className="admin-table-cell text-left font-medium text-slate-500">Avg Price</th>
                <th className="admin-table-cell text-left font-medium text-slate-500">Occupancy</th>
                <th className="admin-table-cell text-left font-medium text-slate-500">Trend</th>
              </tr>
            </thead>
            <tbody className="admin-table-body">
              {neighborhoods.map((n) => (
                <tr
                  key={n.name}
                  className="admin-table-row cursor-pointer"
                  onClick={() => setSelected(n)}
                >
                  <td className="admin-table-cell text-slate-900 font-medium">{n.name}</td>
                  <td className="admin-table-cell text-slate-900">{n.city}</td>
                  <td className="admin-table-cell text-slate-900">{n.listings.toLocaleString()}</td>
                  <td className="admin-table-cell text-slate-900">${n.avgPrice.toLocaleString()}</td>
                  <td className="admin-table-cell text-slate-900">{n.occupancy}%</td>
                  <td className="admin-table-cell">
                    <StatusBadge
                      variant={n.trend === 'up' ? 'success' : n.trend === 'down' ? 'destructive' : 'default'}
                      label={n.trend === 'up' ? 'Growing' : n.trend === 'down' ? 'Cooling' : 'Stable'}
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
        title={selected?.name}
        description={`Granular breakdown for ${selected?.name}, ${selected?.city}`}
      >
        {selected && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-slate-200/60 bg-white/50 p-4">
                <p className="text-xs font-medium text-slate-500">Total Listings</p>
                <p className="text-xl font-bold text-slate-900 mt-1">{selected.listings.toLocaleString()}</p>
              </div>
              <div className="rounded-lg border border-slate-200/60 bg-white/50 p-4">
                <p className="text-xs font-medium text-slate-500">Active Listings</p>
                <p className="text-xl font-bold text-slate-900 mt-1">{selected.activeListings.toLocaleString()}</p>
              </div>
              <div className="rounded-lg border border-slate-200/60 bg-white/50 p-4">
                <p className="text-xs font-medium text-slate-500">Avg Price</p>
                <p className="text-xl font-bold text-slate-900 mt-1">${selected.avgPrice.toLocaleString()}</p>
              </div>
              <div className="rounded-lg border border-slate-200/60 bg-white/50 p-4">
                <p className="text-xs font-medium text-slate-500">Occupancy</p>
                <p className="text-xl font-bold text-slate-900 mt-1">{selected.occupancy}%</p>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200/60 bg-white/50 p-4">
              <p className="text-xs font-medium text-slate-500 mb-2">Property Type Distribution</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '65%' }} />
                </div>
                <span className="text-xs font-medium text-slate-700">65% {selected.topType}</span>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200/60 bg-white/50 p-4">
              <p className="text-xs font-medium text-slate-500 mb-1">Avg Days on Market</p>
              <p className="text-lg font-semibold text-slate-900">{selected.avgDays} days</p>
            </div>

            <div className="rounded-lg border border-slate-200/60 bg-white/50 p-4">
              <p className="text-xs font-medium text-slate-500 mb-3">Trend Direction</p>
              <StatusBadge
                variant={selected.trend === 'up' ? 'success' : selected.trend === 'down' ? 'destructive' : 'default'}
                label={selected.trend === 'up' ? 'Growing' : selected.trend === 'down' ? 'Cooling' : 'Stable'}
              />
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
