'use client'

import { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { AdminButton } from './AdminButton'
import { AdminInput } from './AdminInput'
import type { AdminModalProps } from './AdminModal'

interface DataTableProps<T> {
  data: T[]
  columns: {
    key: string
    header: string
    sortable?: boolean
    render?: (item: T) => React.ReactNode
  }[]
  onRowClick?: (item: T) => void
  isLoading?: boolean
  searchPlaceholder?: string
  filters?: React.ReactNode
  actions?: React.ReactNode
  onDelete?: (id: string) => void
  deleteModal?: (id: string) => { open: boolean; onClose: () => void }
}

export function DataTable<T>({
  data,
  columns,
  onRowClick,
  isLoading,
  searchPlaceholder = 'Search...',
  filters,
  actions,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <AdminInput
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center gap-2">
          {filters}
          {actions}
        </div>
      </div>
      <div className="admin-card">
        <div className="admin-card-body p-0">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead className="admin-table-header">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={cn('admin-table-cell text-left font-medium text-muted-foreground', col.sortable && 'cursor-pointer select-none')}
                      onClick={() => col.sortable && handleSort(col.key)}
                    >
                      <div className="flex items-center gap-1">
                        {col.header}
                        {col.sortable && sortKey === col.key && (
                          <>{sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="admin-table-body">
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      {columns.map((col) => (
                        <td key={col.key} className="admin-table-cell">
                          <div className="h-4 bg-white/5 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="admin-table-cell text-center py-12 text-muted-foreground">
                      No data found
                    </td>
                  </tr>
                ) : (
                  data.map((item, index) => (
                    <tr
                      key={index}
                      className={cn('admin-table-row', onRowClick && 'cursor-pointer')}
                      onClick={() => onRowClick?.(item)}
                    >
                      {columns.map((col) => (
                        <td key={col.key} className="admin-table-cell text-foreground">
                          {col.render ? col.render(item) : (item as Record<string, unknown>)[col.key] as React.ReactNode}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ')
}
