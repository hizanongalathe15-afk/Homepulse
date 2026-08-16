'use client'

import { AdminHeader } from '@/components/ui/AdminHeader'
import SafetyAnalytics from './components/SafetyAnalytics'
import SOSAlertDashboard from './components/SOSAlertDashboard'
import LiveIncidentMap from '@/components/maps/LiveIncidentMap'
import IncidentReportManager from './components/IncidentReportManager'
import EmergencyContactManager from './components/EmergencyContactManager'
import SafetyScoreManager from './components/SafetyScoreManager'

const sosAlerts = [
  {
    id: 'SOS-001',
    tenantName: 'Alice Wanjiru',
    property: 'Sunset Apartments, Westlands',
    location: 'Nairobi, Westlands',
    status: 'active' as const,
    priority: 'critical' as const,
    createdAt: new Date('2026-08-16T09:12:00'),
    description: 'Tenant triggered SOS button due to suspected break-in.',
  },
  {
    id: 'SOS-002',
    tenantName: 'Brian Kipchoge',
    property: 'Hillcrest House, Nakuru',
    location: 'Nakuru, Milimani',
    status: 'resolved' as const,
    priority: 'high' as const,
    createdAt: new Date('2026-08-16T07:45:00'),
    description: 'Tenant reported gas leak. Fire department responded.',
  },
  {
    id: 'SOS-003',
    tenantName: 'Catherine Muthoni',
    property: 'Lakeview Flats, Kisumu',
    location: 'Kisumu, Milimani',
    status: 'active' as const,
    priority: 'medium' as const,
    createdAt: new Date('2026-08-15T22:30:00'),
    description: 'Tenant requested emergency maintenance for water pipe burst.',
  },
  {
    id: 'SOS-004',
    tenantName: 'David Kimani',
    property: 'Green Park Residences',
    location: 'Nairobi, Upper Hill',
    status: 'acknowledged' as const,
    priority: 'low' as const,
    createdAt: new Date('2026-08-15T18:00:00'),
    description: 'Tenant reported suspicious activity near the building entrance.',
  },
  {
    id: 'SOS-005',
    tenantName: 'Emily Achieng',
    property: 'Beachside Villa, Mombasa',
    location: 'Mombasa, Nyali',
    status: 'resolved' as const,
    priority: 'medium' as const,
    createdAt: new Date('2026-08-14T14:22:00'),
    description: 'Tenant needed medical assistance. Ambulance dispatched.',
  },
  {
    id: 'SOS-006',
    tenantName: 'Frank Omondi',
    property: 'Riverside Apartments, Kisumu',
    location: 'Kisumu, Milimani',
    status: 'active' as const,
    priority: 'high' as const,
    createdAt: new Date('2026-08-16T08:10:00'),
    description: 'Tenant trapped in elevator. Rescue team dispatched.',
  },
]

const incidentReports = [
  {
    id: 'INC-201',
    title: 'Water pipe burst',
    property: 'Sunset Apartments, Westlands',
    location: 'Nairobi, Westlands',
    status: 'open' as const,
    severity: 'high' as const,
    reportedBy: 'Alice Wanjiru',
    createdAt: new Date('2026-08-16T10:05:00'),
    updatedAt: new Date('2026-08-16T10:15:00'),
  },
  {
    id: 'INC-202',
    title: 'Suspicious activity near entrance',
    property: 'Green Park Residences',
    location: 'Nairobi, Upper Hill',
    status: 'investigating' as const,
    severity: 'medium' as const,
    reportedBy: 'David Kimani',
    createdAt: new Date('2026-08-15T18:00:00'),
    updatedAt: new Date('2026-08-15T20:30:00'),
  },
  {
    id: 'INC-203',
    title: 'Broken window on 3rd floor',
    property: 'Hillcrest House, Nakuru',
    location: 'Nakuru, Milimani',
    status: 'resolved' as const,
    severity: 'low' as const,
    reportedBy: 'Brian Kipchoge',
    createdAt: new Date('2026-08-14T09:22:00'),
    updatedAt: new Date('2026-08-14T16:00:00'),
  },
  {
    id: 'INC-204',
    title: 'Electrical fault in parking',
    property: 'Lakeview Flats, Kisumu',
    location: 'Kisumu, Milimani',
    status: 'open' as const,
    severity: 'critical' as const,
    reportedBy: 'Catherine Muthoni',
    createdAt: new Date('2026-08-16T08:45:00'),
    updatedAt: new Date('2026-08-16T08:45:00'),
  },
  {
    id: 'INC-205',
    title: 'Noise complaint - late night',
    property: 'Beachside Villa, Mombasa',
    location: 'Mombasa, Nyali',
    status: 'resolved' as const,
    severity: 'low' as const,
    reportedBy: 'Emily Achieng',
    createdAt: new Date('2026-08-13T23:10:00'),
    updatedAt: new Date('2026-08-14T01:00:00'),
  },
  {
    id: 'INC-206',
    title: 'Elevator malfunction',
    property: 'Riverside Apartments, Kisumu',
    location: 'Kisumu, Milimani',
    status: 'investigating' as const,
    severity: 'high' as const,
    reportedBy: 'Frank Omondi',
    createdAt: new Date('2026-08-16T08:15:00'),
    updatedAt: new Date('2026-08-16T09:00:00'),
  },
]

export default function SafetyPage() {
  return (
    <div className="space-y-6">
      <AdminHeader
        title="Safety"
        description="Monitor SOS alerts, incident reports, emergency contacts and safety scores."
      />
      <SafetyAnalytics />
      <LiveIncidentMap sosAlerts={sosAlerts} incidentReports={incidentReports} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SOSAlertDashboard />
        <SafetyScoreManager />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IncidentReportManager />
        <EmergencyContactManager />
      </div>
    </div>
  )
}
