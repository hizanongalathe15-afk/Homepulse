import { AdminHeader } from '@/components/ui/AdminHeader'
import CategoryManager from './components/CategoryManager'
import SubcategoryManager from './components/SubcategoryManager'
import AttributeManager from './components/AttributeManager'

export default function PropertyCategoriesPage() {
  return (
    <div className="space-y-6">
      <AdminHeader
        title="Property Categories"
        description="Manage property categories, subcategories and custom attributes."
        breadcrumbs={[{ label: 'Properties', href: '/properties' }, { label: 'Categories' }]}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryManager />
        <SubcategoryManager />
        <div className="lg:col-span-2">
          <AttributeManager />
        </div>
      </div>
    </div>
  )
}