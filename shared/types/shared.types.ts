export type UserRole = 'tenant' | 'landlord' | 'admin'

export type PropertyStatus = 'available' | 'rented' | 'maintenance' | 'pending'

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'

export type PaymentMethod = 'mpesa' | 'stripe' | 'bank_transfer' | 'cash'

export type EscrowStatus = 'held' | 'released' | 'disputed' | 'refunded'

export type AlertPriority = 'low' | 'medium' | 'high' | 'critical'

export type AlertStatus = 'active' | 'acknowledged' | 'resolved'

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface BaseEntity {
  id: string
}

export interface Timestamps {
  createdAt: Date
  updatedAt: Date
}