'use client'

import { SectionCard } from '@/components/features/SectionCard'
import { CommandDataTable } from '@/components/ui/CommandDataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'
import type { ColumnDef } from '@tanstack/react-table'

const commissions = [
  { agent: 'Mary Wanjiku', properties: 24, total: 48200, rate: '5%', status: 'paid' },
  { agent: 'John Mwangi', properties: 18, total: 36100, rate: '4.5%', status: 'pending' },
  { agent: 'Amina Hassan', properties: 31, total: 52900, rate: '5%', status: 'paid' },
  { agent: 'Peter Otieno', properties: 12, total: 22800, rate: '4%', status: 'pending' },
  { agent: 'Faith Nyambura', properties: 9, total: 17400, rate: '4.5%', status: 'paid' },
  { agent: 'Samuel Kipchoge', properties: 27, total: 44500, rate: '5%', status: 'paid' },
  { agent: 'Linda Achieng', properties: 15, total: 28900, rate: '4.5%', status: 'pending' },
  { agent: 'George Njoroge', properties: 21, total: 38200, rate: '4%', status: 'paid' },
]

export default function CommissionTracker() {
  const handleExport = () => {
    const headers = ['Agent', 'Properties', 'Commission', 'Rate', 'Status'].join(',')
    const rows = commissions.map((c) => [
      `"${c.agent}"`,
      c.properties,
      c.total,
      `"${c.rate}"`,
      `"${c.status}"`,
    ].join(','))
    const csv = [headers, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `commission-tracker-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const columns: ColumnDef<typeof commissions[0]>[] = [
    {
      id: 'agent',
      header: 'Agent',
      accessorKey: 'agent',
      size: 180,
      cell: (info) => <span className="font-medium text-slate-100">{info.row.original.agent}</span>,
    },
    {
      id: 'properties',
      header: 'Properties',
      accessorKey: 'properties',
      size: 100,
    },
    {
      id: 'commission',
      header: 'Commission',
      accessorKey: 'total',
      size: 120,
      cell: (info) => <span className="font-mono text-sm text-command-emerald">${info.row.original.total.toLocaleString()}</span>,
    },
    {
      id: 'rate',
      header: 'Rate',
      accessorKey: 'rate',
      size: 80,
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      size: 100,
      cell: (info) => (
        <StatusBadge variant={info.row.original.status === 'paid' ? 'success' : 'warning'} label={info.row.original.status} />
      ),
    },
  ]

  return (
    <SectionCard title="Commission Tracker" description="Agent commissions earned this period">
      <CommandDataTable<typeof commissions[0]>
        data={commissions}
        searchPlaceholder="Search agents..."
        columns={columns}
        onExport={handleExport}
      />
    </SectionCard>
  )
}
