'use client'

import { useState, useCallback } from 'react'

export function useAdminFilters<T extends Record<string, unknown>>(
  initialFilters: T = {} as T
) {
  const [filters, setFilters] = useState<T>(initialFilters)

  const updateFilter = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters(initialFilters)
  }, [initialFilters])

  const hasActiveFilters = useCallback(() => {
    return Object.values(filters).some((value) => value !== undefined && value !== '' && value !== null)
  }, [filters])

  return {
    filters,
    setFilters,
    updateFilter,
    clearFilters,
    hasActiveFilters: hasActiveFilters(),
  }
}
