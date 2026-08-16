'use client'

import { useAdminData } from './useAdminData'
import { adminAnalyticsService } from '@/services/adminAnalytics.service'

export function useAnalytics(dateFrom?: string, dateTo?: string) {
  const { data, loading, error, refetch, setParams } = useAdminData(
    (params) => adminAnalyticsService.getOverview(),
    {}
  )

  return {
    data,
    loading,
    error,
    refetch,
  }
}

export function useRevenueAnalytics(dateFrom: string, dateTo: string) {
  return useAdminData(
    () => adminAnalyticsService.getRevenueAnalytics(dateFrom, dateTo)
  )
}

export function useUserAnalytics(dateFrom: string, dateTo: string) {
  return useAdminData(
    () => adminAnalyticsService.getUserAnalytics(dateFrom, dateTo)
  )
}

export function usePropertyAnalytics(dateFrom: string, dateTo: string) {
  return useAdminData(
    () => adminAnalyticsService.getPropertyAnalytics(dateFrom, dateTo)
  )
}
