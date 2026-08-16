'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { SectionCard } from '@/components/features/SectionCard'
import { AdminInput } from '@/components/ui/AdminInput'

interface Message {
  id: number
  author: string
  text: string
  time: string
  mine?: boolean
}

const initialMessages: Message[] = [
  { id: 1, author: 'Mediator - J. Kimani', text: 'Good morning. I will guide this session. Please present your opening statements.', time: '09:12' },
  { id: 2, author: 'John Mwangi', text: 'I vacated on the agreed date and the house was clean. I expect my full deposit back.', time: '09:20' },
  { id: 3, author: 'Mary Wanjiku', text: 'A window was cracked. I have the report to prove it costs $180 to fix.', time: '09:26', mine: true },
]

export default function MediationChat() {
  const [messages, setMessages] = useState(initialMessages)
  const [draft, setDraft] = useState('')

  const send = () => {
    if (draft.trim() === '') return
    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, author: 'You (Admin)', text: draft, time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), mine: true },
    ])
    setDraft('')
  }

  return (
    <SectionCard title="Mediation Chat" description="Live conversation between the parties and the mediator">
      <div className="space-y-3 max-h-72 overflow-y-auto pr-1 mb-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.mine ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[78%] rounded-lg px-3 py-2 text-sm ${message.mine ? 'bg-primary text-white' : 'bg-slate-100 text-slate-800'}`}>
              <p className={`text-xs font-semibold mb-0.5 ${message.mine ? 'text-primary-foreground/80' : 'text-slate-500'}`}>
                {message.author} · {message.time}
              </p>
              <p>{message.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <AdminInput
          placeholder="Type a message..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
        />
        <button onClick={send} className="admin-btn-primary h-10 px-3" aria-label="Send message">
          <Send size={16} />
        </button>
      </div>
    </SectionCard>
  )
}