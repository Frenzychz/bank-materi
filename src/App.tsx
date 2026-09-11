import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PublicLayout from './components/layout/PublicLayout'
import HomePage from './pages/public/HomePage'
import SectionPage from './pages/public/SectionPage'
import SearchResultPage from './pages/public/SearchResultPage'
import NodePage from './pages/public/NodePage'
import LoginPage from './pages/admin/LoginPage'
import DashboardPage from './pages/admin/DashboardPage'
import SectionAdminPage from './pages/admin/SectionAdminPage'
import NodeAdminPage from './pages/admin/NodeAdminPage'
import AdminProtectedRoute from './routes/AdminProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. RUTE HALAMAN PUBLIK (Bisa diakses siapa saja tanpa login) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/tka" element={<SectionPage />} />
          <Route path="/tka/search" element={<SearchResultPage />} />
          <Route path="/tka/:nodeId" element={<NodePage />} />
          <Route path="/snbt" element={<SectionPage />} />
          <Route path="/snbt/search" element={<SearchResultPage />} />
          <Route path="/snbt/:nodeId" element={<NodePage />} />
        </Route>

        {/* 2. RUTE LOGIN ADMIN */}
        <Route path="/admin/login" element={<LoginPage />} />

        {/* 3. RUTE BENTENG ADMIN (Wajib login, dijaga oleh AdminProtectedRoute) */}
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin" element={<DashboardPage />} />
          <Route path="/admin/tka" element={<SectionAdminPage />} />
          <Route path="/admin/snbt" element={<SectionAdminPage />} />
          <Route path="/admin/nodes/:nodeId" element={<NodeAdminPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}