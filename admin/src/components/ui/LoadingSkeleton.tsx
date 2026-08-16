'use client'

export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-white/10 rounded ${className || 'h-4 w-full'}`} />
  )
}

export function CardSkeleton() {
  return (
    <div className="admin-card">
      <div className="admin-card-body space-y-3">
        <LoadingSkeleton className="h-4 w-3/4" />
        <LoadingSkeleton className="h-4 w-1/2" />
        <LoadingSkeleton className="h-4 w-5/6" />
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="admin-card">
      <div className="admin-card-body p-0">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                {[...Array(columns)].map((_, i) => (
                  <th key={i} className="admin-table-cell">
                    <LoadingSkeleton className="h-4 w-20" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(rows)].map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {[...Array(columns)].map((_, colIndex) => (
                    <td key={colIndex} className="admin-table-cell">
                      <LoadingSkeleton className="h-4 w-full" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
