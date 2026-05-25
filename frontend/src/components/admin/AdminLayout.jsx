import { Outlet } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-slate-950 font-sans">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
