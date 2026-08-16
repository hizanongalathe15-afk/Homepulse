'use client'

import type { FraudCase } from '@/types/fraud.types'
import { SectionCard } from '@/components/features/SectionCard'
import { InfoRow } from '@/components/features/InfoRow'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { AdminButton } from '@/components/ui/AdminButton'
import { CheckCircle2, XCircle, Ban, MailWarning } from 'lucide-react'

const reviewQueue: FraudCase[] = [
  {
    id: 'FRA-1003', caseNumber: 'HP-FRA-484', alertId: 'ALR-1003', type: 'account', severity: 'medium', status: 'open',
    assignee: 'Unassigned', userId: 'USR-1003', userName: 'Amina Hassan',
    description: 'Unusual login pattern: 5 countries in 1 hour',
    evidence: ['access_logs.txt'], createdAt: new Date('2026-08-14T09:15:00'), updatedAt: new Date('2026-08-14T09:15:00'),
  },
  {
    id: 'FRA-1005', caseNumber: 'HP-FRA-486', alertId: 'ALR-1005', type: 'payment', severity: 'medium', status: 'open',
    assignee: 'Unassigned', userId: 'USR-1005', userName: 'Grace Njoroge',
    description: 'Refund abuse pattern detected',
    evidence: ['transactions.csv'], createdAt: new Date('2026-08-13T11:00:00'), updatedAt: new Date('2026-08-13T11:00:00'),
  },
]

export default function FraudManualReview() {
  return (
    <div className="space-y-6">
      <SectionCard title="Review Queue" description="Cases requiring manual investigation">
        <div className="space-y-4">
          {reviewQueue.map((c) => (
            <div key={c.id} className="p-4 border border-slate-200 rounded-md space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-slate-900">{c.caseNumber}</p>
                    <StatusBadge variant={c.severity === 'critical' || c.severity === 'high' ? 'destructive' : 'warning'} label={c.severity} />
                    <StatusBadge variant="info" label={c.type} />
                  </div>
                  <p className="text-sm text-slate-600">{c.description}</p>
                  <p className="text-xs text-slate-500 mt-1">User: {c.userName} · Reported: {c.createdAt.toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <AdminButton variant="outline" size="sm"><CheckCircle2 size={16} className="mr-2" />Approve</AdminButton>
                  <AdminButton variant="destructive" size="sm"><XCircle size={16} className="mr-2" />Reject</AdminButton>
                  <AdminButton variant="outline" size="sm"><Ban size={16} className="mr-2" />Ban User</AdminButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Review History" description="Recently reviewed cases">
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div>
              <p className="text-sm font-medium text-slate-900">HP-FRA-480</p>
              <p className="text-xs text-slate-500">Listing scam · Jane Doe</p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge variant="success" label="Resolved" />
              <span className="text-xs text-slate-400">2 hours ago</span>
            </div>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div>
              <p className="text-sm font-medium text-slate-900">HP-FRA-479</p>
              <p className="text-xs text-slate-500">Payment fraud · Bob Smith</p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge variant="destructive" label="Dismissed" />
              <span className="text-xs text-slate-400">5 hours ago</span>
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-slate-900">HP-FRA-478</p>
              <p className="text-xs text-slate-500">Account takeover · Alice Brown</p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge variant="success" label="Resolved" />
              <span className="text-xs text-slate-400">1 day ago</span>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}
