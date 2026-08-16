'use client'

import { Plus, FileText, Users, Shield, BarChart3, Settings } from 'lucide-react'
import { SectionCard } from '@/components/features/SectionCard'
import { AdminButton } from '@/components/ui/AdminButton'

const actions = [
  { label: 'Add Property', icon: Plus, href: '/properties/new' },
  { label: 'Review Disputes', icon: Shield, href: '/disputes' },
  { label: 'Manage Users', icon: Users, href: '/users' },
  { label: 'View Reports', icon: BarChart3, href: '/reports' },
  { label: 'Content Moderation', icon: FileText, href: '/content' },
  { label: 'System Settings', icon: Settings, href: '/settings' },
]

export default function QuickActions() {
  return (
    <SectionCard title="Quick Actions" description="Frequently used admin tasks">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {actions.map((action) => (
          <AdminButton
            key={action.label}
            variant="outline"
            className="h-auto flex-col items-start gap-2 p-4 justify-start"
          >
            <action.icon size={20} className="text-primary" />
            <span className="text-sm font-medium text-slate-700">{action.label}</span>
          </AdminButton>
        ))}
      </div>
    </SectionCard>
  )
}
