'use client'

import { useEffect, useState } from 'react'
import { SectionCard } from '@/components/features/SectionCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { AdminButton } from '@/components/ui/AdminButton'
import { adminPropertyService } from '@/services/adminProperty.service'
import type { Property } from '@/types/property.types'

interface ApprovalItem {
  id: string
  title: string
  landlord: string
  submitted: string
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}

export default function PropertyApprovalQueue() {
  const [queue, setQueue] = useState<ApprovalItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPending = async () => {
    try {
      setLoading(true)
      const response: { data: Property[]; total: number } = await adminPropertyService.getProperties(
        { status: 'pending' },
        1,
        20
      )
      const items = (response.data || []).map((p: Property) => ({
        id: p.id,
        title: p.title,
        landlord: p.landlordName || p.landlordId || 'Unknown',
        submitted: formatTimeAgo(p.createdAt),
      }))
      setQueue(items)
    } catch (err) {
      setError('Failed to load approval queue')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      await adminPropertyService.approveProperty(id)
      setQueue((prev) => prev.filter((item) => item.id !== id))
    } catch (err) {
      console.error('Failed to approve:', err)
    }
  }

  useEffect(() => {
    fetchPending()
  }, [])

  if (loading) {
    return (
      <SectionCard title="Approval Queue" description="Properties waiting for moderation review">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </SectionCard>
    )
  }

  if (error) {
    return (
      <SectionCard title="Approval Queue" description="Properties waiting for moderation review">
        <div className="text-center text-red-500 py-8">{error}</div>
      </SectionCard>
    )
  }

  return (
    <SectionCard
      title="Approval Queue"
      description="Properties waiting for moderation review"
      action={<StatusBadge variant="warning" label={`${queue.length} pending`} />}
    >
      <div className="divide-y divide-slate-100">
        {queue.map((item) => (
          <div key={item.id} className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-slate-800">{item.title}</p>
              <p className="text-xs text-slate-400">{item.landlord} · submitted {item.submitted}</p>
            </div>
            <div className="flex items-center gap-2">
              <AdminButton size="sm" variant="outline">Review</AdminButton>
              <AdminButton size="sm" onClick={() => handleApprove(item.id)}>Approve</AdminButton>
            </div>
          </div>
        ))}
        {queue.length === 0 && (
          <p className="text-sm text-slate-500 py-4">No properties pending approval</p>
        )}
      </div>
    </SectionCard>
  )
}