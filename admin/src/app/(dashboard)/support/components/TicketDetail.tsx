'use client'

import type { SupportTicket } from '@/types/support.types'
import { SectionCard } from '@/components/features/SectionCard'
import { InfoRow } from '@/components/features/InfoRow'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { AdminButton } from '@/components/ui/AdminButton'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface TicketDetailProps {
  ticket: SupportTicket
}

export default function TicketDetail({ ticket }: TicketDetailProps) {
  return (
    <SectionCard title={`Ticket ${ticket.id}`}>
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h4 className="text-base font-semibold text-slate-900">{ticket.subject}</h4>
            <p className="text-sm text-slate-500 mt-1">Opened by {ticket.userName} on {ticket.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge variant={ticket.status === 'open' ? 'info' : ticket.status === 'escalated' ? 'destructive' : 'success'} label={ticket.status} />
            <StatusBadge variant={ticket.priority === 'critical' || ticket.priority === 'high' ? 'destructive' : ticket.priority === 'medium' ? 'warning' : 'default'} label={ticket.priority} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
          <InfoRow label="Assignee" value={ticket.assignee} />
          <InfoRow label="Category" value={ticket.category} />
          <InfoRow label="Messages" value={String(ticket.messages)} />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Link href="/support">
            <AdminButton variant="outline" size="sm">
              <ArrowLeft size={16} className="mr-2" />
              Back to tickets
            </AdminButton>
          </Link>
          <AdminButton size="sm">Reply</AdminButton>
          <AdminButton variant="outline" size="sm">Escalate</AdminButton>
          <AdminButton variant="destructive" size="sm">Close Ticket</AdminButton>
        </div>
      </div>
    </SectionCard>
  )
}
