'use client'

interface AdminTableProps<T> {
  data: T[]
  columns: {
    key: string
    header: string
    render?: (item: T) => React.ReactNode
  }[]
  onRowClick?: (item: T) => void
  isLoading?: boolean
}

export function AdminTable<T>({ data, columns, onRowClick, isLoading }: AdminTableProps<T>) {
  if (isLoading) {
    return (
      <div className="admin-card">
        <div className="admin-card-body">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-white/5 rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead className="admin-table-header">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="admin-table-cell text-left font-medium text-muted-foreground">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="admin-table-body">
            {data.map((item, index) => (
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ')
}
