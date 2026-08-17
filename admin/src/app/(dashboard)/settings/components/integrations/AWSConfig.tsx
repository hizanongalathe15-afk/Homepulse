'use client'

import { Cloud, type LucideIcon } from 'lucide-react'
import { StatCard } from '@/components/features/StatCard'
import { SectionCard } from '@/components/features/SectionCard'
import { AdminInput } from '@/components/ui/AdminInput'
import { AdminButton } from '@/components/ui/AdminButton'
import { Toggle } from '@/components/features/Toggle'
import { StatusBadge } from '@/components/ui/StatusBadge'

interface StatItem {
  label: string
  value: string
  trend: 'up' | 'down' | 'neutral'
  trendValue: string
  icon: LucideIcon
  sub: string
}

const stats: StatItem[] = [
  { label: 'Storage Used', value: '2.4 TB', trend: 'up', trendValue: '12%', icon: Cloud, sub: 'of 5 TB' },
  { label: 'Requests (24h)', value: '840K', trend: 'up', trendValue: '5%', icon: Cloud, sub: 'S3 + CloudFront' },
  { label: 'Errors', value: '0.02%', trend: 'neutral', trendValue: '0%', icon: Cloud, sub: 'availability' },
]

export default function AWSConfig() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
      <SectionCard title="AWS Configuration" description="Manage cloud storage and hosting credentials.">
        <div className="space-y-4">
          <AdminInput label="Access Key ID" defaultValue="AKIAIOSFODNN7..." />
          <AdminInput label="Secret Access Key" type="password" defaultValue="wJalrXUtnFEMI..." />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Region</label>
              <select className="admin-input">
                <option>us-east-1</option>
                <option>eu-west-1</option>
                <option>af-south-1</option>
              </select>
            </div>
            <AdminInput label="S3 Bucket" defaultValue="homepulse-assets" />
          </div>
          <AdminInput label="CloudFront Distribution ID" defaultValue="E1234567890ABC" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">Enable S3 Backups</p>
              <p className="text-xs text-slate-500">Automatically backup database to S3 daily</p>
            </div>
            <Toggle checked={true} onChange={() => {}} />
          </div>
          <div className="flex justify-end pt-2">
            <AdminButton type="button">Save AWS Settings</AdminButton>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}
