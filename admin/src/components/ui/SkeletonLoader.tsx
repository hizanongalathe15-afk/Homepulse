'use client'

import { cn } from '@/lib/utils'

interface SkeletonLoaderProps {
  className?: string
  variant?: 'text' | 'title' | 'avatar' | 'rect' | 'circle'
  width?: string | number
  height?: string | number
  count?: number
}

const variantMap = {
  text: 'ds-skeleton ds-skeleton-text',
  title: 'ds-skeleton ds-skeleton-title',
  avatar: 'ds-skeleton ds-skeleton-avatar',
  rect: 'ds-skeleton',
  circle: 'ds-skeleton rounded-full',
}

export function SkeletonLoader({
  className = '',
  variant = 'text',
  width,
  height,
  count = 1,
}: SkeletonLoaderProps) {
  const style: React.CSSProperties = {}
  if (width) style.width = typeof width === 'number' ? `${width}px` : width
  if (height) style.height = typeof height === 'number' ? `${height}px` : height

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(variantMap[variant], className)}
          style={style}
        />
      ))}
    </>
  )
}

export function CardSkeleton() {
  return (
    <div className="ds-card">
      <div className="ds-card-body">
        <div className="animate-pulse space-y-4">
          <SkeletonLoader variant="title" count={1} />
          <SkeletonLoader variant="text" count={3} />
        </div>
      </div>
    </div>
  )
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="ds-table-cell">
          <SkeletonLoader variant="text" height={16} />
        </td>
      ))}
    </tr>
  )
}
