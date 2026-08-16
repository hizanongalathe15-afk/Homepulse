'use client'

import { useState } from 'react'
import { Flag } from 'lucide-react'
import { DataTable } from '@/components/ui/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { AdminButton } from '@/components/ui/AdminButton'
import { AdminModal } from '@/components/ui/AdminModal'
import { AdminInput } from '@/components/ui/AdminInput'

interface Campaign {
  id: string
  name: string
  channel: string
  budget: number
  spent: number
  status: 'active' | 'paused' | 'completed' | 'cancelled'
  flagged?: boolean
}

const initial: Campaign[] = [
  { id: 'CAM-001', name: 'Back-to-School Housing', channel: 'social', budget: 12000, spent: 8900, status: 'active' },
  { id: 'CAM-002', name: 'Beachside Thika Promo', channel: 'email', budget: 8000, spent: 6200, status: 'active' },
  { id: 'CAM-003', name: 'Student Accommodation', channel: 'sms', budget: 5000, spent: 4100, status: 'paused' },
  { id: 'CAM-004', name: 'Corporate Relocation', channel: 'outdoor', budget: 15000, spent: 13400, status: 'completed' },
  { id: 'CAM-005', name: 'First-Renter Discount', channel: 'referral', budget: 3000, spent: 2250, status: 'active', flagged: true },
]

export default function CampaignList() {
  const [campaigns] = useState(initial)
  const [flagOpen, setFlagOpen] = useState(false)
  const [flagReason, setFlagReason] = useState('')

  return (
    <>
      <DataTable<Campaign>
        data={campaigns}
        searchPlaceholder="Search campaigns..."
        columns={[
          { key: 'name', header: 'Campaign', render: (c) => <span className="font-medium text-slate-900">{c.name}</span> },
          { key: 'channel', header: 'Channel', render: (c) => <span className="capitalize">{c.channel}</span> },
          { key: 'budget', header: 'Budget', render: (c) => `$${c.budget.toLocaleString()}` },
          {
            key: 'spend',
            header: 'Spend',
            render: (c) => (
              <div>
                <span>${c.spent.toLocaleString()}</span>
                <span className="text-xs text-slate-400 ml-1">({Math.round((c.spent / c.budget) * 100)}%)</span>
              </div>
            ),
          },
          {
            key: 'status',
            header: 'Status',
            render: (c) => (
              <div className="flex items-center gap-2">
                <StatusBadge
                  variant={c.status === 'active' ? 'success' : c.status === 'completed' ? 'info' : 'warning'}
                  label={c.status}
                />
                {c.flagged && <StatusBadge variant="destructive" label="Flagged" />}
              </div>
            ),
          },
          {
            key: 'actions',
            header: 'Actions',
            render: () => (
              <div className="flex gap-2">
                <AdminButton size="sm" variant="outline" onClick={() => setFlagOpen(true)}>
                  <Flag size={14} className="mr-1" /> Flag
                </AdminButton>
                <AdminButton size="sm" variant="outline">Details</AdminButton>
              </div>
            ),
          },
        ]}
      />

      <AdminModal open={flagOpen} onOpenChange={setFlagOpen} title="Flag Campaign" description="Report a campaign for review">
        <div className="space-y-4">
          <AdminInput
            label="Reason"
            placeholder="e.g. Misleading ad copy, unapproved incentives"
            value={flagReason}
            onChange={(e) => setFlagReason(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <AdminButton variant="outline" onClick={() => setFlagOpen(false)}>Cancel</AdminButton>
            <AdminButton variant="destructive" disabled={flagReason.trim() === ''} onClick={() => setFlagOpen(false)}>
              Flag Campaign
            </AdminButton>
          </div>
        </div>
      </AdminModal>
    </>
  )
}