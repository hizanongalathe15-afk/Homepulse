'use client'

import type { EmergencyContact } from '@/types/safety.types'
import { DataTable } from '@/components/ui/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Phone, Shield, Clock } from 'lucide-react'
import { SectionCard } from '@/components/features/SectionCard'
import { AdminButton } from '@/components/ui/AdminButton'

const emergencyContacts: EmergencyContact[] = [
  {
    id: 'EMC-001',
    name: 'Nairobi Police HQ',
    type: 'police',
    phone: '+254 20 2221414',
    location: 'Nairobi',
    status: 'verified',
    responseTime: '~5 min',
  },
  {
    id: 'EMC-002',
    name: 'Nairobi Hospital',
    type: 'hospital',
    phone: '+254 20 2716361',
    location: 'Nairobi',
    status: 'verified',
    responseTime: '~10 min',
  },
  {
    id: 'EMC-003',
    name: 'Nakuru Fire Station',
    type: 'fire',
    phone: '+254 51 2212034',
    location: 'Nakuru',
    status: 'verified',
    responseTime: '~8 min',
  },
  {
    id: 'EMC-004',
    name: 'Kisumu Medical Centre',
    type: 'hospital',
    phone: '+254 57 2023456',
    location: 'Kisumu',
    status: 'unverified',
    responseTime: '~12 min',
  },
  {
    id: 'EMC-005',
    name: 'Mombasa Police Station',
    type: 'police',
    phone: '+254 41 2221234',
    location: 'Mombasa',
    status: 'verified',
    responseTime: '~6 min',
  },
]

function typeVariant(type: EmergencyContact['type']) {
  switch (type) {
    case 'police': return 'info'
    case 'hospital': return 'success'
    case 'fire': return 'warning'
    default: return 'default'
  }
}

function statusVariant(status: EmergencyContact['status']) {
  switch (status) {
    case 'verified': return 'success'
    case 'unverified': return 'warning'
    default: return 'default'
  }
}

export default function EmergencyContactManager() {
  return (
    <SectionCard
      title="Emergency Contacts"
      description="Verified emergency services for each property region."
      action={
        <AdminButton variant="outline" size="sm">
          Add Contact
        </AdminButton>
      }
    >
      <DataTable<EmergencyContact>
        data={emergencyContacts}
        searchPlaceholder="Search contacts by name or location..."
        columns={[
          {
            key: 'name',
            header: 'Contact Name',
            render: (contact) => (
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-slate-400" />
                <span className="font-medium text-slate-900">{contact.name}</span>
              </div>
            ),
          },
          {
            key: 'type',
            header: 'Type',
            render: (contact) => (
              <StatusBadge variant={typeVariant(contact.type)} label={contact.type} />
            ),
          },
          {
            key: 'phone',
            header: 'Phone',
            render: (contact) => (
              <span className="flex items-center gap-1 text-sm text-slate-700">
                <Phone size={12} className="text-slate-400" />
                {contact.phone}
              </span>
            ),
          },
          {
            key: 'location',
            header: 'Location',
            render: (contact) => contact.location,
          },
          {
            key: 'responseTime',
            header: 'Avg Response',
            render: (contact) => (
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Clock size={12} />
                {contact.responseTime}
              </span>
            ),
          },
          {
            key: 'status',
            header: 'Status',
            render: (contact) => (
              <StatusBadge variant={statusVariant(contact.status)} label={contact.status} />
            ),
          },
        ]}
      />
    </SectionCard>
  )
}
