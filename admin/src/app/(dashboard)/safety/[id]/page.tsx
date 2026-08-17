'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { AdminHeader } from '@/components/ui/AdminHeader'
import { SectionCard } from '@/components/features/SectionCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { AdminButton } from '@/components/ui/AdminButton'
import { ShieldAlert, MapPin, Clock, Phone, User, Loader2 } from 'lucide-react'
import { apiClient } from '@/lib/apiClient'

function statusVariant(status: string) {
  switch (status) {
    case 'active':
    case 'ACTIVE':
      return 'destructive'
    case 'acknowledged':
      return 'warning'
    case 'resolved':
    case 'RESOLVED':
      return 'success'
    default:
      return 'default'
  }
}

function priorityVariant(priority: string) {
  switch (priority) {
    case 'critical':
      return 'destructive'
    case 'high':
      return 'warning'
    case 'medium':
      return 'info'
    case 'low':
      return 'default'
    default:
      return 'default'
  }
}

export default function SafetyDetailPage() {
  const params = useParams()
  const alertId = params.id as string
  const [alert, setAlert] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAlert = async () => {
      try {
        const response = await apiClient.get(`/safety/sos/${alertId}`)
        setAlert(response.data?.data || response.data)
      } catch (err) {
        setError('Failed to load safety alert')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAlert()
  }, [alertId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
      </div>
    )
  }

  if (error || !alert) {
    return (
      <div className="text-center text-red-500 py-8">
        {error || 'Safety alert not found'}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AdminHeader
        title={`Safety Alert ${alert.id}`}
        description="Detailed view of the emergency alert."
        breadcrumbs={[
          { label: 'Safety', href: '/safety' },
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
                <span className="text-sm text-slate-900 max-w-md text-right">{alert.description || alert.reason || 'No description provided'}</span>
              </div>
            </div>
          </SectionCard>
          <SectionCard title="Action Notes">
            <div className="space-y-3">
              {(alert.notes || []).length === 0 ? (
                <p className="text-sm text-slate-500">No notes recorded for this alert.</p>
              ) : (
                alert.notes.map((note: string, index: number) => (
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
                <span className="text-sm font-medium text-slate-900">{alert.tenant?.firstName} {alert.tenant?.lastName || alert.tenantName || 'Unknown Tenant'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-slate-400" />
                <span className="text-sm text-slate-700">{alert.tenant?.phone || alert.phone || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-slate-400" />
                <span className="text-sm text-slate-700">{alert.property?.title || alert.property || alert.location || 'Unknown'}</span>
              </div>
            </div>
          </SectionCard>
          <SectionCard title="Emergency Response">
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Emergency Contact</p>
                <p className="text-sm font-medium text-slate-900">{alert.emergencyContact || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Assigned To</p>
                <p className="text-sm font-medium text-slate-900">{alert.assignedTo || 'Unassigned'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Triggered At</p>
                <p className="text-sm text-slate-700">
                  {new Date(alert.createdAt).toLocaleString('en-US', {
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
