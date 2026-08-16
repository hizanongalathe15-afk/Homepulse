'use client'

import { useState } from 'react'
import { AdminButton } from '@/components/ui/AdminButton'
import { SectionCard } from '@/components/features/SectionCard'

const channels = [
  { value: 'push', label: 'Push Notification' },
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'SMS' },
  { value: 'in_app', label: 'In-App' },
]

const segments = [
  { value: 'all', label: 'All Users' },
  { value: 'tenants', label: 'Tenants' },
  { value: 'landlords', label: 'Landlords' },
  { value: 'new', label: 'New Users (7d)' },
]

export default function NotificationCreator() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [channel, setChannel] = useState('push')
  const [segment, setSegment] = useState('all')

  return (
    <>
      <AdminButton onClick={() => setOpen(true)}>Create Notification</AdminButton>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-white rounded-lg shadow-lg max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Create Notification</h3>
              <p className="mt-1 text-sm text-slate-500">Compose and send a notification to selected users.</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input
                  className="admin-input w-full"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Notification title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                <textarea
                  className="admin-input w-full h-24 resize-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Channel</label>
                  <select className="admin-input w-full" value={channel} onChange={(e) => setChannel(e.target.value)}>
                    {channels.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Segment</label>
                  <select className="admin-input w-full" value={segment} onChange={(e) => setSegment(e.target.value)}>
                    {segments.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <AdminButton variant="secondary" onClick={() => setOpen(false)}>Cancel</AdminButton>
              <AdminButton onClick={() => setOpen(false)}>Send Now</AdminButton>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
