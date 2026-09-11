import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Menu atas */}
      <Navbar />

      {/* Konten halaman yang sedang dibuka akan tampil di sini */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Bagian bawah */}
      <Footer />
    </div>
  )
}