'use client'

import { useState } from 'react'
import { Megaphone } from 'lucide-react'
import { AdminButton } from '@/components/ui/AdminButton'
import { AdminInput } from '@/components/ui/AdminInput'
import { SectionCard } from '@/components/features/SectionCard'

const audienceOptions = ['All users', 'Landlords', 'Tenants', 'Agents', 'Moderators']

export default function AnnouncementCreator() {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [audience, setAudience] = useState(audienceOptions[0])

  return (
    <SectionCard title="New Announcement" description="Broadcast an update to your chosen audience">
      <div className="space-y-4">
        <AdminInput
          label="Title"
          placeholder="e.g. New M-Pesa payment option"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
          <textarea
            className="admin-input min-h-[100px]"
            placeholder="Write the announcement message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Audience</label>
          <select className="admin-input" value={audience} onChange={(e) => setAudience(e.target.value)}>
            {audienceOptions.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <AdminButton variant="outline" disabled={title.trim() === ''}>Save Draft</AdminButton>
          <AdminButton disabled={title.trim() === '' || message.trim() === ''}>
            <Megaphone size={14} className="mr-1.5" /> Publish Now
          </AdminButton>
        </div>
      </div>
    </SectionCard>
  )
}