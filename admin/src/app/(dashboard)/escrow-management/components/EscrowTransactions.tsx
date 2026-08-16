'use client'

import type { Payment } from '@/types/payment.types'
import { CommandDataTable } from '@/components/ui/CommandDataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'
import type { ColumnDef } from '@tanstack/react-table'

const transactions: Payment[] = [
  { id: 'TXN-9001', userId: 'USR-1002', userName: 'John Mwangi', amount: 4500, currency: 'USD', method: 'mpesa', status: 'completed', type: 'deposit', reference: 'ESC-1001', propertyTitle: 'Sunset Apartments, Westlands', createdAt: new Date('2026-08-01') },
  { id: 'TXN-9002', userId: 'USR-1021', userName: 'Diana Njeri', amount: 12000, currency: 'USD', method: 'mpesa', status: 'completed', type: 'deposit', reference: 'ESC-1002', propertyTitle: 'Beachside Villa, Mombasa', createdAt: new Date('2026-08-03') },
  { id: 'TXN-9003', userId: 'USR-1006', userName: 'David Kimani', amount: 2800, currency: 'USD', method: 'stripe', status: 'completed', type: 'deposit', reference: 'ESC-1003', propertyId: 'PROP-004', propertyTitle: 'Lakeview Flats, Kisumu', createdAt: new Date('2026-08-05') },
  { id: 'TXN-9004', userId: 'USR-1033', userName: 'Robert Kipoo', amount: 8500, currency: 'USD', method: 'bank_transfer', status: 'refunded', type: 'deposit', reference: 'ESC-1004', propertyTitle: 'Hillcrest House, Nakuru', createdAt: new Date('2026-07-20') },
  { id: 'TXN-9005', userId: 'USR-1015', userName: 'Grace Wairimu', amount: 6200, currency: 'USD', method: 'mpesa', status: 'completed', type: 'deposit', reference: 'ESC-1005', propertyTitle: 'Green Park Residences, Nairobi', createdAt: new Date('2026-08-06') },
  { id: 'TXN-9006', userId: 'USR-1028', userName: 'James Kariuki', amount: 15000, currency: 'USD', method: 'bank_transfer', status: 'pending', type: 'deposit', reference: 'ESC-1006', propertyTitle: 'Ocean View, Mombasa', createdAt: new Date('2026-08-10') },
  { id: 'TXN-9007', userId: 'USR-1035', userName: 'Lucy Mwende', amount: 3400, currency: 'USD', method: 'stripe', status: 'failed', type: 'deposit', reference: 'ESC-1007', propertyTitle: 'Hillside Gardens, Nakuru', createdAt: new Date('2026-08-12') },
]

export default function EscrowTransactions() {
  const handleExport = () => {
    const headers = ['Reference', 'Party', 'Property', 'Amount', 'Method', 'Status'].join(',')
    const rows = transactions.map((t) => [
      `"${t.reference}"`,
      `"${t.userName}"`,
      `"${t.propertyTitle}"`,
      t.amount,
      `"${t.method.replace('_', ' ')}"`,
      `"${t.status}"`,
    ].join(','))
    const csv = [headers, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `escrow-transactions-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const columns: ColumnDef<Payment>[] = [
    {
      id: 'reference',
      header: 'Reference',
      accessorKey: 'reference',
      size: 120,
      cell: (info) => <span className="font-mono text-xs text-command-cyan">{info.row.original.reference}</span>,
    },
    {
      id: 'party',
      header: 'Party',
      accessorKey: 'userName',
      size: 140,
      cell: (info) => <span className="font-medium text-slate-100">{info.row.original.userName}</span>,
    },
    {
      id: 'property',
      header: 'Property',
      accessorKey: 'propertyTitle',
      size: 200,
      cell: (info) => <span className="text-slate-300">{info.row.original.propertyTitle}</span>,
    },
    {
      id: 'amount',
      header: 'Amount',
      accessorKey: 'amount',
      size: 100,
      cell: (info) => <span className="font-mono text-sm text-slate-100">${info.row.original.amount.toLocaleString()}</span>,
    },
    {
      id: 'method',
      header: 'Method',
      accessorKey: 'method',
      size: 120,
      cell: (info) => (
        <span className="inline-flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-command-cyan" />
          <span className="text-slate-300 capitalize">{info.row.original.method.replace('_', ' ')}</span>
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      size: 100,
      cell: (info) => {
        const status = info.row.original.status
        return (
          <StatusBadge
            variant={status === 'completed' ? 'success' : status === 'refunded' ? 'warning' : status === 'failed' ? 'destructive' : 'default'}
            label={status}
          />
        )
      },
    },
  ]

  return (
    <CommandDataTable<Payment>
      data={transactions}
      title="Escrow Transactions"
      description="All escrow-related payment transactions"
      searchPlaceholder="Search transactions by reference, party or property..."
      onExport={handleExport}
      columns={columns}
    />
  )
}
