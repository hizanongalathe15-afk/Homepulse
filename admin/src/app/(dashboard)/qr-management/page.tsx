import { AdminHeader } from '@/components/ui/AdminHeader'
import QRAnalytics from './components/QRAnalytics'
import QRList from './components/QRList'
import QRGenerator from './components/QRGenerator'
import QRBulkGenerator from './components/QRBulkGenerator'
import QRScanner from './components/QRScanner'
import QRCampaigns from './components/QRCampaigns'
import QRExpiryManager from './components/QRExpiryManager'

export default function QRManagementPage() {
  return (
    <div className="space-y-6">
      <AdminHeader
        title="QR Management"
        description="Generate, scan, print and manage QR codes across properties and campaigns."
      />
      <QRAnalytics />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QRGenerator />
        <QRScanner />
        <QRBulkGenerator />
        <QRExpiryManager />
      </div>
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="text-lg font-semibold text-slate-900">All QR Codes</h3>
        </div>
        <div className="admin-card-body p-0">
          <QRList />
        </div>
      </div>
      <QRCampaigns />
    </div>
  )
}