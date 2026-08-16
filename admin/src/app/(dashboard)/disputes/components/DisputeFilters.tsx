'use client'

import { useState } from 'react'

const statusOptions = ['', 'open', 'under_review', 'mediation', 'resolved', 'closed']
const typeOptions = ['', 'payment', 'property_condition', 'lease_violation', 'security_deposit', 'other']
const priorityOptions = ['', 'low', 'medium', 'high', 'critical']

export default function DisputeFilters() {
  const [status, setStatus] = useState('')
  const [type, setType] = useState('')
  const [priority, setPriority] = useState('')

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <select className="admin-input h-9 w-auto text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
        {statusOptions.map((s) => (
          <option key={s} value={s}>{s === '' ? 'All statuses' : s.replace('_', ' ')}</option>
        ))}
      </select>
      <select className="admin-input h-9 w-auto text-sm" value={type} onChange={(e) => setType(e.target.value)}>
        {typeOptions.map((t) => (
          <option key={t} value={t}>{t === '' ? 'All types' : t.replace('_', ' ')}</option>
        ))}
      </select>
      <select className="admin-input h-9 w-auto text-sm" value={priority} onChange={(e) => setPriority(e.target.value)}>
        {priorityOptions.map((p) => (
          <option key={p} value={p}>{p === '' ? 'All priorities' : p}</option>
        ))}
      </select>
      <button
        onClick={() => { setStatus(''); setType(''); setPriority('') }}
        className="admin-btn-secondary h-9 px-3 text-sm"
      >
        Clear
      </button>
    </div>
  )
}