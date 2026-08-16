'use client'

import { DataTable } from '@/components/ui/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { AdminButton } from '@/components/ui/AdminButton'

interface VerificationRequest {
  id: string
  applicant: string
  email: string
  type: 'identity' | 'document' | 'background'
  status: 'pending' | 'approved' | 'rejected'
  submitted: string
}

const requests: VerificationRequest[] = [
  { id: 'VRF-1001', applicant: 'Mary Wanjiku', email: 'mary.wanjiku@gmail.com', type: 'identity', status: 'pending', submitted: '2h ago' },
  { id: 'VRF-1002', applicant: 'John Mwangi', email: 'john.mwangi@yahoo.com', type: 'background', status: 'pending', submitted: '5h ago' },
  { id: 'VRF-1003', applicant: 'Amina Hassan', email: 'amina.hassan@gmail.com', type: 'document', status: 'approved', submitted: '1d ago' },
  { id: 'VRF-1004', applicant: 'Faith Nyambura', email: 'faith.nyambura@gmail.com', type: 'identity', status: 'pending', submitted: '1d ago' },
  { id: 'VRF-1005', applicant: 'Peter Otieno', email: 'peter.otieno@gmail.com', type: 'background', status: 'rejected', submitted: '3d ago' },
]

function statusVariant(status: VerificationRequest['status']) {
  switch (status) {
    case 'approved': return 'success'
    case 'rejected': return 'destructive'
    default: return 'warning'
  }
}

export default function VerificationQueue() {
  return (
    <DataTable<VerificationRequest>
      data={requests}
      searchPlaceholder="Search applicants..."
      columns={[
        {
          key: 'applicant',
          header: 'Applicant',
          render: (r) => (
            <div>
              <p className="font-medium text-slate-900">{r.applicant}</p>
              <p className="text-xs text-slate-500">{r.email}</p>
            </div>
          ),
        },
        { key: 'type', header: 'Type', render: (r) => <span className="capitalize">{r.type} check</span> },
        {
          key: 'status',
          header: 'Status',
          render: (r) => <StatusBadge variant={statusVariant(r.status)} label={r.status} />,
        },
        { key: 'submitted', header: 'Submitted', render: (r) => r.submitted },
        {
          key: 'actions',
          header: 'Actions',
          render: (r) =>
            r.status === 'pending' ? (
              <div className="flex gap-2">
                <AdminButton size="sm">Review</AdminButton>
                <AdminButton size="sm" variant="outline">Details</AdminButton>
              </div>
            ) : null,
        },
      ]}
    />
  )
}