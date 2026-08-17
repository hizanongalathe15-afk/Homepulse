'use client'

import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GlassTableProps<T> {
  data: T[]
  columns: {
    key: string
    header: string
    width?: string
    align?: 'left' | 'center' | 'right'
    render?: (item: T) => ReactNode
  }[]
  emptyMessage?: string
  onRowClick?: (item: T) => void
  rowClassName?: string | ((item: T) => string)
}

export function GlassTable<T>({
  data,
  columns,
  emptyMessage = 'No data available',
  onRowClick,
  rowClassName,
}: GlassTableProps<T>) {
  const alignMap = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  return (
    <div className="ds-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="ds-table">
          <thead className="ds-table-header">
            <tr className="ds-table-header-row">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn('ds-table-header-cell', alignMap[col.align || 'left'])}
                  style={{ width: col.width }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="ds-table-empty">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={index}
                  className={cn('ds-table-body-row', onRowClick && 'cursor-pointer', typeof rowClassName === 'string' ? rowClassName : rowClassName?.(item))}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn('ds-table-cell', alignMap[col.align || 'left'])}
                    >
                      {col.render
                        ? col.render(item)
                        : (item as Record<string, unknown>)[col.key] as ReactNode}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
