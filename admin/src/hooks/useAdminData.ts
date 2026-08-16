'use client'

import { useState, useEffect, useCallback } from 'react'

export function useAdminData<T>(
  fetchFn: (params?: Record<string, unknown>) => Promise<T>,
  initialParams: Record<string, unknown> = {}
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [params, setParams] = useState(initialParams)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchFn(params)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [fetchFn, params])

  useEffect(() => {
    refetch()
  }, [refetch])

  return {
    data,
    loading,
    error,
    refetch,
    setParams,
  }
}
