export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-600">Welcome to the HomePulse admin dashboard.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: '12,345' },
          { label: 'Total Properties', value: '8,901' },
          { label: 'Revenue (MTD)', value: '$45,678' },
          { label: 'Active Disputes', value: '23' },
        ].map((stat) => (
          <div key={stat.label} className="admin-card">
            <div className="admin-card-body">
              <p className="text-sm font-medium text-slate-600">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
