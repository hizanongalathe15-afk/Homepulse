export const ADMIN_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
} as const

export const USER_ROLES = {
  TENANT: 'tenant',
  LANDLORD: 'landlord',
  AGENT: 'agent',
  ADMIN: 'admin',
} as const

export const PROPERTY_TYPES = {
  APARTMENT: 'apartment',
  HOUSE: 'house',
  COMMERCIAL: 'commercial',
  LAND: 'land',
} as const

export const PAYMENT_METHODS = {
  MPESA: 'mpesa',
  STRIPE: 'stripe',
  CASH: 'cash',
  BANK_TRANSFER: 'bank_transfer',
} as const

export const PAYMENT_STATUSES = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const

export const DISPUTE_STATUSES = {
  OPEN: 'open',
  UNDER_REVIEW: 'under_review',
  MEDIATION: 'mediation',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
} as const

export const DISPUTE_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
}

export const DATE_RANGES = [
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
  { label: 'Last year', value: '1y' },
] as const
