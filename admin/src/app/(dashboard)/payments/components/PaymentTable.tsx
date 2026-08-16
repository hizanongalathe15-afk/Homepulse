'use client'

import type { Payment } from '@/types/payment.types'
import { DataTable } from '@/components/ui/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { AdminButton } from '@/components/ui/AdminButton'

const payments: Payment[] = [
  { id: 'PAY-10001', userId: 'USR-1002', userName: 'John Mwangi', amount: 4500, currency: 'USD', method: 'mpesa', status: 'completed', type: 'rent', reference: 'REF-MP-8842', propertyTitle: 'Sunset Apartments, Westlands', paidAt: new Date('2026-08-14'), createdAt: new Date('2026-08-14') },
  { id: 'PAY-10002', userId: 'USR-1021', userName: 'Diana Njeri', amount: 12000, currency: 'USD', method: 'stripe', status: 'completed', type: 'deposit', reference: 'REF-ST-1023', propertyTitle: 'Beachside Villa, Mombasa', paidAt: new Date('2026-08-13'), createdAt: new Date('2026-08-13') },
  { id: 'PAY-10003', userId: 'USR-1006', userName: 'David Kimani', amount: 850, currency: 'USD', method: 'mpesa', status: 'pending', type: 'commission', reference: 'REF-MP-8856', propertyId: 'PROP-004', createdAt: new Date('2026-08-14') },
  { id: 'PAY-10004', userId: 'USR-1033', userName: 'Robert Kipoo', amount: 2400, currency: 'USD', method: 'bank_transfer', status: 'failed', type: 'rent', reference: 'REF-BT-5501', propertyTitle: 'Hillcrest House, Nakuru', createdAt: new Date('2026-08-12') },
  { id: 'PAY-10005', userId: 'USR-1040', userName: 'Grace Muthoni', amount: 3200, currency: 'USD', method: 'stripe', status: 'refunded', type: 'deposit', reference: 'REF-ST-1088', propertyTitle: 'Riverside Studio', paidAt: new Date('2026-08-05'), createdAt: new Date('2026-08-04') },
]

function statusVariant(status: Payment['status']) {
  return status === 'completed' ? 'success' : status === 'pending' ? 'warning' : status === 'failed' ? 'destructive' : 'default'
}

export default function PaymentTable() {
  return (
    <DataTable<Payment>
      data={payments}
      searchPlaceholder="Search by reference, user or property..."
      columns={[
        { key: 'reference', header: 'Reference', render: (p) => <span className="font-mono text-xs">{p.reference}</span> },
        { key: 'userName', header: 'User', render: (p) => p.userName },
        { key: 'propertyTitle', header: 'Property', render: (p) => p.propertyTitle || '—' },
        { key: 'amount', header: 'Amount', render: (p) => `$${p.amount.toLocaleString()}` },
        { key: 'method', header: 'Method', render: (p) => <span className="capitalize">{p.method.replace('_', ' ')}</span> },
        { key: 'type', header: 'Type', render: (p) => <span className="capitalize">{p.type}</span> },
        {
          key: 'status',
          header: 'Status',
          render: (p) => <StatusBadge variant={statusVariant(p.status)} label={p.status} />,
        },
        {
          key: 'actions',
          header: 'Actions',
          render: () => <AdminButton size="sm" variant="outline">Details</AdminButton>,
        },
      ]}
    />
  )
}