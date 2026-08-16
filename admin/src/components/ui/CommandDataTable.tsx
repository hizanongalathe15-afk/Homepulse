'use client'

import { useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type SortingState,
  type ColumnDef,
  type CellContext,
} from '@tanstack/react-table'
import { AdminButton } from '@/components/ui/AdminButton'
import { AdminInput } from '@/components/ui/AdminInput'
import { Download, ChevronUp, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CommandDataTableProps<T> {
  data: T[]
  columns: ColumnDef<T, any>[]
  onExport?: () => void
  searchPlaceholder?: string
  title?: string
  description?: string
  className?: string
}

export function CommandDataTable<T>({
  data,
  columns,
  onExport,
  searchPlaceholder = 'Search...',
  title,
  description,
  className = '',
}: CommandDataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnVisibility, setColumnVisibility] = useState({})

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const handleExport = () => {
    if (onExport) {
      onExport()
      return
    }
    const headers = columns.map((c) => typeof c.header === 'string' ? c.header : String(c.header)).join(',')
    const rows = table.getFilteredRowModel().rows.map((row) =>
      columns.map((c) => {
        const key = String(c.id || '')
        const value = row.original[key as keyof T]
        return typeof value === 'string' ? `"${value}"` : value
      }).join(',')
    )
    const csv = [headers, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title || 'export'}-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className={cn('command-panel', className)}>
      {(title || description) && (
        <div className="command-panel-header">
          <div>
            {title && <h3 className="command-panel-title">{title}</h3>}
            {description && <p className="command-panel-description">{description}</p>}
          </div>
          <div className="flex items-center gap-2">
            <AdminInput
              placeholder={searchPlaceholder}
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="command-input max-w-xs"
            />
            {onExport && (
              <AdminButton variant="outline" size="sm" onClick={handleExport}>
                <Download size={14} className="mr-1" />
                Export
              </AdminButton>
            )}
          </div>
        </div>
      )}
      <div className="command-panel-body">
        <div className="overflow-x-auto">
          <table className="command-table">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={cn(
                        'command-table-cell text-left text-xs font-medium uppercase tracking-wider',
                        header.column.getIsSorted() && 'text-command-cyan'
                      )}
                      style={{ width: header.getSize() }}
                    >
                      <div
                        className={cn(
                          'flex items-center gap-1',
                          header.column.getCanSort() && 'cursor-pointer select-none hover:text-command-cyan transition-colors'
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <span className="command-sort-indicator">
                            {header.column.getIsSorted() === 'asc' ? (
                              <ChevronUp size={12} />
                            ) : header.column.getIsSorted() === 'desc' ? (
                              <ChevronDown size={12} />
                            ) : null}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="command-table-body">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="command-table-cell text-center py-12 text-slate-400">
                    No data found
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row, index) => (
                  <tr key={row.id} className={cn('command-table-row', index % 2 === 1 && 'command-table-row-alt')}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="command-table-cell text-slate-200">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
  )
}
