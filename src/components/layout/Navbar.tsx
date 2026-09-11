import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

export default function Navbar() {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  // Fungsi pembantu untuk menandai menu mana yang sedang aktif
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true
    if (path !== '/' && location.pathname.startsWith(path)) return true
    return false
  }

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'TKA', path: '/tka' },
    { name: 'SNBT', path: '/snbt' },
  ]

  const isTka = location.pathname.startsWith('/tka')
  const isSnbt = location.pathname.startsWith('/snbt')

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Bagian Judul Website / Brand */}
          <Link to="/" className="flex flex-col group">
            <span className="font-bold text-slate-900 text-base sm:text-lg group-hover:text-blue-600 transition-colors">
              Bank Materi & Latsol
            </span>
            <span className="text-xs text-slate-500 font-medium tracking-wide">
              TKA & SNBT by frenzych
            </span>
          </Link>

          {/* Menu Navigasi Desktop (tampil di laptop/komputer) */}
          <nav className="hidden md:flex items-center space-x-1 sm:space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Tombol Cepat Cari Materi (Kontekstual sesuai jalur) */}
            {isTka && (
              <Link
                to="/tka/search"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-blue-700 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-lg transition-colors ml-1"
                title="Pencarian Materi TKA"
              >
                <span>🔍</span>
                <span>Cari TKA</span>
              </Link>
            )}

            {isSnbt && (
              <Link
                to="/snbt/search"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-700 bg-slate-50 hover:bg-indigo-50 border border-slate-200 rounded-lg transition-colors ml-1"
                title="Pencarian Materi SNBT"
              >
                <span>🔍</span>
                <span>Cari SNBT</span>
              </Link>
            )}

            <div className="h-4 w-px bg-slate-200 mx-2" />

            {/* Tombol Akses Admin */}
            <Link
              to="/admin/login"
              className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-blue-700 hover:bg-slate-100 rounded-md transition-colors"
            >
              Masuk Admin
            </Link>
          </nav>

          {/* Tombol Hamburger Menu (khusus layar HP) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menu Dropdown untuk Layar HP (Mobile) */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive(link.path)
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
              }`}
            >
              {link.name}
            </Link>
          ))}

          {isTka && (
            <Link
              to="/tka/search"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-semibold text-blue-700 bg-blue-50"
            >
              <span>🔍</span>
              <span>Pencarian Materi TKA</span>
            </Link>
          )}

          {isSnbt && (
            <Link
              to="/snbt/search"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-semibold text-indigo-700 bg-indigo-50"
            >
              <span>🔍</span>
              <span>Pencarian Materi SNBT</span>
            </Link>
          )}

          <div className="pt-2 border-t border-slate-100">
            <Link
              to="/admin/login"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 text-sm text-slate-500 hover:text-blue-600"
            >
              Masuk Admin
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}