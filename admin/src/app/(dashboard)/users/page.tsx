export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
        <p className="text-slate-600">Manage and monitor all users on the platform.</p>
      </div>
      <div className="admin-card">
        <div className="admin-card-header flex items-center justify-between">
          <h2 className="text-lg font-semibold">All Users</h2>
          <button className="admin-btn-primary">Add User</button>
        </div>
        <div className="admin-card-body">
          <p className="text-slate-500">User table will be rendered here.</p>
        </div>
      </div>
    </div>
  )
}
