'use client'

import type { SupportTicket } from '@/types/support.types'
import { DataTable } from '@/components/ui/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { AdminButton } from '@/components/ui/AdminButton'
import { Eye, MessageSquare } from 'lucide-react'

interface SupportTicketsProps {
  filter: 'all' | 'open' | 'resolved' | 'escalated'
  onFilterChange: (filter: 'all' | 'open' | 'resolved' | 'escalated') => void
}

const tickets: SupportTicket[] = [
  {
    id: 'TKT-1001', subject: 'Payment not reflecting after deposit', status: 'open', priority: 'high',
    userId: 'USR-1002', userName: 'John Mwangi', assignee: 'Sarah K.', category: 'payments',
    createdAt: new Date('2026-08-14T09:30:00'), updatedAt: new Date('2026-08-15T10:00:00'), messages: 3,
  },
  {
    id: 'TKT-1002', subject: 'Unable to upload property photos', status: 'open', priority: 'medium',
    userId: 'USR-1003', userName: 'Amina Hassan', assignee: 'James R.', category: 'technical',
    createdAt: new Date('2026-08-13T14:20:00'), updatedAt: new Date('2026-08-14T08:15:00'), messages: 5,
  },
  {
    id: 'TKT-1003', subject: 'Lease agreement request denied', status: 'escalated', priority: 'critical',
    userId: 'USR-1004', userName: 'Peter Otieno', assignee: 'Lisa M.', category: 'legal',
    createdAt: new Date('2026-08-10T11:45:00'), updatedAt: new Date('2026-08-15T16:30:00'), messages: 8,
  },
  {
    id: 'TKT-1004', subject: 'Refund status inquiry', status: 'resolved', priority: 'low',
    userId: 'USR-1005', userName: 'Grace Njoroge', assignee: 'David K.', category: 'payments',
    createdAt: new Date('2026-08-08T16:00:00'), updatedAt: new Date('2026-08-12T09:00:00'), messages: 2,
  },
  {
    id: 'TKT-1005', subject: 'Listing suspension appeal', status: 'open', priority: 'medium',
    userId: 'USR-1006', userName: 'David Kimani', assignee: 'Sarah K.', category: 'listings',
    createdAt: new Date('2026-08-12T08:30:00'), updatedAt: new Date('2026-08-13T11:00:00'), messages: 4,
  },
  {
    id: 'TKT-1006', subject: 'Mobile app login issues', status: 'resolved', priority: 'medium',
    userId: 'USR-1007', userName: 'Faith Wanjiku', assignee: 'James R.', category: 'technical',
    createdAt: new Date('2026-08-05T13:10:00'), updatedAt: new Date('2026-08-09T10:20:00'), messages: 6,
  },
]

function statusVariant(status: SupportTicket['status']) {
  switch (status) {
    case 'open': return 'info'
    case 'escalated': return 'destructive'
    case 'resolved': return 'success'
    default: return 'default'
  }
}

function priorityVariant(priority: SupportTicket['priority']) {
  switch (priority) {
    case 'critical': return 'destructive'
    case 'high': return 'destructive'
    case 'medium': return 'warning'
    case 'low': return 'default'
    default: return 'default'
  }
}

export default function SupportTickets({ filter, onFilterChange }: SupportTicketsProps) {
  const filtered = filter === 'all' ? tickets : tickets.filter((t) => t.status === filter)

  const filters = (
    <div className="flex items-center gap-2">
      {(['all', 'open', 'escalated', 'resolved'] as const).map((f) => (
        <AdminButton
          key={f}
          variant={filter === f ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onFilterChange(f)}
          className="capitalize"
        >
          {f}
        </AdminButton>
      ))}
    </div>
  )

  return (
    <div className="admin-card">
      <div className="admin-card-header flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-slate-900">Support Tickets</h3>
        {filters}
      </div>
      <div className="admin-card-body p-0">
        <DataTable
          data={filtered}
          searchPlaceholder="Search tickets by subject or user..."
          actions={
            <AdminButton size="sm">
              <MessageSquare size={16} className="mr-2" />
              New Ticket
            </AdminButton>
          }
          columns={[
            {
              key: 'id',
              header: 'Ticket',
              render: (t) => (
                <div>
                  <p className="font-medium text-slate-900">{t.id}</p>
                  <p className="text-xs text-slate-500">{t.subject}</p>
                </div>
              ),
            },
            {
              key: 'userName',
              header: 'Customer',
              render: (t) => <span className="text-sm">{t.userName}</span>,
            },
            {
              key: 'category',
              header: 'Category',
              render: (t) => <span className="capitalize text-sm">{t.category}</span>,
            },
            {
              key: 'priority',
              header: 'Priority',
              render: (t) => <StatusBadge variant={priorityVariant(t.priority)} label={t.priority} />,
            },
            {
              key: 'status',
              header: 'Status',
              render: (t) => <StatusBadge variant={statusVariant(t.status)} label={t.status} />,
            },
            {
              key: 'assignee',
              header: 'Assignee',
              render: (t) => <span className="text-sm">{t.assignee}</span>,
            },
            {
              key: 'updatedAt',
              header: 'Updated',
              render: (t) => t.updatedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
            },
            {
              key: 'actions',
              header: '',
              render: (t) => (
                <AdminButton variant="ghost" size="icon" className="h-8 w-8" onClick={() => {}}>
                  <Eye size={16} />
                </AdminButton>
              ),
            },
          ]}
        />
      </div>
    </div>
  )
}
