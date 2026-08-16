export interface AnalyticsOverview {
  totalUsers: number
  totalProperties: number
  totalRevenue: number
  totalDisputes: number
  userGrowthRate: number
  revenueGrowthRate: number
}

export interface RevenueAnalytics {
  total: number
  byMethod: Record<string, number>
  byCity: Record<string, number>
  forecast: {
    month: string
    predicted: number
    actual: number
  }[]
}

export interface UserAnalytics {
  total: number
  active: number
  newThisMonth: number
  retentionRate: number
  demographics: {
    ageGroup: string
    count: number
  }[]
}

export interface PropertyAnalytics {
  total: number
  pendingApproval: number
  byCity: Record<string, number>
  occupancyRate: number
  averagePrice: number
}
