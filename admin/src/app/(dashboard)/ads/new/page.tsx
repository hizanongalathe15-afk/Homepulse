'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { AdminHeader } from '@/components/ui/AdminHeader'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlassButton } from '@/components/ui/GlassButton'
import { GlassInput } from '@/components/ui/GlassInput'
import { adminAdService } from '@/services/adminAd.service'
import type { CreateAdCampaignInput } from '@/types/ad.types'

export default function NewAdCampaignPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState<CreateAdCampaignInput>({
    title: '',
    description: '',
    imageUrl: '',
    linkUrl: '',
    targetPage: '',
    targetType: 'PROPERTY',
    targetId: '',
    startDate: new Date(Date.now() + 86400000).toISOString(),
    endDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    budget: 0,
    priority: 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const campaign = await adminAdService.createAdCampaign(formData)
      router.push(`/ads/${campaign.id}`)
    } catch (err) {
      setError('Failed to create campaign. Please check your inputs and try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <AdminHeader
        title="New Ad Campaign"
        description="Create a new advertising campaign."
        breadcrumbs={[
          { label: 'Campaigns', href: '/ads' },
          { label: 'New Campaign' },
        ]}
      />

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard variant="flat" padding="lg">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">General Information</h3>
            <div className="space-y-4">
              <GlassInput
                label="Campaign Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Summer Promotion 2025"
                required
              />
              <div>
                <label className="ds-label">Description</label>
                <textarea
                  className="ds-textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the campaign..."
                />
              </div>
              <GlassInput
                label="Image URL"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
              <GlassInput
                label="Link URL"
                value={formData.linkUrl}
                onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                placeholder="https://example.com/landing"
              />
            </div>
          </GlassCard>

          <GlassCard variant="flat" padding="lg">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Targeting</h3>
            <div className="space-y-4">
              <div>
                <label className="ds-label">Target Type</label>
                <select
                  className="ds-select ds-input"
                  value={formData.targetType}
                  onChange={(e) => setFormData({ ...formData, targetType: e.target.value })}
                >
                  <option value="PROPERTY">Property</option>
                  <option value="EXTERNAL">External</option>
                  <option value="IN_APP">In-App</option>
                </select>
              </div>
              <GlassInput
                label="Target Page"
                value={formData.targetPage}
                onChange={(e) => setFormData({ ...formData, targetPage: e.target.value })}
                placeholder="e.g. /properties"
              />
              <GlassInput
                label="Target ID"
                value={formData.targetId}
                onChange={(e) => setFormData({ ...formData, targetId: e.target.value })}
                placeholder="Property ID (if PROPERTY type)"
              />
            </div>
          </GlassCard>

          <GlassCard variant="flat" padding="lg">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Schedule</h3>
            <div className="space-y-4">
              <GlassInput
                label="Start Date"
                type="date"
                value={formData.startDate ? new Date(formData.startDate).toISOString().split('T')[0] : ''}
                onChange={(e) => setFormData({ ...formData, startDate: new Date(e.target.value).toISOString() })}
                required
              />
              <GlassInput
                label="End Date"
                type="date"
                value={formData.endDate ? new Date(formData.endDate).toISOString().split('T')[0] : ''}
                onChange={(e) => setFormData({ ...formData, endDate: new Date(e.target.value).toISOString() })}
                required
              />
            </div>
          </GlassCard>

          <GlassCard variant="flat" padding="lg">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Budget & Priority</h3>
            <div className="space-y-4">
              <GlassInput
                label="Budget (KES)"
                type="number"
                min="0"
                step="0.01"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) || 0 })}
                required
              />
              <GlassInput
                label="Priority"
                type="number"
                min="0"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value, 10) || 0 })}
                hint="Higher priority campaigns are shown first"
              />
            </div>
          </GlassCard>
        </div>

        {error && (
          <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 mt-6">
          <Link href="/ads">
            <GlassButton variant="secondary" type="button">Cancel</GlassButton>
          </Link>
          <GlassButton type="submit" loading={loading}>
            Create Campaign
          </GlassButton>
        </div>
      </form>
    </div>
  )
}
