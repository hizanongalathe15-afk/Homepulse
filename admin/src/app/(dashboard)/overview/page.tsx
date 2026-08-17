import { AntigravityScroll, AntigravityItem } from '@/components/features/AntigravityScroll'
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
      <AntigravityScroll className="space-y-6">
        <AntigravityItem delay={1}>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
            <p className="text-slate-600">Welcome to the HomePulse admin dashboard.</p>
          </div>
        </AntigravityItem>
        <AntigravityItem delay={1}>
          <StatsGrid />
        </AntigravityItem>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AntigravityItem delay={2} parallaxSpeed={0.03}>
            <RevenueChart />
          </AntigravityItem>
          <AntigravityItem delay={2} parallaxSpeed={0.05}>
            <UserGrowthChart />
          </AntigravityItem>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AntigravityItem delay={3} parallaxSpeed={0.04}>
            <TopPerformingProperties />
          </AntigravityItem>
          <AntigravityItem delay={3} parallaxSpeed={0.06}>
            <SystemHealth />
          </AntigravityItem>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AntigravityItem delay={3} parallaxSpeed={0.03}>
            <RecentActivityFeed />
          </AntigravityItem>
          <AntigravityItem delay={3} parallaxSpeed={0.05}>
            <QuickActions />
          </AntigravityItem>
        </div>
      </AntigravityScroll>
    </LiveMetricsProvider>
  )
}
