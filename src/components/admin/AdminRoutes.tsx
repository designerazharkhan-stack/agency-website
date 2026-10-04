import { Outlet } from 'react-router-dom'

import { AuthProvider } from '@/context/AuthContext'

export default function AdminRoutes() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  )
}
