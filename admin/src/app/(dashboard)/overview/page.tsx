import StatsGrid from './components/StatsGrid'
import RevenueChart from './components/RevenueChart'
import UserGrowthChart from './components/UserGrowthChart'
import TopPerformingProperties from './components/TopPerformingProperties'
import SystemHealth from './components/SystemHealth'
import RecentActivityFeed from './components/RecentActivityFeed'
import QuickActions from './components/QuickActions'
import { LiveMetricsProvider } from '@/contexts/LiveMetricsContext'

export default function OverviewPage() {
  return (
    <LiveMetricsProvider>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-600">Welcome to the HomePulse admin dashboard.</p>
        </div>
        <StatsGrid />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart />
          <UserGrowthChart />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopPerformingProperties />
          <SystemHealth />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivityFeed />
          <QuickActions />
        </div>
      </div>
    </LiveMetricsProvider>
  )
}
