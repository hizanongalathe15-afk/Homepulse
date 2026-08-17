'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { AdminHeader } from '@/components/ui/AdminHeader'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlassButton } from '@/components/ui/GlassButton'
import { GlassInput } from '@/components/ui/GlassInput'
import { GlassBadge } from '@/components/ui/GlassBadge'
import { GlassModal } from '@/components/ui/GlassModal'
import { GlassTabs } from '@/components/ui/GlassTabs'
import { adminAdService } from '@/services/adminAd.service'
import type { AdCampaign, AdCampaignStats } from '@/types/ad.types'
import { format } from 'date-fns'

export default function AdCampaignEditPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id

  const [campaign, setCampaign] = useState<AdCampaign | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    linkUrl: '',
    targetPage: '',
    targetType: 'PROPERTY',
    targetId: '',
    startDate: '',
    endDate: '',
    budget: '',
    priority: '0',
    status: 'draft',
  })

  useEffect(() => {
    async function fetchCampaign() {
      if (!id) return
      try {
        const data = await adminAdService.getAdCampaign(id)
        setCampaign(data)
        setFormData({
          title: data.title,
          description: data.description || '',
          imageUrl: data.imageUrl || '',
          linkUrl: data.linkUrl || '',
          targetPage: data.targetPage || '',
          targetType: data.targetType || 'PROPERTY',
          targetId: data.targetId || '',
          startDate: data.startDate ? format(new Date(data.startDate), 'yyyy-MM-dd') : '',
          endDate: data.endDate ? format(new Date(data.endDate), 'yyyy-MM-dd') : '',
          budget: String(data.budget),
          priority: String(data.priority || 0),
          status: data.status,
        })
      } catch (error) {
        console.error('Failed to fetch ad campaign:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCampaign()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return
    setSaving(true)
    try {
      await adminAdService.updateAdCampaign(id, {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        budget: parseFloat(formData.budget),
        priority: parseInt(formData.priority, 10),
      })
      alert('Campaign updated successfully')
    } catch (error) {
      console.error('Failed to update campaign:', error)
      alert('Failed to update campaign')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!id) return
    try {
      await adminAdService.deleteAdCampaign(id)
      window.location.href = '/ads'
    } catch (error) {
      console.error('Failed to delete campaign:', error)
      alert('Failed to delete campaign')
    }
  }

  const statusVariant = campaign?.status ? (status => {
    switch (status) {
      case 'active': return 'success'
      case 'paused': return 'warning'
      case 'completed': return 'info'
      case 'cancelled': return 'error'
      default: return 'default'
    }
  })(campaign.status) : 'default'

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-neutral-200 rounded animate-pulse" />
        <div className="h-64 bg-neutral-200 rounded-lg animate-pulse" />
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="space-y-6">
        <AdminHeader title="Campaign Not Found" description="The requested campaign could not be found." />
        <Link href="/ads">
          <GlassButton leftIcon={<ArrowLeft size={16} />}>Back to Campaigns</GlassButton>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AdminHeader
        title={campaign.title}
        description={`Campaign ID: ${campaign.id}`}
        breadcrumbs={[
          { label: 'Campaigns', href: '/ads' },
          { label: campaign.title },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <GlassBadge variant={statusVariant} dot>{campaign.status}</GlassBadge>
            <GlassButton variant="danger" onClick={() => setShowDeleteModal(true)}>Delete</GlassButton>
          </div>
        }
      />

      <GlassTabs
        tabs={[
          { id: 'details', label: 'Details', content: (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard variant="flat" padding="lg">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">General Information</h3>
                  <div className="space-y-4">
                    <GlassInput label="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                    <div>
                      <label className="ds-label">Description</label>
                      <textarea
                        className="ds-textarea"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Campaign description..."
                      />
                    </div>
                    <GlassInput label="Image URL" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} placeholder="https://..." />
                    <GlassInput label="Link URL" value={formData.linkUrl} onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })} placeholder="https://..." />
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
                    <GlassInput label="Target Page" value={formData.targetPage} onChange={(e) => setFormData({ ...formData, targetPage: e.target.value })} />
                    <GlassInput label="Target ID" value={formData.targetId} onChange={(e) => setFormData({ ...formData, targetId: e.target.value })} />
                  </div>
                </GlassCard>

                <GlassCard variant="flat" padding="lg">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Schedule</h3>
                  <div className="space-y-4">
                    <GlassInput label="Start Date" type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} required />
                    <GlassInput label="End Date" type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} required />
                  </div>
                </GlassCard>

                <GlassCard variant="flat" padding="lg">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Budget & Priority</h3>
                  <div className="space-y-4">
                    <GlassInput label="Budget (KES)" type="number" value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value })} required />
                    <div>
                      <label className="ds-label">Status</label>
                      <select
                        className="ds-select ds-input"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      >
                        <option value="draft">Draft</option>
                        <option value="active">Active</option>
                        <option value="paused">Paused</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <GlassInput label="Priority" type="number" value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} />
                  </div>
                </GlassCard>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <Link href="/ads">
                  <GlassButton variant="secondary" type="button">Cancel</GlassButton>
                </Link>
                <GlassButton type="submit" loading={saving}>Save Changes</GlassButton>
              </div>
            </form>
          )},
          { id: 'performance', label: 'Performance', content: (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <GlassCard variant="flat" padding="md">
                  <div className="text-sm text-neutral-500 mb-1">Impressions</div>
                  <div className="text-2xl font-semibold text-neutral-900">{campaign.impressions.toLocaleString()}</div>
                </GlassCard>
                <GlassCard variant="flat" padding="md">
                  <div className="text-sm text-neutral-500 mb-1">Clicks</div>
                  <div className="text-2xl font-semibold text-neutral-900">{campaign.clicks.toLocaleString()}</div>
                </GlassCard>
                <GlassCard variant="flat" padding="md">
                  <div className="text-sm text-neutral-500 mb-1">CTR</div>
                  <div className="text-2xl font-semibold text-neutral-900">
                    {campaign.impressions > 0 ? ((campaign.clicks / campaign.impressions) * 100).toFixed(2) : '0.00'}%
                  </div>
                </GlassCard>
                <GlassCard variant="flat" padding="md">
                  <div className="text-sm text-neutral-500 mb-1">Budget Used</div>
                  <div className="text-2xl font-semibold text-neutral-900">
                    ${campaign.budget > 0 ? ((campaign.spent / campaign.budget) * 100).toFixed(1) : '0.0'}%
                  </div>
                </GlassCard>
              </div>
              <GlassCard variant="flat" padding="lg">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Campaign Metadata</h3>
                <pre className="text-sm text-neutral-600 bg-neutral-50 rounded-lg p-4 overflow-auto">
                  {JSON.stringify(campaign.metadata || {}, null, 2)}
                </pre>
              </GlassCard>
            </div>
          )},
        ]}
      />

      <GlassModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        title="Delete Campaign"
        description="Are you sure you want to delete this ad campaign? This action cannot be undone."
        footer={
          <>
            <GlassButton variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</GlassButton>
            <GlassButton variant="danger" onClick={handleDelete}>Delete</GlassButton>
          </>
        }
      >
        <div className="space-y-2">
          <p className="text-sm text-neutral-600">
            You are about to delete <strong>{campaign.title}</strong>.
          </p>
        </div>
      </GlassModal>
    </div>
  )
}
