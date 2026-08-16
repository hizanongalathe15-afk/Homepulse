'use client'

import { Globe, Languages, CheckCircle2 } from 'lucide-react'
import { StatCard } from '@/components/features/StatCard'
import { SectionCard } from '@/components/features/SectionCard'
import { AdminInput } from '@/components/ui/AdminInput'
import { AdminButton } from '@/components/ui/AdminButton'
import { Toggle } from '@/components/features/Toggle'
import { StatusBadge } from '@/components/ui/StatusBadge'

const stats = [
  { label: 'Languages', value: '5', trend: 'up', trendValue: '1', icon: Languages, sub: 'supported' },
  { label: 'Translations', value: '2,840', trend: 'up', trendValue: '12%', icon: CheckCircle2, sub: 'completed' },
  { label: 'Coverage', value: '94%', trend: 'up', trendValue: '2%', icon: Globe, sub: 'keys translated' },
]

const languages = [
  { code: 'en', name: 'English', native: 'English', enabled: true, default: true },
  { code: 'sw', name: 'Swahili', native: 'Kiswahili', enabled: true, default: false },
  { code: 'fr', name: 'French', native: 'Français', enabled: true, default: false },
  { code: 'de', name: 'German', native: 'Deutsch', enabled: false, default: false },
  { code: 'ar', name: 'Arabic', native: 'العربية', enabled: false, default: false },
]

export default function LanguageSettings() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
      <SectionCard title="Language Settings" description="Configure supported languages and default locale.">
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead className="admin-table-header bg-slate-50">
                <tr>
                  <th className="admin-table-cell text-left font-medium text-slate-500">Language</th>
                  <th className="admin-table-cell text-left font-medium text-slate-500">Code</th>
                  <th className="admin-table-cell text-left font-medium text-slate-500">Native</th>
                  <th className="admin-table-cell text-left font-medium text-slate-500">Default</th>
                  <th className="admin-table-cell text-left font-medium text-slate-500">Enabled</th>
                </tr>
              </thead>
              <tbody className="admin-table-body">
                {languages.map((lang) => (
                  <tr key={lang.code} className="admin-table-row">
                    <td className="admin-table-cell text-slate-900">{lang.name}</td>
                    <td className="admin-table-cell text-slate-900">{lang.code}</td>
                    <td className="admin-table-cell text-slate-900">{lang.native}</td>
                    <td className="admin-table-cell">
                      {lang.default ? <StatusBadge variant="success" label="Default" /> : <span className="text-slate-400">—</span>}
                    </td>
                    <td className="admin-table-cell">
                      <Toggle checked={lang.enabled} onChange={() => {}} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end pt-2">
            <AdminButton type="button">Save Language Settings</AdminButton>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}
