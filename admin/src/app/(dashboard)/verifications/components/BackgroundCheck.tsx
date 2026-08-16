'use client'

import { SectionCard } from '@/components/features/SectionCard'
import { InfoRow } from '@/components/features/InfoRow'
import { StatusBadge } from '@/components/ui/StatusBadge'

export default function BackgroundCheck() {
  return (
    <SectionCard
      title="Background Check"
      description="Criminal record and reference screening"
      action={<StatusBadge variant="success" label="Cleared" />}
    >
      <div>
        <InfoRow label="Criminal records" value="None found" />
        <InfoRow label="Credit check" value="Good standing" />
        <InfoRow label="Previous landlord reference" value="Positive (3 references)" />
        <InfoRow label="Identity watchlist" value="Not flagged" />
        <InfoRow label="Check completed" value="2026-08-05" />
      </div>

      <div className="mt-4 rounded-md bg-green-50 border border-green-100 p-3 text-sm text-green-700">
        No adverse information found. Applicant passes the standard background screening.
      </div>
    </SectionCard>
  )
}