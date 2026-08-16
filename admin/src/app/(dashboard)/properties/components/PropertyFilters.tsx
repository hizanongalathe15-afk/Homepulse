'use client'

import { useState } from 'react'
import { AdminInput } from '@/components/ui/AdminInput'

const typeOptions = ['', 'apartment', 'house', 'commercial', 'land']
const statusOptions = ['', 'pending', 'approved', 'rejected', 'flagged']

export default function PropertyFilters() {
  const [city, setCity] = useState('')
  const [type, setType] = useState('')
  const [status, setStatus] = useState('')
  const [minPrice, setMinPrice] = useState('')

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <AdminInput
        className="h-9 max-w-[160px] text-sm"
        placeholder="City..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <select className="admin-input h-9 w-auto text-sm" value={type} onChange={(e) => setType(e.target.value)}>
        {typeOptions.map((t) => (
          <option key={t} value={t}>{t === '' ? 'All types' : t.charAt(0).toUpperCase() + t.slice(1)}</option>
        ))}
      </select>
      <select className="admin-input h-9 w-auto text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
        {statusOptions.map((s) => (
          <option key={s} value={s}>{s === '' ? 'All statuses' : s.charAt(0).toUpperCase() + s.slice(1)}</option>
        ))}
      </select>
      <AdminInput
        className="h-9 max-w-[140px] text-sm"
        type="number"
        placeholder="Min price"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
      />
      <button onClick={() => { setCity(''); setType(''); setStatus(''); setMinPrice('') }} className="admin-btn-secondary h-9 px-3 text-sm">
        Clear
      </button>
    </div>
  )
}