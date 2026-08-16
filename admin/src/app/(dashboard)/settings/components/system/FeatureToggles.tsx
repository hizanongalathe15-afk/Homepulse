'use client'

import { Toggle } from '@/components/features/Toggle'
import { SectionCard } from '@/components/features/SectionCard'
import { AdminButton } from '@/components/ui/AdminButton'

const features = [
  { id: 'f1', name: 'Property Reviews', description: 'Allow tenants to review properties', enabled: true },
  { id: 'f2', name: 'Virtual Tours', description: 'Enable 360° virtual property tours', enabled: true },
  { id: 'f3', name: 'AI Recommendations', description: 'AI-powered property matching', enabled: false },
  { id: 'f4', name: 'Subscription Billing', description: 'Recurring landlord subscriptions', enabled: true },
  { id: 'f5', name: 'Document Verification', description: 'Automated ID and title verification', enabled: false },
  { id: 'f6', name: 'Chat Support', description: 'In-app messaging between tenants and landlords', enabled: true },
]

export default function FeatureToggles() {
  return (
    <SectionCard title="Feature Toggles" description="Enable or disable platform features without deploying code.">
      <div className="space-y-4">
        {features.map((feature) => (
          <div key={feature.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
            <div>
              <p className="text-sm font-medium text-slate-900">{feature.name}</p>
              <p className="text-xs text-slate-500">{feature.description}</p>
            </div>
            <Toggle checked={feature.enabled} onChange={() => {}} />
          </div>
        ))}
        <div className="flex justify-end pt-2">
          <AdminButton type="button">Save Changes</AdminButton>
        </div>
      </div>
    </SectionCard>
  )
}
