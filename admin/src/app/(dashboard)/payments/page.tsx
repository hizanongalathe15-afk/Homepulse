import { AdminHeader } from '@/components/ui/AdminHeader'
import PaymentAnalytics from './components/PaymentAnalytics'
import PaymentTable from './components/PaymentTable'
import PaymentFilters from './components/PaymentFilters'
import PaymentReconciliation from './components/PaymentReconciliation'
import MpesaTransactions from './components/MpesaTransactions'
import StripeTransactions from './components/StripeTransactions'

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <AdminHeader
        title="Payments"
        description="Monitor transactions, process refunds and reconcile payments."
      />
      <PaymentAnalytics />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MpesaTransactions />
        <StripeTransactions />
        <div className="lg:col-span-2">
          <PaymentReconciliation />
        </div>
      </div>
      <div className="admin-card">
        <div className="admin-card-header">
          <PaymentFilters />
        </div>
        <div className="admin-card-body p-0">
          <PaymentTable />
        </div>
      </div>
    </div>
  )
}