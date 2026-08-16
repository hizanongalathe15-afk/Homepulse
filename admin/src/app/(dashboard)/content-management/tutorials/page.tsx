import { AdminHeader } from '@/components/ui/AdminHeader'
import TutorialCreator from './components/TutorialCreator'
import TutorialCategories from './components/TutorialCategories'
import TutorialList from './components/TutorialList'

export default function TutorialsPage() {
  return (
    <div className="space-y-6">
      <AdminHeader
        title="Tutorials"
        description="Create and manage step-by-step video guides."
        breadcrumbs={[{ label: 'Content', href: '/content-management' }, { label: 'Tutorials' }]}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TutorialCreator />
        <div className="lg:col-span-2">
          <TutorialList />
        </div>
      </div>
      <TutorialCategories />
    </div>
  )
}