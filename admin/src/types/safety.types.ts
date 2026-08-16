export interface SOSAlert {
  id: string
  tenantName: string
  property: string
  location: string
  status: 'active' | 'acknowledged' | 'resolved'
  priority: 'critical' | 'high' | 'medium' | 'low'
  createdAt: Date
  description: string
}

export interface IncidentReport {
  id: string
  title: string
  property: string
  location: string
  status: 'open' | 'investigating' | 'resolved'
  severity: 'critical' | 'high' | 'medium' | 'low'
  reportedBy: string
  createdAt: Date
  updatedAt: Date
}

export interface EmergencyContact {
  id: string
  name: string
  type: 'police' | 'hospital' | 'fire' | 'other'
  phone: string
  location: string
  status: 'verified' | 'unverified'
  responseTime: string
}

export interface SafetyScore {
  id: string
  property: string
  location: string
  score: number
  incidents: number
  lastAudit: Date
  status: 'excellent' | 'good' | 'fair' | 'poor'
}
