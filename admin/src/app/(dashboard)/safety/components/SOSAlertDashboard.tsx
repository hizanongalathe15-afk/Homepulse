'use client'

import type { SOSAlert } from '@/types/safety.types'
import { CommandDataTable } from '@/components/ui/CommandDataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { ShieldAlert, MapPin, Clock } from 'lucide-react'
import { SectionCard } from '@/components/features/SectionCard'
import type { ColumnDef } from '@tanstack/react-table'

const sosAlerts: SOSAlert[] = [
  {
    id: 'SOS-001',
    tenantName: 'Alice Wanjiru',
    property: 'Sunset Apartments, Westlands',
    location: 'Nairobi, Westlands',
    status: 'active',
    priority: 'critical',
    createdAt: new Date('2026-08-16T09:12:00'),
    description: 'Tenant triggered SOS button due to suspected break-in.',
  },
  {
    id: 'SOS-002',
    tenantName: 'Brian Kipchoge',
    property: 'Hillcrest House, Nakuru',
    location: 'Nakuru, Milimani',
    status: 'resolved',
    priority: 'high',
    createdAt: new Date('2026-08-16T07:45:00'),
    description: 'Tenant reported gas leak. Fire department responded.',
  },
  {
    id: 'SOS-003',
    tenantName: 'Catherine Muthoni',
    property: 'Lakeview Flats, Kisumu',
    location: 'Kisumu, Milimani',
    status: 'active',
    priority: 'medium',
    createdAt: new Date('2026-08-15T22:30:00'),
    description: 'Tenant requested emergency maintenance for water pipe burst.',
  },
  {
    id: 'SOS-004',
    tenantName: 'David Kimani',
    property: 'Green Park Residences',
    location: 'Nairobi, Upper Hill',
    status: 'acknowledged',
    priority: 'low',
    createdAt: new Date('2026-08-15T18:00:00'),
    description: 'Tenant reported suspicious activity near the building entrance.',
  },
  {
    id: 'SOS-005',
    tenantName: 'Emily Achieng',
    property: 'Beachside Villa, Mombasa',
    location: 'Mombasa, Nyali',
    status: 'resolved',
    priority: 'medium',
    createdAt: new Date('2026-08-14T14:22:00'),
    description: 'Tenant needed medical assistance. Ambulance dispatched.',
  },
  {
    id: 'SOS-006',
    tenantName: 'Frank Omondi',
    property: 'Riverside Apartments, Kisumu',
    location: 'Kisumu, Milimani',
    status: 'active',
    priority: 'high',
    createdAt: new Date('2026-08-16T08:10:00'),
    description: 'Tenant trapped in elevator. Rescue team dispatched.',
  },
]

function statusVariant(status: SOSAlert['status']) {
  switch (status) {
    case 'active': return 'destructive'
    case 'acknowledged': return 'warning'
    case 'resolved': return 'success'
    default: return 'default'
  }
}

function priorityVariant(priority: SOSAlert['priority']) {
  switch (priority) {
    case 'critical': return 'destructive'
    case 'high': return 'warning'
    case 'medium': return 'info'
    case 'low': return 'default'
    default: return 'default'
  }
}

export default function SOSAlertDashboard() {
  const columns: ColumnDef<SOSAlert>[] = [
    {
      id: 'id',
      header: 'ID',
      accessorKey: 'id',
      size: 90,
      cell: (info) => (
        <span className="font-mono text-xs text-command-cyan">{info.row.original.id}</span>
      ),
    },
    {
      id: 'tenantName',
      header: 'Tenant',
      accessorKey: 'tenantName',
      size: 150,
      cell: (info) => <span className="font-medium text-slate-100">{info.row.original.tenantName}</span>,
    },
    {
      id: 'property',
      header: 'Property',
      accessorKey: 'property',
      size: 200,
      cell: (info) => <span className="text-slate-300">{info.row.original.property}</span>,
    },
    {
      id: 'priority',
      header: 'Priority',
      accessorKey: 'priority',
      size: 100,
      cell: (info) => (
        <StatusBadge variant={priorityVariant(info.row.original.priority)} label={info.row.original.priority} />
      ),
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      size: 110,
      cell: (info) => (
        <StatusBadge variant={statusVariant(info.row.original.status)} label={info.row.original.status} />
      ),
    },
    {
      id: 'createdAt',
      header: 'Time',
      accessorKey: 'createdAt',
      size: 140,
      cell: (info) => (
        <span className="flex items-center gap-1 text-xs text-slate-400">
          <Clock size={12} />
          {info.row.original.createdAt.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      ),
    },
  ]

  return (
    <SectionCard
      title="SOS Alerts"
      description="Real-time emergency alerts from tenants."
    >
      <CommandDataTable<SOSAlert>
        data={sosAlerts}
        searchPlaceholder="Search alerts by tenant or property..."
        columns={columns}
      />
    </SectionCard>
  )
}
