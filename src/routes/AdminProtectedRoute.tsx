import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import LoadingState from '../components/shared/LoadingState'

export default function AdminProtectedRoute() {
  const { isAuthenticated, loading } = useAuth()

  // 1. Jika sistem masih mengecek status sesi login, tampilkan animasi loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingState message="Memeriksa izin akses admin..." />
      </div>
    )
  }

  // 2. Jika belum login, tendang langsung ke halaman /admin/login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  // 3. Jika sudah resmi login, izinkan masuk ke halaman admin!
  return <Outlet />
}