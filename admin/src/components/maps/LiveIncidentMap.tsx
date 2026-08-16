'use client'

import { useState, useMemo } from 'react'
import { ShieldAlert, MapPin, Clock, Navigation, AlertTriangle, Phone } from 'lucide-react'
import { SectionCard } from '@/components/features/SectionCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { AdminButton } from '@/components/ui/AdminButton'
import type { SOSAlert, IncidentReport } from '@/types/safety.types'

interface IncidentPoint {
  id: string
  title: string
  type: 'sos' | 'incident'
  x: number
  y: number
  location: string
  description: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  status: 'active' | 'acknowledged' | 'resolved' | 'open' | 'investigating'
  createdAt: Date
  tenantName?: string
  reportedBy?: string
}

interface LiveIncidentMapProps {
  sosAlerts?: SOSAlert[]
  incidentReports?: IncidentReport[]
  onEscalate?: (incident: IncidentPoint) => void
  onRespond?: (incident: IncidentPoint) => void
}

const KENYA_MAP_BOUNDS = { minX: 10, maxX: 420, minY: 20, maxY: 280 }

function latLonToMap(lat: number, lon: number) {
  const x = ((lon - KENYA_MAP_BOUNDS.minX) / (KENYA_MAP_BOUNDS.maxX - KENYA_MAP_BOUNDS.minX)) * 400
  const y = ((KENYA_MAP_BOUNDS.maxY - lat) / (KENYA_MAP_BOUNDS.maxY - KENYA_MAP_BOUNDS.minY)) * 260
  return { x: Math.max(10, Math.min(410, x)), y: Math.max(10, Math.min(270, y)) }
}

function getCityCoords(location: string) {
  const lower = location.toLowerCase()
  if (lower.includes('nairobi') && lower.includes('westlands')) return latLonToMap(-1.267, 36.809)
  if (lower.includes('nairobi') && lower.includes('upper hill')) return latLonToMap(-1.302, 36.815)
  if (lower.includes('nakuru')) return latLonToMap(-0.303, 36.080)
  if (lower.includes('kisumu')) return latLonToMap(-0.091, 34.768)
  if (lower.includes('mombasa')) return latLonToMap(-4.043, 39.669)
  if (lower.includes('nairobi')) return latLonToMap(-1.292, 36.821)
  return latLonToMap(-1.292, 36.821)
}

const priorityColorMap: Record<string, string> = {
  critical: '#EF4444',
  high: '#F97316',
  medium: '#EAB308',
  low: '#06B6D4',
}

