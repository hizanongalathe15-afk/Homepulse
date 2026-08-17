'use client'

import { useEffect, useState } from 'react'
import type { Property } from '@/types/property.types'
import { DataTable } from '@/components/ui/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { adminPropertyService } from '@/services/adminProperty.service'

function statusVariant(status: Property['status']) {
  const normalized = String(status).toLowerCase()
  switch (normalized) {
    case 'active':
    case 'published':
      return 'success'
    case 'pending':
      return 'warning'
    case 'flagged':
      return 'destructive'
    case 'rejected':
    case 'deleted':
      return 'destructive'
    default:
      return 'default'
  }
}

export default function PropertyTable() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await adminPropertyService.getProperties({}, 1, 50)
        setProperties(response.data || [])
      } catch (err) {
        setError('Failed to load properties')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProperties()
  }, [])

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-12 bg-muted rounded animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>
  }

  return (
    <DataTable<Property>
      data={properties}
      searchPlaceholder="Search properties by title or location..."
      columns={[
        {
          key: 'title',
          header: 'Property',
          render: (p) => (
            <div>
              <p className="font-medium text-slate-900">{p.title}</p>
              <p className="text-xs text-slate-500">{p.city} · {p.neighborhood || p.address || ''}</p>
            </div>
          ),
        },
        {
          key: 'type',
          header: 'Type',
          render: (p) => <span className="capitalize">{String(p.type).toLowerCase()}</span>,
        },
        {
          key: 'price',
          header: 'Price',
          render: (p) => `${p.currency || 'KES'} ${p.price?.toLocaleString() || 0}`,
        },
        {
          key: 'landlord',
          header: 'Landlord',
          render: (p) => p.landlord ? `${p.landlord.firstName} ${p.landlord.lastName}` : (p.landlordName || p.landlordId),
        },
        {
          key: 'status',
          header: 'Status',
          render: (p) => <StatusBadge variant={statusVariant(p.status)} label={String(p.status).toLowerCase()} />,
        },
        {
          key: 'createdAt',
          header: 'Listed',
          render: (p) => new Date(p.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        },
      ]}
    />
  )
}
