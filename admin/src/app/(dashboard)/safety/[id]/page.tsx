'use client'

import { useParams } from 'next/navigation'
import { AdminHeader } from '@/components/ui/AdminHeader'
import { SectionCard } from '@/components/features/SectionCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { AdminButton } from '@/components/ui/AdminButton'
import { ShieldAlert, MapPin, Clock, Phone, User } from 'lucide-react'

const mockAlerts: Record<string, {
  id: string
  tenantName: string
  property: string
  location: string
  status: string
  priority: string
  createdAt: Date
  description: string
  phone: string
  emergencyContact: string
  assignedTo: string
  notes: string[]
}> = {
  'SOS-001': {
    id: 'SOS-001',
    tenantName: 'Alice Wanjiru',
    property: 'Sunset Apartments, Westlands',
    location: 'Nairobi, Westlands',
    status: 'active',
    priority: 'critical',
    createdAt: new Date('2026-08-16T09:12:00'),
    description: 'Tenant triggered SOS button due to suspected break-in. Tenant reports hearing noises downstairs and seeing an unknown individual near the main entrance.',
    phone: '+254 712 345678',
    emergencyContact: 'Nairobi Police HQ',
    assignedTo: 'Officer James Mwangi',
    notes: [
      'Officer dispatched at 09:15',
      'Neighbourhood watch notified',
      'Tenant confirmed safe at 09:45',
    ],
  },
  'SOS-002': {
    id: 'SOS-002',
    tenantName: 'Brian Kipchoge',
    property: 'Hillcrest House, Nakuru',
    location: 'Nakuru, Milimani',
    status: 'resolved',
    priority: 'high',
    createdAt: new Date('2026-08-16T07:45:00'),
    description: 'Tenant reported gas leak. Fire department responded and ventilated the area.',
    phone: '+254 723 456789',
    emergencyContact: 'Nakuru Fire Station',
    assignedTo: 'Fire Chief Sarah Kimani',
    notes: [
      'Fire department arrived at 07:55',
      'Gas leak isolated',
      'Property cleared at 08:30',
    ],
  },
}

function statusVariant(status: string) {
  switch (status) {
    case 'active': return 'destructive'
    case 'acknowledged': return 'warning'
    case 'resolved': return 'success'
    default: return 'default'
  }
}

function priorityVariant(priority: string) {
  switch (priority) {
    case 'critical': return 'destructive'
    case 'high': return 'warning'
    case 'medium': return 'info'
    case 'low': return 'default'
    default: return 'default'
  }
}

export default function SafetyDetailPage() {
  const params = useParams()
  const alertId = params.id as string
  const alert = mockAlerts[alertId] || {
    id: alertId,
    tenantName: 'Unknown Tenant',
    property: 'Unknown Property',
    location: 'Unknown',
    status: 'unknown',
    priority: 'unknown',
    createdAt: new Date(),
    description: 'No additional details available for this alert.',
    phone: 'N/A',
    emergencyContact: 'N/A',
    assignedTo: 'Unassigned',
    notes: [],
  }

  return (
    <div className="space-y-6">
      <AdminHeader
        title={`Safety Alert ${alert.id}`}
        description="Detailed view of the emergency alert."
        breadcrumbs={[
          { label: 'Safety', href: '/dashboard/safety' },
          { label: alert.id },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <AdminButton variant="outline" size="sm">
              Escalate
            </AdminButton>
            <AdminButton variant="default" size="sm">
              Resolve
            </AdminButton>
          </div>
        }
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SectionCard title="Alert Details">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert size={20} className="text-red-600" />
                  <span className="font-semibold text-slate-900">Status</span>
                </div>
                <StatusBadge variant={statusVariant(alert.status)} label={alert.status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Priority</span>
                <StatusBadge variant={priorityVariant(alert.priority)} label={alert.priority} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Description</span>
                <span className="text-sm text-slate-900 max-w-md text-right">{alert.description}</span>
              </div>
            </div>
          </SectionCard>
          <SectionCard title="Action Notes">
            <div className="space-y-3">
              {alert.notes.length === 0 ? (
                <p className="text-sm text-slate-500">No notes recorded for this alert.</p>
              ) : (
                alert.notes.map((note, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                    <Clock size={16} className="text-slate-400 mt-0.5" />
                    <p className="text-sm text-slate-700">{note}</p>
                  </div>
                ))
              )}
            </div>
          </SectionCard>
        </div>
        <div className="space-y-6">
          <SectionCard title="Tenant Information">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User size={16} className="text-slate-400" />
                <span className="text-sm font-medium text-slate-900">{alert.tenantName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-slate-400" />
                <span className="text-sm text-slate-700">{alert.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-slate-400" />
                <span className="text-sm text-slate-700">{alert.property}</span>
              </div>
            </div>
          </SectionCard>
          <SectionCard title="Emergency Response">
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Emergency Contact</p>
                <p className="text-sm font-medium text-slate-900">{alert.emergencyContact}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Assigned To</p>
                <p className="text-sm font-medium text-slate-900">{alert.assignedTo}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Triggered At</p>
                <p className="text-sm text-slate-700">
                  {alert.createdAt.toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  )
}
