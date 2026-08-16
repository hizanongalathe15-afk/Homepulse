'use client'

import { useParams } from 'next/navigation'
import { AdminHeader } from '@/components/ui/AdminHeader'
import { SectionCard } from '@/components/features/SectionCard'
import { InfoRow } from '@/components/features/InfoRow'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { AdminButton } from '@/components/ui/AdminButton'
import { CheckCircle2, XCircle, Ban, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { FraudCase } from '@/types/fraud.types'

const fraudCase: FraudCase = {
  id: 'FRA-1001', caseNumber: 'HP-FRA-482', alertId: 'ALR-1001', type: 'payment', severity: 'critical', status: 'open',
  assignee: 'Mike T.', userId: 'USR-1001', userName: 'Unknown User', description: 'Multiple failed payment attempts from same user',
  evidence: ['screenshot1.png', 'logs.csv'], createdAt: new Date('2026-08-15T08:30:00'), updatedAt: new Date('2026-08-15T09:00:00'),
}

export default function FraudDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id ?? fraudCase.id

  return (
    <div className="space-y-6">
      <AdminHeader
        title={fraudCase.caseNumber}
        description={`Case: ${id} · ${fraudCase.type.replace('_', ' ')}`}
        breadcrumbs={[{ label: 'Fraud Detection', href: '/fraud-detection' }, { label: fraudCase.caseNumber }]}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/fraud-detection">
              <AdminButton variant="outline" size="sm">
                <ArrowLeft size={16} className="mr-2" />
                Back
              </AdminButton>
            </Link>
            <StatusBadge variant={fraudCase.severity === 'critical' || fraudCase.severity === 'high' ? 'destructive' : 'warning'} label={fraudCase.severity} />
            <StatusBadge variant={fraudCase.status === 'open' ? 'destructive' : fraudCase.status === 'under_review' ? 'warning' : 'success'} label={fraudCase.status} />
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <SectionCard title="Case Overview">
            <div>
              <InfoRow label="Type" value={fraudCase.type} />
              <InfoRow label="User" value={fraudCase.userName} />
              <InfoRow label="Severity" value={fraudCase.severity} />
              <InfoRow label="Assignee" value={fraudCase.assignee} />
              <InfoRow label="Status" value={fraudCase.status} />
              <InfoRow label="Created" value={fraudCase.createdAt.toLocaleString()} />
              <InfoRow label="Updated" value={fraudCase.updatedAt.toLocaleString()} />
            </div>
          </SectionCard>
          <SectionCard title="Actions">
            <div className="flex flex-col gap-2">
              <AdminButton className="w-full"><CheckCircle2 size={16} className="mr-2" />Resolve Case</AdminButton>
              <AdminButton variant="destructive" className="w-full"><XCircle size={16} className="mr-2" />Dismiss Case</AdminButton>
              <AdminButton variant="outline" className="w-full"><Ban size={16} className="mr-2" />Ban User</AdminButton>
            </div>
          </SectionCard>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <SectionCard title="Description">
            <p className="text-sm text-slate-700">{fraudCase.description}</p>
          </SectionCard>
          <SectionCard title="Evidence">
            <div className="space-y-2">
              {fraudCase.evidence.map((file) => (
                <div key={file} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <span className="text-sm text-slate-700">{file}</span>
                  <AdminButton variant="ghost" size="sm">Download</AdminButton>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  )
}
