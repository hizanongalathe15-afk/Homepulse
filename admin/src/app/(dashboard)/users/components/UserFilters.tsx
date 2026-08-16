'use client'

import { useAdminFilters } from '@/hooks/useAdminFilters'

interface UserFiltersValue extends Record<string, unknown> {
  role: string
  status: string
  verified: string
}

const roleOptions = ['', 'tenant', 'landlord', 'agent', 'admin']
const statusOptions = ['', 'active', 'suspended', 'pending', 'inactive']

export default function UserFilters({
  onApply,
}: {
  onApply?: (filters: Record<string, unknown>) => void
}) {
  const { filters, updateFilter, hasActiveFilters, clearFilters } = useAdminFilters<UserFiltersValue>({
    role: '',
    status: '',
    verified: '',
  })

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <select
        className="admin-input h-9 w-auto text-sm"
        value={filters.role}
        onChange={(e) => updateFilter('role', e.target.value)}
      >
        {roleOptions.map((r) => (
          <option key={r} value={r}>
            {r === '' ? 'All roles' : r.charAt(0).toUpperCase() + r.slice(1)}
          </option>
        ))}
      </select>

      <select
        className="admin-input h-9 w-auto text-sm"
        value={filters.status}
        onChange={(e) => updateFilter('status', e.target.value)}
      >
        {statusOptions.map((s) => (
          <option key={s} value={s}>
            {s === '' ? 'All statuses' : s.charAt(0).toUpperCase() + s.slice(1)}
          </option>
        ))}
      </select>

      <select
        className="admin-input h-9 w-auto text-sm"
        value={filters.verified}
        onChange={(e) => updateFilter('verified', e.target.value)}
      >
        <option value="">Verified: All</option>
        <option value="true">Verified: Yes</option>
        <option value="false">Verified: No</option>
      </select>

      {hasActiveFilters && (
        <button onClick={clearFilters} className="admin-btn-secondary h-9 px-3 text-sm">
          Clear
        </button>
      )}

      {onApply && (
        <button onClick={() => onApply(filters)} className="admin-btn-primary h-9 px-3 text-sm">
          Apply
        </button>
      )}
    </div>
  )
}