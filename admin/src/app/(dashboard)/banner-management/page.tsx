import { AdminHeader } from '@/components/ui/AdminHeader'
import BannerAnalytics from './components/BannerAnalytics'
import BannerList from './components/BannerList'
import BannerCreator from './components/BannerCreator'
import BannerTemplates from './components/BannerTemplates'
import BannerPerformance from './components/BannerPerformance'
import BannerPlacementManager from './components/BannerPlacementManager'
import BannerScheduler from './components/BannerScheduler'
import BannerABTesting from './components/BannerABTesting'

export default function BannerManagementPage() {
  return (
    <div className="space-y-6">
      <AdminHeader
        title="Banner Management"
        description="Create, schedule and optimize promotional banners."
      />
      <BannerAnalytics />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BannerCreator />
        <div className="space-y-6">
          <BannerPlacementManager />
          <BannerScheduler />
        </div>
        <BannerTemplates />
        <BannerABTesting />
        <div className="lg:col-span-2">
          <BannerPerformance />
        </div>
      </div>
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="text-lg font-semibold text-slate-900">All Banners</h3>
        </div>
        <div className="admin-card-body p-0">
          <BannerList />
        </div>
      </div>
    </div>
  )
}