'use client'

import type { SafetyScore } from '@/types/safety.types'
import { DataTable } from '@/components/ui/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { ShieldCheck, MapPin, Clock } from 'lucide-react'
import { SectionCard } from '@/components/features/SectionCard'
import { AdminButton } from '@/components/ui/AdminButton'

const safetyScores: SafetyScore[] = [
  {
    id: 'PROP-001',
    property: 'Sunset Apartments, Westlands',
    location: 'Nairobi, Westlands',
    score: 9.2,
    incidents: 1,
    lastAudit: new Date('2026-08-10'),
    status: 'excellent',
  },
  {
    id: 'PROP-002',
    property: 'Beachside Villa, Mombasa',
    location: 'Mombasa, Nyali',
    score: 7.8,
    incidents: 3,
    lastAudit: new Date('2026-08-05'),
    status: 'good',
  },
  {
    id: 'PROP-003',
    property: 'Hillcrest House, Nakuru',
    location: 'Nakuru, Milimani',
    score: 6.4,
    incidents: 5,
    lastAudit: new Date('2026-07-28'),
    status: 'fair',
  },
  {
    id: 'PROP-004',
    property: 'Lakeview Flats, Kisumu',
    location: 'Kisumu, Milimani',
    score: 5.1,
    incidents: 7,
    lastAudit: new Date('2026-07-15'),
    status: 'poor',
  },
  {
    id: 'PROP-005',
    property: 'Green Park Residences',
    location: 'Nairobi, Upper Hill',
    score: 8.7,
    incidents: 2,
    lastAudit: new Date('2026-08-12'),
    status: 'excellent',
  },
]

function scoreVariant(score: number) {
  if (score >= 8) return 'success'
  if (score >= 6) return 'warning'
  return 'destructive'
}

function statusVariant(status: SafetyScore['status']) {
  switch (status) {
    case 'excellent': return 'success'
    case 'good': return 'info'
    case 'fair': return 'warning'
    case 'poor': return 'destructive'
    default: return 'default'
  }
}

export default function SafetyScoreManager() {
  return (
    <SectionCard
      title="Safety Scores"
      description="Per-property safety score based on incidents and audits."
      action={
        <AdminButton variant="outline" size="sm">
          Run Audit
        </AdminButton>
      }
    >
      <DataTable<SafetyScore>
        data={safetyScores}
        searchPlaceholder="Search by property name..."
        columns={[
          {
            key: 'id',
            header: 'ID',
            render: (score) => (
              <span className="font-medium text-slate-900">{score.id}</span>
            ),
          },
          {
            key: 'property',
            header: 'Property',
            render: (score) => score.property,
          },
          {
            key: 'location',
            header: 'Location',
            render: (score) => (
              <span className="flex items-center gap-1 text-sm text-slate-700">
                <MapPin size={12} className="text-slate-400" />
                {score.location}
              </span>
            ),
          },
          {
            key: 'score',
            header: 'Score',
            render: (score) => (
              <span className={`font-semibold ${scoreVariant(score.score) === 'success' ? 'text-green-600' : scoreVariant(score.score) === 'warning' ? 'text-yellow-600' : 'text-red-600'}`}>
                {score.score.toFixed(1)}
              </span>
            ),
          },
          {
            key: 'incidents',
            header: 'Incidents',
            render: (score) => score.incidents,
          },
          {
            key: 'lastAudit',
            header: 'Last Audit',
            render: (score) => (
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Clock size={12} />
                {score.lastAudit.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            ),
          },
          {
            key: 'status',
            header: 'Status',
            render: (score) => (
              <StatusBadge variant={statusVariant(score.status)} label={score.status} />
            ),
          },
        ]}
      />
    </SectionCard>
  )
}
