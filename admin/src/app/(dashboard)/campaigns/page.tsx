import { AdminHeader } from '@/components/ui/AdminHeader'
import CampaignAnalytics from './components/CampaignAnalytics'
import CampaignFilters from './components/CampaignFilters'
import CampaignList from './components/CampaignList'
import CampaignResolution from './components/CampaignResolution'
import CampaignResolutionModal from './components/CampaignResolutionModal'

export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <AdminHeader
        title="Campaigns"
        description="Manage marketing campaigns, budgets and compliance."
        actions={<CampaignResolutionModal />}
      />
      <CampaignAnalytics />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CampaignResolution />
      </div>
      <div className="admin-card">
        <div className="admin-card-header">
          <CampaignFilters />
        </div>
        <div className="admin-card-body p-0">
          <CampaignList />
        </div>
      </div>
    </div>
  )
}