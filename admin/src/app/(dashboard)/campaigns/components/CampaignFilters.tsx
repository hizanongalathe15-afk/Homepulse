'use client'

import { useState } from 'react'

const statusOptions = ['', 'active', 'paused', 'completed', 'cancelled']
const channelOptions = ['', 'social', 'email', 'sms', 'referral', 'outdoor']

export default function CampaignFilters() {
  const [status, setStatus] = useState('')
  const [channel, setChannel] = useState('')

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <select className="admin-input h-9 w-auto text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
        {statusOptions.map((s) => (
          <option key={s} value={s}>{s === '' ? 'All statuses' : s}</option>
        ))}
      </select>
      <select className="admin-input h-9 w-auto text-sm" value={channel} onChange={(e) => setChannel(e.target.value)}>
        {channelOptions.map((c) => (
          <option key={c} value={c}>{c === '' ? 'All channels' : c}</option>
        ))}
      </select>
      <button onClick={() => { setStatus(''); setChannel('') }} className="admin-btn-secondary h-9 px-3 text-sm">
        Clear
      </button>
    </div>
  )
}