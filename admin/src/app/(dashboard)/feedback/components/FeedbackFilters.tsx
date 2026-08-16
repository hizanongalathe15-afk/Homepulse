'use client'

import { useState } from 'react'

const statusOptions = ['', 'pending', 'replied', 'flagged', 'resolved']

export default function FeedbackFilters() {
  const [status, setStatus] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <select className="admin-input h-9 w-auto text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
        {statusOptions.map((s) => (
          <option key={s} value={s}>{s === '' ? 'All statuses' : s}</option>
        ))}
      </select>
      <input type="date" className="admin-input h-9 w-auto text-sm" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
      <input type="date" className="admin-input h-9 w-auto text-sm" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
      <button
        onClick={() => { setStatus(''); setDateFrom(''); setDateTo('') }}
        className="admin-btn-secondary h-9 px-3 text-sm"
      >
        Clear
      </button>
    </div>
  )
}
