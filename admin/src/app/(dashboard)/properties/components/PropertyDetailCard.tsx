'use client'

import { useEffect, useState } from 'react'
import { SectionCard } from '@/components/features/SectionCard'
import { InfoRow } from '@/components/features/InfoRow'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { AdminButton } from '@/components/ui/AdminButton'
import { Loader2 } from 'lucide-react'
import type { Property } from '@/types/property.types'
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

export default function PropertyDetailCard({ propertyId }: { propertyId: string }) {
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await adminPropertyService.getProperty(propertyId)
        setProperty(data)
      } catch (err) {
        setError('Failed to load property')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProperty()
  }, [propertyId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="text-center text-red-500 py-8">
        {error || 'Property not found'}
      </div>
    )
  }

  return (
    <SectionCard
      title={property.title}
      description={`${property.city}${property.neighborhood ? ', ' + property.neighborhood : ''}`}
      action={
        <div className="flex gap-2">
          <StatusBadge variant={statusVariant(property.status)} label={String(property.status).toLowerCase()} />
          <AdminButton variant="outline" size="sm">
            Edit
          </AdminButton>
        </div>
      }
    >
      <p className="text-sm text-slate-600 mb-4">{property.description || 'No description provided'}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoRow label="Price" value={`${property.currency || 'KES'} ${property.price?.toLocaleString() || 0}`} />
        <InfoRow label="Type" value={String(property.type).toLowerCase()} />
        <InfoRow label="Landlord" value={property.landlord ? `${property.landlord.firstName} ${property.landlord.lastName}` : (property.landlordName || property.landlordId)} />
        <InfoRow label="Listed" value={new Date(property.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} />
      </div>
      <div className="mt-4 pt-4 border-t border-slate-100">
        <p className="text-sm font-medium text-slate-700 mb-2">Amenities</p>
        <div className="flex flex-wrap gap-2">
          {(property.amenities || []).map((amenity) => (
            <span key={amenity} className="px-2.5 py-1 rounded-full bg-slate-100 text-xs font-medium text-slate-600">
              {amenity}
            </span>
          ))}
        </div>
      </div>
    </SectionCard>
  )
}
