'use client'

import { SectionCard } from '@/components/features/SectionCard'
import { StatusBadge } from '@/components/ui/StatusBadge'

const campaigns = [
  { name: 'Back-to-School Housing', code: 'HP-CMP-0042', scans: 22118, conversion: 9.8, status: 'active' },
  { name: 'Beachside Thika Promo', code: 'HP-CMP-0047', scans: 14500, conversion: 11.4, status: 'active' },
  { name: 'Student Accommodation', code: 'HP-CMP-0051', scans: 9210, conversion: 8.1, status: 'paused' },
  { name: 'Corporate Relocation', code: 'HP-CMP-0053', scans: 6540, conversion: 5.2, status: 'expired' },
]

export default function QRCampaigns() {
  return (
    <SectionCard title="QR Campaigns" description="QR codes attached to marketing campaigns">
      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead className="admin-table-header bg-slate-50">
            <tr>
              <th className="admin-table-cell text-left font-medium text-slate-500">Campaign</th>
              <th className="admin-table-cell text-left font-medium text-slate-500">Code</th>
              <th className="admin-table-cell text-left font-medium text-slate-500">Scans</th>
              <th className="admin-table-cell text-left font-medium text-slate-500">Conversion</th>
              <th className="admin-table-cell text-left font-medium text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody className="admin-table-body">
            {campaigns.map((c) => (
              <tr key={c.code} className="admin-table-row">
                <td className="admin-table-cell font-medium text-slate-900">{c.name}</td>
                <td className="admin-table-cell font-mono text-xs text-slate-900">{c.code}</td>
                <td className="admin-table-cell text-slate-900">{c.scans.toLocaleString()}</td>
                <td className="admin-table-cell text-slate-900">{c.conversion}%</td>
                <td className="admin-table-cell">
                  <StatusBadge
                    variant={c.status === 'active' ? 'success' : c.status === 'paused' ? 'warning' : 'default'}
                    label={c.status}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  )
}