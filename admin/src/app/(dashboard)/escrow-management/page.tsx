import { AdminHeader } from '@/components/ui/AdminHeader'
import EscrowAnalytics from './components/EscrowAnalytics'
import EscrowOverview from './components/EscrowOverview'
import EscrowAutoRelease from './components/EscrowAutoRelease'
import EscrowDisputes from './components/EscrowDisputes'
import EscrowTransactions from './components/EscrowTransactions'

export default function EscrowManagementPage() {
  return (
    <div className="space-y-6">
      <AdminHeader
        title="Escrow Management"
        description="Monitor, release and audit funds held in escrow."
      />
      <EscrowAnalytics />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EscrowOverview />
        <EscrowDisputes />
        <EscrowAutoRelease />
      </div>
      <EscrowTransactions />
    </div>
  )
}
