'use client'

import { SectionCard } from '@/components/features/SectionCard'
import { AdminInput } from '@/components/ui/AdminInput'
import { AdminButton } from '@/components/ui/AdminButton'
import { DataTable } from '@/components/ui/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Toggle } from '@/components/features/Toggle'

interface TranslationKey {
  id: string
  key: string
  en: string
  sw: string
  fr: string
  lastUpdated: string
  status: string
}

const translations: TranslationKey[] = [
  { id: '1', key: 'common.login', en: 'Login', sw: 'Ingia', fr: 'Connexion', lastUpdated: '2026-08-01', status: 'complete' },
  { id: '2', key: 'common.logout', en: 'Logout', sw: 'Ondoka', fr: 'Déconnexion', lastUpdated: '2026-08-01', status: 'complete' },
  { id: '3', key: 'property.list', en: 'Properties', sw: 'Mali', fr: 'Propriétés', lastUpdated: '2026-07-28', status: 'complete' },
  { id: '4', key: 'payment.confirm', en: 'Confirm Payment', sw: 'Thamini Malipo', fr: 'Confirmer le paiement', lastUpdated: '2026-07-25', status: 'incomplete' },
  { id: '5', key: 'dashboard.title', en: 'Dashboard', sw: 'Dashibodi', fr: 'Tableau de bord', lastUpdated: '2026-08-10', status: 'complete' },
]

export default function TranslationManager() {
  return (
    <SectionCard title="Translation Manager" description="Review and update translation keys across languages.">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <AdminInput placeholder="Search keys..." className="max-w-sm" />
            <select className="admin-input">
              <option>All Languages</option>
              <option>Missing Swahili</option>
              <option>Missing French</option>
            </select>
          </div>
          <AdminButton type="button">Export JSON</AdminButton>
        </div>
        <DataTable<TranslationKey>
          data={translations}
          searchPlaceholder="Search translations..."
          columns={[
            { key: 'key', header: 'Key', sortable: true },
            { key: 'en', header: 'English', render: (r) => <span className="text-slate-900">{r.en}</span> },
            { key: 'sw', header: 'Swahili', render: (r) => <span className={r.sw ? 'text-slate-900' : 'text-red-500'}>{r.sw || '—'}</span> },
            { key: 'fr', header: 'French', render: (r) => <span className={r.fr ? 'text-slate-900' : 'text-red-500'}>{r.fr || '—'}</span> },
            {
              key: 'status',
              header: 'Status',
              render: (r) => <StatusBadge variant={r.status === 'complete' ? 'success' : 'warning'} label={r.status} />,
            },
            {
              key: 'lastUpdated',
              header: 'Updated',
              sortable: true,
              render: (r) => <span className="text-slate-500">{r.lastUpdated}</span>,
            },
          ]}
        />
      </div>
    </SectionCard>
  )
}