export default function LiveIncidentMap({ sosAlerts = [], incidentReports = [], onEscalate, onRespond }: LiveIncidentMapProps) {
  const [selectedIncident, setSelectedIncident] = useState<IncidentPoint | null>(null)

  const incidents: IncidentPoint[] = useMemo(() => {
    const points: IncidentPoint[] = []

    sosAlerts.forEach((alert) => {
      const coords = getCityCoords(alert.location)
      points.push({
        id: alert.id,
        title: `SOS: ${alert.tenantName}`,
        type: 'sos',
        x: coords.x,
        y: coords.y,
        location: alert.location,
        description: alert.description,
        priority: alert.priority,
        status: alert.status,
        createdAt: alert.createdAt,
        tenantName: alert.tenantName,
      })
    })

    incidentReports.forEach((report) => {
      const coords = getCityCoords(report.location)
      points.push({
        id: report.id,
        title: report.title,
        type: 'incident',
        x: coords.x,
        y: coords.y,
        location: report.location,
        description: `${report.property} - Reported by ${report.reportedBy}`,
        priority: report.severity,
        status: report.status,
        createdAt: report.createdAt,
        reportedBy: report.reportedBy,
      })
    })

    return points
  }, [sosAlerts, incidentReports])

  const activeIncidents = incidents.filter((i) => ['active', 'open', 'investigating', 'acknowledged'].includes(i.status))
  const resolvedIncidents = incidents.filter((i) => ['resolved'].includes(i.status))

  const statusVariant = (status: IncidentPoint['status']) => {
    switch (status) {
      case 'active': return 'destructive'
      case 'open': return 'destructive'
      case 'investigating': return 'warning'
      case 'acknowledged': return 'warning'
      case 'resolved': return 'success'
      default: return 'default'
    }
  }

  const priorityVariant = (priority: IncidentPoint['priority']) => {
    switch (priority) {
      case 'critical': return 'destructive'
      case 'high': return 'warning'
      case 'medium': return 'info'
      case 'low': return 'default'
      default: return 'default'
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <SectionCard title="Live Incident Map" description="Real-time incident and SOS alert locations across Kenya">
          <div className="relative w-full aspect-[16/10] min-h-[360px] bg-slate-900 rounded-lg overflow-hidden border border-command-border">
            <svg viewBox="0 0 440 300" className="w-full h-full">
              <defs>
                <radialGradient id="kenyaGlow">
                  <stop offset="0%" stopColor="rgba(6, 182, 212, 0.15)" />
                  <stop offset="100%" stopColor="rgba(6, 182, 212, 0)" />
                </radialGradient>
                <filter id="ping-glow">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="incident-glow">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <rect width="440" height="300" fill="url(#kenyaGlow)" />

              <g stroke="rgba(6, 182, 212, 0.2)" strokeWidth="0.5" fill="none">
                <line x1="20" y1="20" x2="420" y2="20" />
                <line x1="20" y1="80" x2="420" y2="80" />
                <line x1="20" y1="140" x2="420" y2="140" />
                <line x1="20" y1="200" x2="420" y2="200" />
                <line x1="20" y1="260" x2="420" y2="260" />
                <line x1="20" y1="20" x2="20" y2="280" />
                <line x1="120" y1="20" x2="120" y2="280" />
                <line x1="220" y1="20" x2="220" y2="280" />
                <line x1="320" y1="20" x2="320" y2="280" />
                <line x1="420" y1="20" x2="420" y2="280" />
              </g>

              <g fill="none" stroke="rgba(148, 163, 184, 0.15)" strokeWidth="1">
                <path d="M 80 200 L 120 180 L 180 160 L 220 150 L 280 140 L 320 120 L 380 100 L 420 90" />
                <path d="M 100 240 L 160 210 L 200 190 L 260 170 L 300 150 L 340 130" />
                <path d="M 60 180 L 100 160 L 140 140 L 180 130 L 220 120" />
                <path d="M 120 220 L 180 200 L 240 180 L 300 160 L 360 140" />
                <path d="M 140 260 L 200 240 L 260 220 L 320 200 L 380 180" />
                <path d="M 160 280 L 220 260 L 280 240 L 340 220 L 400 200" />
                <path d="M 80 160 L 140 140 L 200 120 L 260 100 L 320 80" />
                <path d="M 200 280 L 260 260 L 320 240 L 380 220 L 420 200" />
                <path d="M 40 220 L 100 200 L 160 180 L 220 160 L 280 140 L 340 120 L 400 100" />
              </g>

              <g fill="rgba(148, 163, 184, 0.4)" fontSize="8" fontFamily="monospace">
                <text x="25" y="26">Nairobi</text>
                <text x="25" y="86">Nakuru</text>
                <text x="25" y="146">Kisumu</text>
                <text x="25" y="206">Mombasa</text>
                <text x="25" y="266">Eldoret</text>
                <circle cx="110" cy="22" r="2" fill="rgba(148,163,184,0.3)" />
                <circle cx="110" cy="82" r="2" fill="rgba(148,163,184,0.3)" />
                <circle cx="110" cy="142" r="2" fill="rgba(148,163,184,0.3)" />
                <circle cx="110" cy="202" r="2" fill="rgba(148,163,184,0.3)" />
                <circle cx="110" cy="262" r="2" fill="rgba(148,163,184,0.3)" />
              </g>

              {incidents.map((incident) => {
                const isActive = ['active', 'open', 'investigating', 'acknowledged'].includes(incident.status)
                const color = priorityColorMap[incident.priority] || '#06B6D4'
                const isSelected = selectedIncident?.id === incident.id

                return (
                  <g key={incident.id} onClick={() => setSelectedIncident(incident)} style={{ cursor: 'pointer' }}>
                    {isActive && (
                      <circle cx={incident.x} cy={incident.y} r="12" fill="none" stroke={color} strokeWidth="0.8" opacity="0.4">
                        <animate attributeName="r" values="6;18;6" dur="2.5s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.6;0;0.6" dur="2.5s" repeatCount="indefinite" />
                      </circle>
                    )}
                    <circle
                      cx={incident.x}
                      cy={incident.y}
                      r={isSelected ? 6 : 4}
                      fill={color}
                      stroke={isSelected ? '#fff' : 'none'}
                      strokeWidth={isSelected ? 2 : 0}
                      filter={isActive ? 'url(#incident-glow)' : undefined}
                      opacity={isActive ? 1 : 0.5}
                    />
                    {isActive && (
                      <circle cx={incident.x} cy={incident.y} r="3" fill="#fff" opacity="0.8">
                        <animate attributeName="r" values="2;4;2" dur="1.5s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.9;0.3;0.9" dur="1.5s" repeatCount="indefinite" />
                      </circle>
                    )}
                    <text
                      x={incident.x + 8}
                      y={incident.y + 3}
                      fill="rgba(226, 232, 240, 0.8)"
                      fontSize="7"
                      fontFamily="monospace"
                    >
                      {incident.id}
                    </text>
                  </g>
                )
              })}
            </svg>

            <div className="absolute bottom-3 left-3 flex items-center gap-3 bg-slate-900/80 backdrop-blur-sm rounded-md px-3 py-1.5 border border-command-border">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-command-crimson animate-pulse" />
                <span className="text-xs text-slate-300">{activeIncidents.length} Active</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-500" />
                <span className="text-xs text-slate-400">{resolvedIncidents.length} Resolved</span>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="lg:col-span-1">
        <SectionCard title="Incident Inspector" description="Click a ping on the map to inspect">
          {selectedIncident ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-sm font-semibold text-slate-100">{selectedIncident.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedIncident.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge variant={statusVariant(selectedIncident.status)} label={selectedIncident.status} />
                  <StatusBadge variant={priorityVariant(selectedIncident.priority)} label={selectedIncident.priority} />
                </div>
              </div>

              <div className="space-y-2.5 bg-slate-900/50 rounded-lg p-3 border border-command-border">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <MapPin size={12} className="text-command-cyan" />
                  <span>{selectedIncident.location}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Clock size={12} className="text-command-cyan" />
                  <span>{selectedIncident.createdAt.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                {selectedIncident.tenantName && (
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Navigation size={12} className="text-command-cyan" />
                    <span>{selectedIncident.tenantName}</span>
                  </div>
                )}
                {selectedIncident.reportedBy && (
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <AlertTriangle size={12} className="text-command-cyan" />
                    <span>Reported by {selectedIncident.reportedBy}</span>
                  </div>
                )}
              </div>

              <div className="bg-slate-900/50 rounded-lg p-3 border border-command-border">
                <p className="text-xs text-slate-400 mb-2">Description</p>
                <p className="text-sm text-slate-200 leading-relaxed">{selectedIncident.description}</p>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-slate-400 uppercase tracking-wider">Escalation Triggers</p>
                <div className="space-y-1.5">
                  {selectedIncident.priority === 'critical' && (
                    <div className="flex items-center gap-2 text-xs text-red-400 bg-red-950/30 rounded-md px-2.5 py-1.5 border border-red-900/30">
                      <AlertTriangle size={12} />
                      <span>Immediate dispatch required</span>
                    </div>
                  )}
                  {selectedIncident.priority === 'high' && (
                    <div className="flex items-center gap-2 text-xs text-orange-400 bg-orange-950/30 rounded-md px-2.5 py-1.5 border border-orange-900/30">
                      <AlertTriangle size={12} />
                      <span>High priority - escalate within 15 min</span>
                    </div>
                  )}
                  {selectedIncident.type === 'sos' && (
                    <div className="flex items-center gap-2 text-xs text-red-400 bg-red-950/30 rounded-md px-2.5 py-1.5 border border-red-900/30">
                      <ShieldAlert size={12} />
                      <span>Emergency services notification active</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/30 rounded-md px-2.5 py-1.5 border border-slate-700/30">
                    <Phone size={12} />
                    <span>Auto-notify property manager</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                {onRespond && (
                  <AdminButton size="sm" className="flex-1" onClick={() => onRespond(selectedIncident)}>
                    <Phone size={14} className="mr-1" />
                    Respond
                  </AdminButton>
                )}
                {onEscalate && (
                  <AdminButton variant="destructive" size="sm" className="flex-1" onClick={() => onEscalate(selectedIncident)}>
                    <AlertTriangle size={14} className="mr-1" />
                    Escalate
                  </AdminButton>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MapPin size={32} className="text-slate-600 mb-3" />
              <p className="text-sm text-slate-400">Select an incident on the map to inspect details and triggers</p>
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  )
}
