'use client'

import { Mail, Send, Eye } from 'lucide-react'
import { StatCard } from '@/components/features/StatCard'
import { SectionCard } from '@/components/features/SectionCard'
import { AdminInput } from '@/components/ui/AdminInput'
import { AdminButton } from '@/components/ui/AdminButton'
import { DataTable } from '@/components/ui/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'

const stats = [
  { label: 'Emails Sent', value: '84,210', trend: 'up', trendValue: '5.4%', icon: Send, sub: '30 days' },
  { label: 'Open Rate', value: '62%', trend: 'up', trendValue: '3%', icon: Eye, sub: 'average' },
  { label: 'Bounces', value: '1.2%', trend: 'down', trendValue: '0.3%', icon: Mail, sub: 'hard bounces' },
]

interface Template {
  id: string
  name: string
  subject: string
  category: string
  lastEdited: string
  status: string
}

const templates: Template[] = [
  { id: '1', name: 'Welcome Email', subject: 'Welcome to Homepulse!', category: 'Onboarding', lastEdited: '2026-08-12', status: 'active' },
  { id: '2', name: 'Payment Receipt', subject: 'Your payment receipt', category: 'Billing', lastEdited: '2026-08-10', status: 'active' },
  { id: '3', name: 'Listing Approved', subject: 'Your listing has been approved', category: 'Property', lastEdited: '2026-08-08', status: 'active' },
  { id: '4', name: 'Password Reset', subject: 'Reset your password', category: 'Security', lastEdited: '2026-07-30', status: 'active' },
  { id: '5', name: 'Subscription Renewal', subject: 'Your subscription is renewing', category: 'Billing', lastEdited: '2026-07-22', status: 'draft' },
]

export default function EmailTemplates() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
      <SectionCard title="Email Templates" description="Manage transactional and marketing email templates.">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <AdminInput placeholder="Search templates..." className="max-w-sm" />
            <AdminButton type="button">Create Template</AdminButton>
          </div>
          <DataTable<Template>
            data={templates}
            searchPlaceholder="Search templates..."
            columns={[
              { key: 'name', header: 'Template', sortable: true, render: (t) => <span className="font-medium text-slate-900">{t.name}</span> },
              { key: 'subject', header: 'Subject', render: (t) => <span className="text-slate-600">{t.subject}</span> },
              { key: 'category', header: 'Category' },
              {
                key: 'status',
                header: 'Status',
                render: (t) => <StatusBadge variant={t.status === 'active' ? 'success' : 'warning'} label={t.status} />,
              },
              { key: 'lastEdited', header: 'Last Edited', sortable: true },
              {
                key: 'actions',
                header: '',
                render: () => (
                  <button type="button" className="text-sm text-primary hover:underline">Edit</button>
                ),
              },
            ]}
          />
        </div>
      </SectionCard>
    </div>
  )
}
