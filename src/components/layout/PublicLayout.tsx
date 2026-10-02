import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import PwaInstallPrompt from '../shared/PwaInstallPrompt'

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-neutral-100 selection:bg-neutral-800">
      {/* Menu atas */}
      <Navbar />

      {/* Konten halaman yang sedang dibuka akan tampil di sini */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Bagian bawah */}
      <Footer />

      {/* Banner PWA Mobile Install */}
      <PwaInstallPrompt />
    </div>
  )
}