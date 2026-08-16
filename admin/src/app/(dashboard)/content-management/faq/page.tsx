import { AdminHeader } from '@/components/ui/AdminHeader'
import FAQCategories from './components/FAQCategories'
import FAQManager from './components/FAQManager'
import FAQOrdering from './components/FAQOrdering'

export default function FAQPage() {
  return (
    <div className="space-y-6">
      <AdminHeader
        title="FAQ"
        description="Manage help center questions and answers."
        breadcrumbs={[{ label: 'Content', href: '/content-management' }, { label: 'FAQ' }]}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FAQManager />
        </div>
        <div className="space-y-6">
          <FAQCategories />
          <FAQOrdering />
        </div>
      </div>
    </div>
  )
}