'use client'

import { SectionCard } from '@/components/features/SectionCard'
import { InfoRow } from '@/components/features/InfoRow'
import { StatusBadge } from '@/components/ui/StatusBadge'
import type { Property } from '@/types/property.types'

const property: Property = {
  id: 'PROP-001', title: 'Sunset Apartments, Westlands', description: '2-bedroom modern apartment',
  type: 'apartment', status: 'approved', price: 45000, currency: 'USD',
  location: { city: 'Nairobi', neighborhood: 'Westlands', coordinates: { lat: -1.26, lng: 36.81 } },
  landlordId: 'USR-1001', landlordName: 'Mary Wanjiku', images: [], amenities: ['WiFi', 'Parking', 'Gym'],
  createdAt: new Date('2026-01-15'), updatedAt: new Date('2026-07-20'),
}

export default function PropertyDetailCard() {
  return (
    <SectionCard
      title={property.title}
      description={`${property.location.city}, ${property.location.neighborhood}`}
      action={
        <div className="flex gap-2">
          <StatusBadge
            variant={property.status === 'approved' ? 'success' : property.status === 'pending' ? 'warning' : 'destructive'}
            label={property.status}
          />
        </div>
      }
    >
      <p className="text-sm text-slate-600 mb-4">{property.description}</p>
      <div>
        <InfoRow label="Price" value={`$${property.price.toLocaleString()} ${property.currency}`} />
        <InfoRow label="Type" value={property.type} />
        <InfoRow label="Landlord" value={property.landlordName} />
        <InfoRow label="Bedrooms" value="2" />
        <InfoRow label="Listed" value={property.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} />
      </div>
      <div className="mt-4 pt-4 border-t border-slate-100">
        <p className="text-sm font-medium text-slate-700 mb-2">Amenities</p>
        <div className="flex flex-wrap gap-2">
          {property.amenities.map((amenity) => (
            <span key={amenity} className="px-2.5 py-1 rounded-full bg-slate-100 text-xs font-medium text-slate-600">
              {amenity}
            </span>
          ))}
        </div>
      </div>
    </SectionCard>
  )
}