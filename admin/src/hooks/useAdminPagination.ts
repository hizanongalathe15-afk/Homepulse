'use client'

import { useState, useCallback } from 'react'

export function useAdminPagination(initialLimit = 20) {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(initialLimit)

  const nextPage = useCallback(() => setPage((prev) => prev + 1), [])
  const prevPage = useCallback(() => setPage((prev) => Math.max(1, prev - 1)), [])
  const goToPage = useCallback((newPage: number) => setPage(Math.max(1, newPage)), [])
  const reset = useCallback(() => {
    setPage(1)
    setLimit(initialLimit)
  }, [initialLimit])

  return {
    page,
    limit,
    setPage,
    setLimit,
    nextPage,
    prevPage,
    goToPage,
    reset,
  }
}
