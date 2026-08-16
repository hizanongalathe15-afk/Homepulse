import { AdminHeader } from '@/components/ui/AdminHeader'

import UserMetrics from './components/user-analytics/UserMetrics'
import DemographicsChart from './components/user-analytics/DemographicsChart'
import UserRetentionChart from './components/user-analytics/UserRetentionChart'
import UserSegmentation from './components/user-analytics/UserSegmentation'
import UserJourneyMap from './components/user-analytics/UserJourneyMap'

import PropertyMetrics from './components/property-analytics/PropertyMetrics'
import PriceTrends from './components/property-analytics/PriceTrends'
import OccupancyRates from './components/property-analytics/OccupancyRates'
import CityHeatmap from './components/property-analytics/CityHeatmap'
import NeighborhoodAnalytics from './components/property-analytics/NeighborhoodAnalytics'

import RevenueChart from './components/revenue-analytics/RevenueChart'
import RevenueByCity from './components/revenue-analytics/RevenueByCity'
import PaymentMethodBreakdown from './components/revenue-analytics/PaymentMethodBreakdown'
import CommissionTracker from './components/revenue-analytics/CommissionTracker'
import RevenueForecast from './components/revenue-analytics/RevenueForecast'

import CampaignMetrics from './components/campaign-analytics/CampaignMetrics'
import CampaignSuccessRate from './components/campaign-analytics/CampaignSuccessRate'
import TrendingCampaigns from './components/campaign-analytics/TrendingCampaigns'

import QRScanMetrics from './components/qr-analytics/QRScanMetrics'
import QRPerformance from './components/qr-analytics/QRPerformance'
import QRConversionRate from './components/qr-analytics/QRConversionRate'
import QRScanHeatmap from './components/qr-analytics/QRScanHeatmap'

import IncidentMetrics from './components/safety-analytics/IncidentMetrics'
import SOSAlertTrends from './components/safety-analytics/SOSAlertTrends'
import SafetyScoreTrends from './components/safety-analytics/SafetyScoreTrends'

import { LiveMetricsProvider } from '@/contexts/LiveMetricsContext'

function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      <p className="text-sm text-slate-500">{subtitle}</p>
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <LiveMetricsProvider>
      <div className="space-y-8">
        <AdminHeader
          title="Analytics Suite"
          description="Track platform performance across users, properties, revenue, campaigns, QR codes and safety."
        />

        <section className="space-y-4">
          <SectionHeading title="User Analytics" subtitle="Growth, retention and segment insights" />
          <UserMetrics />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <DemographicsChart />
            <UserRetentionChart />
            <UserSegmentation />
            <UserJourneyMap />
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeading title="Property Analytics" subtitle="Listing, pricing and occupancy performance" />
          <PropertyMetrics />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <PriceTrends />
            <OccupancyRates />
            <CityHeatmap />
            <NeighborhoodAnalytics />
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeading title="Revenue Analytics" subtitle="Income streams, forecast and commissions" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <RevenueChart />
            <RevenueForecast />
            <RevenueByCity />
            <PaymentMethodBreakdown />
            <div className="lg:col-span-2">
              <CommissionTracker />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeading title="Campaign Analytics" subtitle="Marketing effectiveness and spend" />
          <CampaignMetrics />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CampaignSuccessRate />
            <TrendingCampaigns />
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeading title="QR Analytics" subtitle="QR code scans, conversions and activity" />
          <QRScanMetrics />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <QRPerformance />
            <QRConversionRate />
            <div className="lg:col-span-2">
              <QRScanHeatmap />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeading title="Safety Analytics" subtitle="SOS alerts, incidents and safety scores" />
          <IncidentMetrics />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SOSAlertTrends />
            <SafetyScoreTrends />
          </div>
        </section>
      </div>
    </LiveMetricsProvider>
  )
}
