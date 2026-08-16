export interface FraudAlert {
  id: string
  type: 'payment' | 'listing' | 'account' | 'behavior'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  userId?: string
  userName?: string
  propertyId?: string
  propertyTitle?: string
  status: 'new' | 'investigating' | 'resolved' | 'dismissed'
  createdAt: Date
}

export interface FraudCase {
  id: string
  caseNumber: string
  alertId: string
  type: FraudAlert['type']
  severity: FraudAlert['severity']
  status: 'open' | 'under_review' | 'resolved' | 'closed'
  assignee: string
  userId: string
  userName: string
  propertyId?: string
  propertyTitle?: string
  description: string
  evidence: string[]
  createdAt: Date
  updatedAt: Date
  resolvedAt?: Date
}

export interface FraudRule {
  id: string
  name: string
  description: string
  category: FraudAlert['type']
  severity: 'low' | 'medium' | 'high' | 'critical'
  enabled: boolean
  actions: string[]
  lastTriggered?: Date
  triggeredCount: number
}
