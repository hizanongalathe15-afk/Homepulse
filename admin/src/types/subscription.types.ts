export interface SubscriptionPlan {
  id: string
  name: string
  description?: string
  price: number
  currency: string
  billingCycle: 'monthly' | 'yearly'
  maxListings?: number
  features: string[]
  isActive: boolean
  isFeatured: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface Subscription {
  id: string
  userId: string
  planId: string
  plan: SubscriptionPlan
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'PAST_DUE' | 'PAUSED'
  startDate: string
  endDate: string
  cancelledAt?: string
  paymentMethod?: string
  paymentProviderId?: string
  amount: number
  currency: string
  listingsUsed: number
  createdAt: string
  updatedAt: string
}
