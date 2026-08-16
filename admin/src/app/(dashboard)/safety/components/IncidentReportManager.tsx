'use client'

import type { IncidentReport } from '@/types/safety.types'
import { CommandDataTable } from '@/components/ui/CommandDataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { AlertTriangle, MapPin, Clock } from 'lucide-react'
import { SectionCard } from '@/components/features/SectionCard'
import type { ColumnDef } from '@tanstack/react-table'

const incidentReports: IncidentReport[] = [
  {
    id: 'INC-201',
    title: 'Water pipe burst',
    property: 'Sunset Apartments, Westlands',
    location: 'Nairobi, Westlands',
    status: 'open',
    severity: 'high',
    reportedBy: 'Alice Wanjiru',
    createdAt: new Date('2026-08-16T10:05:00'),
    updatedAt: new Date('2026-08-16T10:15:00'),
  },
  {
    id: 'INC-202',
    title: 'Suspicious activity near entrance',
    property: 'Green Park Residences',
    location: 'Nairobi, Upper Hill',
    status: 'investigating',
    severity: 'medium',
    reportedBy: 'David Kimani',
    createdAt: new Date('2026-08-15T18:00:00'),
    updatedAt: new Date('2026-08-15T20:30:00'),
  },
  {
    id: 'INC-203',
    title: 'Broken window on 3rd floor',
    property: 'Hillcrest House, Nakuru',
    location: 'Nakuru, Milimani',
    status: 'resolved',
    severity: 'low',
    reportedBy: 'Brian Kipchoge',
    createdAt: new Date('2026-08-14T09:22:00'),
    updatedAt: new Date('2026-08-14T16:00:00'),
  },
  {
    id: 'INC-204',
    title: 'Electrical fault in parking',
    property: 'Lakeview Flats, Kisumu',
    location: 'Kisumu, Milimani',
    status: 'open',
    severity: 'critical',
    reportedBy: 'Catherine Muthoni',
    createdAt: new Date('2026-08-16T08:45:00'),
    updatedAt: new Date('2026-08-16T08:45:00'),
  },
  {
    id: 'INC-205',
    title: 'Noise complaint - late night',
    property: 'Beachside Villa, Mombasa',
    location: 'Mombasa, Nyali',
    status: 'resolved',
    severity: 'low',
    reportedBy: 'Emily Achieng',
    createdAt: new Date('2026-08-13T23:10:00'),
    updatedAt: new Date('2026-08-14T01:00:00'),
  },
  {
    id: 'INC-206',
    title: 'Elevator malfunction',
    property: 'Riverside Apartments, Kisumu',
    location: 'Kisumu, Milimani',
    status: 'investigating',
    severity: 'high',
    reportedBy: 'Frank Omondi',
    createdAt: new Date('2026-08-16T08:15:00'),
    updatedAt: new Date('2026-08-16T09:00:00'),
  },
]

function statusVariant(status: IncidentReport['status']) {
  switch (status) {
    case 'open': return 'destructive'
    case 'investigating': return 'warning'
    case 'resolved': return 'success'
    default: return 'default'
  }
}

function severityVariant(severity: IncidentReport['severity']) {
  switch (severity) {
    case 'critical': return 'destructive'
    case 'high': return 'warning'
    case 'medium': return 'info'
    case 'low': return 'default'
    default: return 'default'
  }
}

export default function IncidentReportManager() {
  const columns: ColumnDef<IncidentReport>[] = [
    {
      id: 'id',
      header: 'ID',
      accessorKey: 'id',
      size: 80,
      cell: (info) => (
        <span className="font-mono text-xs text-command-cyan">{info.row.original.id}</span>
      ),
    },
    {
      id: 'title',
      header: 'Title',
      accessorKey: 'title',
      size: 180,
      cell: (info) => <span className="font-medium text-slate-100">{info.row.original.title}</span>,
    },
    {
      id: 'property',
      header: 'Property',
      accessorKey: 'property',
      size: 200,
      cell: (info) => <span className="text-slate-300">{info.row.original.property}</span>,
    },
    {
      id: 'severity',
      header: 'Severity',
      accessorKey: 'severity',
      size: 100,
      cell: (info) => (
        <StatusBadge variant={severityVariant(info.row.original.severity)} label={info.row.original.severity} />
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
      id: 'reportedBy',
      header: 'Reported By',
      accessorKey: 'reportedBy',
      size: 140,
      cell: (info) => info.row.original.reportedBy,
    },
    {
      id: 'createdAt',
      header: 'Created',
      accessorKey: 'createdAt',
      size: 120,
      cell: (info) => (
        <span className="flex items-center gap-1 text-xs text-slate-400">
          <Clock size={12} />
          {info.row.original.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      ),
    },
  ]

  return (
    <SectionCard
      title="Incident Reports"
      description="Track and manage safety incident reports."
    >
      <CommandDataTable<IncidentReport>
        data={incidentReports}
        searchPlaceholder="Search incidents by title or property..."
        columns={columns}
      />
    </SectionCard>
  )
}
