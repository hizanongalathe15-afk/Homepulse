'use client'

import { useParams } from 'next/navigation'
import { AdminHeader } from '@/components/ui/AdminHeader'
import { SectionCard } from '@/components/features/SectionCard'
import { InfoRow } from '@/components/features/InfoRow'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { AdminButton } from '@/components/ui/AdminButton'
import type { SupportTicket, SupportMessage } from '@/types/support.types'
import { ChevronLeft } from 'lucide-react'

const ticket: SupportTicket = {
  id: 'TKT-1001', subject: 'Payment not reflecting after deposit', status: 'open', priority: 'high',
  userId: 'USR-1002', userName: 'John Mwangi', assignee: 'Sarah K.', category: 'payments',
  createdAt: new Date('2026-08-14T09:30:00'), updatedAt: new Date('2026-08-15T10:00:00'), messages: 3,
}

const messages: SupportMessage[] = [
  { id: 'MSG-1', ticketId: 'TKT-1001', senderId: 'USR-1002', senderName: 'John Mwangi', senderRole: 'customer', content: 'I made a deposit via M-Pesa on Monday but the payment still shows as pending.', timestamp: new Date('2026-08-14T09:30:00') },
  { id: 'MSG-2', ticketId: 'TKT-1001', senderId: 'USR-1001', senderName: 'Sarah K.', senderRole: 'agent', content: 'Thanks for reaching out. Could you share the M-Pesa confirmation code?', timestamp: new Date('2026-08-14T10:15:00') },
  { id: 'MSG-3', ticketId: 'TKT-1001', senderId: 'USR-1002', senderName: 'John Mwangi', senderRole: 'customer', content: 'Sure, it is QK83F2A4B.', timestamp: new Date('2026-08-15T09:00:00') },
]

export default function TicketDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id ?? ticket.id

  return (
    <div className="space-y-6">
      <AdminHeader
        title={ticket.subject}
        description={`Ticket: ${id} · Opened by ${ticket.userName}`}
        breadcrumbs={[{ label: 'Support', href: '/support' }, { label: id }]}
        actions={
          <div className="flex items-center gap-2">
            <AdminButton variant="outline" size="sm">
              <ChevronLeft size={16} className="mr-2" />
              Back to tickets
            </AdminButton>
            <StatusBadge variant={ticket.status === 'open' ? 'info' : ticket.status === 'escalated' ? 'destructive' : 'success'} label={ticket.status} />
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <SectionCard title="Ticket Details">
            <div>
              <InfoRow label="Customer" value={ticket.userName} />
              <InfoRow label="Category" value={ticket.category} />
              <InfoRow label="Priority" value={ticket.priority} />
              <InfoRow label="Assignee" value={ticket.assignee} />
              <InfoRow label="Created" value={ticket.createdAt.toLocaleString()} />
              <InfoRow label="Last Updated" value={ticket.updatedAt.toLocaleString()} />
            </div>
          </SectionCard>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <SectionCard title="Conversation">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className="flex gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-slate-900">{msg.senderName}</span>
                      <StatusBadge variant={msg.senderRole === 'agent' ? 'success' : msg.senderRole === 'customer' ? 'info' : 'default'} label={msg.senderRole} />
                      <span className="text-xs text-slate-400">{msg.timestamp.toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-slate-700 bg-slate-50 rounded-md p-3">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  )
}
