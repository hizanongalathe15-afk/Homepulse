import { AdminHeader } from '@/components/ui/AdminHeader'
import VerificationStats from './components/VerificationStats'
import VerificationQueue from './components/VerificationQueue'

export default function VerificationsPage() {
  return (
    <div className="space-y-6">
      <AdminHeader
        title="Verifications"
        description="Process identity, document and background verification requests."
      />
      <VerificationStats />
      <VerificationQueue />
    </div>
  )
}