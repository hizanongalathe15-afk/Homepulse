'use client'

import type { Property } from '@/types/property.types'
import { DataTable } from '@/components/ui/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'

const properties: Property[] = [
  {
    id: 'PROP-001', title: 'Sunset Apartments, Westlands', description: '2-bedroom modern apartment',
    type: 'apartment', status: 'approved', price: 45000, currency: 'USD',
    location: { city: 'Nairobi', neighborhood: 'Westlands', coordinates: { lat: -1.26, lng: 36.81 } },
    landlordId: 'USR-1001', landlordName: 'Mary Wanjiku', images: [], amenities: ['WiFi', 'Parking', 'Gym'],
    createdAt: new Date('2026-01-15'), updatedAt: new Date('2026-07-20'),
  },
  {
    id: 'PROP-002', title: 'Beachside Villa, Mombasa', description: '4-bedroom villa with pool',
    type: 'house', status: 'pending', price: 120000, currency: 'USD',
    location: { city: 'Mombasa', neighborhood: 'Nyali', coordinates: { lat: -4.04, lng: 39.71 } },
    landlordId: 'USR-1003', landlordName: 'Amina Hassan', images: [], amenities: ['Pool', 'Beach access'],
    createdAt: new Date('2026-07-01'), updatedAt: new Date('2026-07-29'),
  },
  {
    id: 'PROP-003', title: 'Hillcrest House, Nakuru', description: '3-bedroom detached house',
    type: 'house', status: 'flagged', price: 85000, currency: 'USD',
    location: { city: 'Nakuru', neighborhood: 'Milimani', coordinates: { lat: -0.3, lng: 36.07 } },
    landlordId: 'USR-1004', landlordName: 'Peter Otieno', images: [], amenities: ['Garden', 'Parking'],
    createdAt: new Date('2026-04-10'), updatedAt: new Date('2026-08-02'),
  },
  {
    id: 'PROP-004', title: 'Lakeview Flats, Kisumu', description: '1-bedroom studio flat',
    type: 'apartment', status: 'approved', price: 28000, currency: 'USD',
    location: { city: 'Kisumu', neighborhood: 'Milimani', coordinates: { lat: -0.09, lng: 34.76 } },
    landlordId: 'USR-1006', landlordName: 'David Kimani', images: [], amenities: ['WiFi', 'Furnished'],
    createdAt: new Date('2026-02-22'), updatedAt: new Date('2026-07-18'),
  },
  {
    id: 'PROP-005', title: 'Green Park Residences', description: 'Commercial open-plan office space',
    type: 'commercial', status: 'rejected', price: 200000, currency: 'USD',
    location: { city: 'Nairobi', neighborhood: 'Upper Hill', coordinates: { lat: -1.3, lng: 36.81 } },
    landlordId: 'USR-1002', landlordName: 'John Mwangi', images: [], amenities: ['Conference rooms'],
    createdAt: new Date('2026-05-30'), updatedAt: new Date('2026-06-15'),
  },
]

function statusVariant(status: Property['status']) {
  switch (status) {
    case 'approved': return 'success'
    case 'pending': return 'warning'
    case 'flagged': return 'destructive'
    default: return 'default'
  }
}

export default function PropertyTable() {
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
              <p className="text-xs text-slate-500">{p.location.city} · {p.location.neighborhood}</p>
            </div>
          ),
        },
        { key: 'type', header: 'Type', render: (p) => <span className="capitalize">{p.type}</span> },
        { key: 'price', header: 'Price', render: (p) => `$${p.price.toLocaleString()}` },
        { key: 'landlordName', header: 'Landlord', render: (p) => p.landlordName },
        {
          key: 'status',
          header: 'Status',
          render: (p) => <StatusBadge variant={statusVariant(p.status)} label={p.status} />,
        },
        {
          key: 'createdAt',
          header: 'Listed',
          render: (p) => p.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        },
      ]}
    />
  )
}