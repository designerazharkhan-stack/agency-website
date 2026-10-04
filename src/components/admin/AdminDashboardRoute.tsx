import { AdminLayout } from '@/components/admin/AdminLayout'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'

export default function AdminDashboardRoute() {
  return (
    <ProtectedRoute>
      <AdminLayout />
    </ProtectedRoute>
  )
}
