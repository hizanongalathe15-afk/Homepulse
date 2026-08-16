export interface Dispute {
  id: string
  caseNumber: string
  userId: string
  userName: string
  propertyId: string
  propertyTitle: string
  type: 'payment' | 'property_condition' | 'lease_violation' | 'security_deposit' | 'other'
  status: 'open' | 'under_review' | 'mediation' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'critical'
  description: string
  evidence: string[]
  assignedTo?: string
  createdAt: Date
  updatedAt: Date
  resolvedAt?: Date
}

export const DISPUTE_STATUSES = ['open', 'under_review', 'mediation', 'resolved', 'closed'] as const
export const DISPUTE_TYPES = ['payment', 'property_condition', 'lease_violation', 'security_deposit', 'other'] as const
export const DISPUTE_PRIORITIES = ['low', 'medium', 'high', 'critical'] as const
