'use client'

import { useState } from 'react'

const actionOptions = ['', 'user.ban', 'payment.refund', 'property.approve', 'auth.failed', 'settings.update']
const severityOptions = ['', 'info', 'warning', 'critical']

export default function AuditLogFilters() {
  const [action, setAction] = useState('')
  const [severity, setSeverity] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <select className="admin-input h-9 w-auto text-sm" value={action} onChange={(e) => setAction(e.target.value)}>
        {actionOptions.map((a) => (
          <option key={a} value={a}>{a === '' ? 'All actions' : a}</option>
        ))}
      </select>
      <select className="admin-input h-9 w-auto text-sm" value={severity} onChange={(e) => setSeverity(e.target.value)}>
        {severityOptions.map((s) => (
          <option key={s} value={s}>{s === '' ? 'All severities' : s}</option>
        ))}
      </select>
      <input type="date" className="admin-input h-9 w-auto text-sm" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
      <input type="date" className="admin-input h-9 w-auto text-sm" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
      <button
        onClick={() => { setAction(''); setSeverity(''); setDateFrom(''); setDateTo('') }}
        className="admin-btn-secondary h-9 px-3 text-sm"
      >
        Clear
      </button>
    </div>
  )
}
