'use client'

import { SectionCard } from '@/components/features/SectionCard'
import { StatusBadge } from '@/components/ui/StatusBadge'

const steps = [
  { stage: 'Sign-up', users: 48291, note: 'all registered users' },
  { stage: 'Verification', users: 38940, note: 'identity verified' },
  { stage: 'First Search', users: 34761, note: 'ran a property search' },
  { stage: 'First Contact', users: 20890, note: 'contacted a landlord' },
  { stage: 'Completed Booking', users: 12984, note: 'booked a property' },
]

export default function UserJourneyMap() {
  return (
    <SectionCard title="User Journey" description="Conversion through key onboarding milestones">
      <div className="space-y-3">
        {steps.map((step, index) => {
          const prior = index === 0 ? step.users : steps[index - 1].users
          const rate = Math.round((step.users / prior) * 100)
          return (
            <div key={step.stage} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm shrink-0">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-800">{step.stage}</span>
                  <span className="text-sm text-slate-500">
                    {step.users.toLocaleString()} users
                    {index > 0 && (
                      <StatusBadge variant={rate >= 60 ? 'success' : 'warning'} label={`${rate}%`} />
                    )}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{step.note}</p>
              </div>
            </div>
          )
        })}
      </div>
    </SectionCard>
  )
}