'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, MoreVertical, Edit2, Trash2, Eye, MousePointerClick } from 'lucide-react'
import { AdminHeader } from '@/components/ui/AdminHeader'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlassButton } from '@/components/ui/GlassButton'
import { GlassInput } from '@/components/ui/GlassInput'
import { GlassBadge } from '@/components/ui/GlassBadge'
import { GlassTable } from '@/components/ui/GlassTable'
import { GlassModal } from '@/components/ui/GlassModal'
import { GlassDropdown } from '@/components/ui/GlassDropdown'
import { GlassTabs } from '@/components/ui/GlassTabs'
import { SkeletonLoader } from '@/components/ui/SkeletonLoader'
import { CardSkeleton } from '@/components/ui/SkeletonLoader'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { adminAdService } from '@/services/adminAd.service'
import type { AdCampaign, AdCampaignFilters, AdCampaignStats } from '@/types/ad.types'
import { format, formatDistanceToNow } from 'date-fns'

const statusVariantMap: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'accent'> = {
  draft: 'default',
  active: 'success',
  paused: 'warning',
  completed: 'info',
  cancelled: 'error',
}

export default function AdsDashboardPage() {
  const router = useRouter()
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([])
  const [stats, setStats] = useState<AdCampaignStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<AdCampaign | null>(null)

  const fetchCampaigns = useCallback(async () => {
    setLoading(true)
    try {
      const filters: AdCampaignFilters = {
        page,
        limit: 20,
        search: searchQuery || undefined,
        status: statusFilter || undefined,
      }
      const result = await adminAdService.getAdCampaigns(filters)
      setCampaigns(result.data)
      setHasMore(result.hasMore)
    } catch (error) {
      console.error('Failed to fetch ad campaigns:', error)
    } finally {
      setLoading(false)
    }
  }, [page, searchQuery, statusFilter])

  const fetchStats = useCallback(async () => {
    try {
      const result = await adminAdService.getAdCampaignStats()
      setStats(result)
    } catch (error) {
      console.error('Failed to fetch ad stats:', error)
    }
  }, [])

  useEffect(() => {
    fetchCampaigns()
  }, [fetchCampaigns])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const handleDelete = async () => {
    if (!selectedCampaign) return
    try {
      await adminAdService.deleteAdCampaign(selectedCampaign.id)
      setDeleteModalOpen(false)
      setSelectedCampaign(null)
      fetchCampaigns()
      fetchStats()
    } catch (error) {
      console.error('Failed to delete ad campaign:', error)
    }
  }

  const columns = [
    { key: 'title', header: 'Campaign', render: (item: AdCampaign) => (
      <div className="flex items-center gap-3">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover border border-neutral-200" />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-400">
            <Eye size={16} />
          </div>
        )}
        <div>
          <div className="font-medium text-neutral-900">{item.title}</div>
          <div className="text-xs text-neutral-500 line-clamp-1">{item.description}</div>
        </div>
      </div>
    )},
    { key: 'status', header: 'Status', render: (item: AdCampaign) => (
      <GlassBadge variant={statusVariantMap[item.status] || 'default'} dot>
        {item.status}
      </GlassBadge>
    )},
    { key: 'targetType', header: 'Target', render: (item: AdCampaign) => item.targetType || '-' },
    { key: 'dates', header: 'Dates', render: (item: AdCampaign) => (
      <div className="text-sm">
        <div>{format(new Date(item.startDate), 'MMM dd, yyyy')}</div>
        <div className="text-xs text-neutral-400">to {format(new Date(item.endDate), 'MMM dd, yyyy')}</div>
      </div>
    )},
    { key: 'budget', header: 'Budget', align: 'right' as const, render: (item: AdCampaign) => (
      <div className="text-right">
        <div className="font-medium">${item.budget.toLocaleString()}</div>
        <div className="text-xs text-neutral-400">${item.spent.toLocaleString()} spent</div>
      </div>
    )},
    { key: 'impressions', header: 'Impressions', align: 'right' as const, render: (item: AdCampaign) => item.impressions.toLocaleString() },
    { key: 'clicks', header: 'Clicks', align: 'right' as const, render: (item: AdCampaign) => item.clicks.toLocaleString() },
    { key: 'ctr', header: 'CTR', align: 'right' as const, render: (item: AdCampaign) => (
      <div className="flex items-center gap-1 justify-end">
        <MousePointerClick size={12} className="text-neutral-400" />
        <span>{item.impressions > 0 ? ((item.clicks / item.impressions) * 100).toFixed(2) : '0.00'}%</span>
      </div>
    )},
    { key: 'createdAt', header: 'Created', render: (item: AdCampaign) => (
      <div className="text-sm text-neutral-500">{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</div>
    )},
    { key: 'actions', header: '', width: '60px', align: 'right' as const, render: (item: AdCampaign) => (
      <GlassDropdown
        align="right"
        trigger={
          <button className="p-1.5 rounded-md hover:bg-neutral-100 transition-colors text-neutral-400 hover:text-neutral-600">
            <MoreVertical size={16} />
          </button>
        }
        items={[
          { label: 'Edit', icon: <Edit2 size={14} />, onClick: () => router.push(`/ads/${item.id}`) },
          { label: 'Delete', icon: <Trash2 size={14} />, danger: true, onClick: () => { setSelectedCampaign(item); setDeleteModalOpen(true) } },
        ]}
      />
    )},
  ]

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Ad Campaigns"
        description="Manage advertising campaigns, budgets, and performance."
        actions={
          <Link href="/ads/new">
            <GlassButton leftIcon={<Plus size={16} />}>New Campaign</GlassButton>
          </Link>
        }
      />

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <GlassCard variant="flat" padding="md">
            <div className="text-sm text-neutral-500 mb-1">Total Campaigns</div>
            <div className="text-2xl font-semibold text-neutral-900">{stats.totalCampaigns}</div>
          </GlassCard>
          <GlassCard variant="flat" padding="md">
            <div className="text-sm text-neutral-500 mb-1">Active</div>
            <div className="text-2xl font-semibold text-emerald-600">{stats.activeCampaigns}</div>
          </GlassCard>
          <GlassCard variant="flat" padding="md">
            <div className="text-sm text-neutral-500 mb-1">Total Impressions</div>
            <div className="text-2xl font-semibold text-neutral-900">{stats.totalImpressions.toLocaleString()}</div>
          </GlassCard>
          <GlassCard variant="flat" padding="md">
            <div className="text-sm text-neutral-500 mb-1">Avg. CTR</div>
            <div className="text-2xl font-semibold text-neutral-900">{stats.ctr.toFixed(2)}%</div>
          </GlassCard>
        </div>
      )}

      <GlassTabs
        tabs={[
          { id: 'all', label: 'All', content: null },
          { id: 'active', label: 'Active', content: null },
          { id: 'draft', label: 'Draft', content: null },
          { id: 'paused', label: 'Paused', content: null },
        ]}
        defaultTab={statusFilter || 'all'}
      />

      <GlassCard variant="elevated">
        <div className="ds-card-header flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px] max-w-md">
            <GlassInput
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search size={16} />}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="ds-select ds-input w-auto"
          >
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        {loading ? (
          <div className="ds-card-body">
            <CardSkeleton />
          </div>
        ) : (
          <GlassTable
            data={campaigns}
            columns={columns}
            emptyMessage="No ad campaigns found. Create your first campaign to get started."
            onRowClick={(item) => router.push(`/ads/${item.id}`)}
          />
        )}
      </GlassCard>

      {hasMore && !loading && (
        <div className="flex justify-center">
          <GlassButton variant="secondary" onClick={() => setPage(p => p + 1)}>
            Load More
          </GlassButton>
        </div>
      )}

      <GlassModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Campaign"
        description="Are you sure you want to delete this ad campaign? This action cannot be undone."
        footer={
          <>
            <GlassButton variant="secondary" onClick={() => setDeleteModalOpen(false)}>Cancel</GlassButton>
            <GlassButton variant="danger" onClick={handleDelete}>Delete</GlassButton>
          </>
        }
      >
        {selectedCampaign && (
          <div className="space-y-2">
            <p className="text-sm text-neutral-600">
              You are about to delete <strong>{selectedCampaign.title}</strong>.
            </p>
          </div>
        )}
      </GlassModal>
    </div>
  )
}
