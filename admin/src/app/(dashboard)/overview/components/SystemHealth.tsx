'use client'

import { Activity, Server, Database, Wifi, AlertCircle } from 'lucide-react'
import { SectionCard } from '@/components/features/SectionCard'
import { StatusBadge } from '@/components/ui/StatusBadge'

const services = [
  { name: 'API Gateway', status: 'Operational', latency: '24ms', icon: Server },
  { name: 'Database', status: 'Operational', latency: '12ms', icon: Database },
  { name: 'Auth Service', status: 'Operational', latency: '45ms', icon: Wifi },
  { name: 'Search Index', status: 'Degraded', latency: '210ms', icon: Activity },
  { name: 'Payment Processor', status: 'Operational', latency: '180ms', icon: Server },
]

function statusVariant(status: string) {
  switch (status) {
    case 'Operational': return 'success'
    case 'Degraded': return 'warning'
    case 'Down': return 'destructive'
    default: return 'default'
  }
}

export default function SystemHealth() {
  return (
    <SectionCard title="System Health" description="Real-time status of core services">
      <div className="divide-y divide-slate-100">
        {services.map((service) => (
          <div key={service.name} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <service.icon size={18} className="text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-800">{service.name}</p>
                <p className="text-xs text-slate-400">Latency: {service.latency}</p>
              </div>
            </div>
            <StatusBadge variant={statusVariant(service.status)} label={service.status} />
          </div>
        ))}
      </div>
      {services.some((s) => s.status !== 'Operational') && (
        <div className="mt-4 flex items-start gap-2 rounded-md bg-yellow-50 p-3 text-sm text-yellow-800">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>Search Index is experiencing degraded performance. Engineers are investigating.</span>
        </div>
      )}
    </SectionCard>
  )
}
