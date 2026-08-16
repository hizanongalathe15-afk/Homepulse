import { AdminHeader } from '@/components/ui/AdminHeader'
import ReportAnalytics from './components/ReportAnalytics'
import ReportBuilder from './components/ReportBuilder'
import ReportTemplates from './components/ReportTemplates'
import ReportExporter from './components/ReportExporter'
import ReportScheduler from './components/ReportScheduler'
import CustomMetricsBuilder from './components/CustomMetricsBuilder'

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <AdminHeader title="Reports" description="Build, schedule, share and download platform reports." />
      <ReportAnalytics />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportBuilder />
        <div className="space-y-6">
          <ReportTemplates />
          <CustomMetricsBuilder />
        </div>
        <ReportScheduler />
        <ReportExporter />
      </div>
    </div>
  )
}