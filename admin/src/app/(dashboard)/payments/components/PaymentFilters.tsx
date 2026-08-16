'use client'

import { useState } from 'react'

const methodOptions = ['', 'mpesa', 'stripe', 'cash', 'bank_transfer']
const statusOptions = ['', 'pending', 'completed', 'failed', 'refunded']
const typeOptions = ['', 'rent', 'deposit', 'commission', 'subscription']

export default function PaymentFilters() {
  const [method, setMethod] = useState('')
  const [status, setStatus] = useState('')
  const [type, setType] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <select className="admin-input h-9 w-auto text-sm" value={method} onChange={(e) => setMethod(e.target.value)}>
        {methodOptions.map((m) => (
          <option key={m} value={m}>{m === '' ? 'All methods' : m.replace('_', ' ')}</option>
        ))}
      </select>
      <select className="admin-input h-9 w-auto text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
        {statusOptions.map((s) => (
          <option key={s} value={s}>{s === '' ? 'All statuses' : s}</option>
        ))}
      </select>
      <select className="admin-input h-9 w-auto text-sm" value={type} onChange={(e) => setType(e.target.value)}>
        {typeOptions.map((t) => (
          <option key={t} value={t}>{t === '' ? 'All types' : t}</option>
        ))}
      </select>
      <input type="date" className="admin-input h-9 w-auto text-sm" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
      <input type="date" className="admin-input h-9 w-auto text-sm" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
      <button
        onClick={() => { setMethod(''); setStatus(''); setType(''); setDateFrom(''); setDateTo('') }}
        className="admin-btn-secondary h-9 px-3 text-sm"
      >
        Clear
      </button>
    </div>
  )
}