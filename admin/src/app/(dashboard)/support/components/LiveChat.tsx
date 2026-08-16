'use client'

import { useState } from 'react'
import { SectionCard } from '@/components/features/SectionCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { AdminButton } from '@/components/ui/AdminButton'
import { Send, Phone, Video, MoreHorizontal } from 'lucide-react'

const agents = [
  { id: 'AGT-1', name: 'Sarah K.', status: 'online', activeChats: 3 },
  { id: 'AGT-2', name: 'James R.', status: 'online', activeChats: 1 },
  { id: 'AGT-3', name: 'Lisa M.', status: 'away', activeChats: 0 },
  { id: 'AGT-4', name: 'David K.', status: 'offline', activeChats: 0 },
]

const activeChats = [
  { id: 'CHAT-1', customer: 'John Mwangi', agent: 'Sarah K.', lastMessage: 'Thanks for the update.', unread: 1 },
  { id: 'CHAT-2', customer: 'Amina Hassan', agent: 'James R.', lastMessage: 'When will this be resolved?', unread: 2 },
  { id: 'CHAT-3', customer: 'Peter Otieno', agent: 'Sarah K.', lastMessage: 'Please see attached document.', unread: 0 },
]

export default function LiveChat() {
  const [selectedChat, setSelectedChat] = useState(activeChats[0].id)
  const [message, setMessage] = useState('')

  return (
    <SectionCard title="Live Chat" description="Real-time customer support chat">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-700">Active Agents</h4>
            {agents.map((agent) => (
              <div key={agent.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-700">
                    {agent.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{agent.name}</p>
                    <p className="text-xs text-slate-500">{agent.activeChats} active</p>
                  </div>
                </div>
                <StatusBadge variant={agent.status === 'online' ? 'success' : agent.status === 'away' ? 'warning' : 'default'} label={agent.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 border border-slate-200 rounded-md">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">{activeChats.find((c) => c.id === selectedChat)?.customer}</p>
              <p className="text-xs text-slate-500">Agent: {activeChats.find((c) => c.id === selectedChat)?.agent}</p>
            </div>
            <div className="flex items-center gap-2">
              <AdminButton variant="ghost" size="icon" className="h-8 w-8"><Phone size={16} /></AdminButton>
              <AdminButton variant="ghost" size="icon" className="h-8 w-8"><Video size={16} /></AdminButton>
              <AdminButton variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal size={16} /></AdminButton>
            </div>
          </div>

          <div className="p-4 space-y-3">
            {activeChats.map((chat) => (
              <div key={chat.id} onClick={() => setSelectedChat(chat.id)} className={`p-3 rounded-md cursor-pointer ${selectedChat === chat.id ? 'bg-slate-100' : 'bg-white hover:bg-slate-50'}`}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-900">{chat.customer}</p>
                  {chat.unread > 0 && <span className="h-4 w-4 rounded-full bg-primary text-white text-[10px] flex items-center justify-center">{chat.unread}</span>}
                </div>
                <p className="text-xs text-slate-500 mt-1 truncate">{chat.lastMessage}</p>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 h-10 rounded-md border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <AdminButton size="icon" className="h-10 w-10"><Send size={16} /></AdminButton>
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  )
}
