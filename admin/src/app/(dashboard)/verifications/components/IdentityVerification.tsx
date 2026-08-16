'use client'

import { SectionCard } from '@/components/features/SectionCard'
import { InfoRow } from '@/components/features/InfoRow'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { AdminButton } from '@/components/ui/AdminButton'

const match = 97

export default function IdentityVerification() {
  return (
    <SectionCard
      title="Identity Verification"
      description="Selfie and National ID match analysis"
      action={<StatusBadge variant={match >= 90 ? 'success' : 'warning'} label={`${match}% match`} />}
    >
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="rounded-lg border border-slate-100 aspect-square bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
          <span className="text-xs text-slate-400">ID Photo</span>
        </div>
        <div className="rounded-lg border border-slate-100 aspect-square bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
          <span className="text-xs text-slate-400">Selfie</span>
        </div>
      </div>

      <div>
        <InfoRow label="Face match score" value={`${match}%`} />
        <InfoRow label="Liveness check" value="Passed" />
        <InfoRow label="Document authenticity" value="Valid" />
        <InfoRow label="Expiry date" value="2029-11-20" />
      </div>

      <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
        <AdminButton variant="outline">Re-run Check</AdminButton>
        <AdminButton>Approve Identity</AdminButton>
      </div>
    </SectionCard>
  )
}