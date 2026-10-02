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
    <header className="sticky top-0 z-50 bg-black/85 backdrop-blur-md border-b border-neutral-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Bagian Judul Website / Brand */}
          <Link to="/" className="flex flex-col group">
            <span className="font-extrabold text-white text-base sm:text-lg group-hover:text-neutral-300 transition-colors tracking-tight">
              Bank Materi & Latsol
            </span>
            <span className="text-2xs text-neutral-400 font-mono tracking-wider">
              TKA & SNBT BY FRENZYCH
            </span>
          </Link>

          {/* Menu Navigasi Desktop (tampil di laptop/komputer) */}
          <nav className="hidden md:flex items-center space-x-1 sm:space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-neutral-800 text-white font-semibold shadow-xs'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Tombol Cepat Cari Materi (Kontekstual sesuai jalur) */}
            {isTka && (
              <Link
                to="/tka/search"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg transition-colors ml-1"
                title="Pencarian Materi TKA"
              >
                <span>🔍</span>
                <span>Cari TKA</span>
              </Link>
            )}

            {isSnbt && (
              <Link
                to="/snbt/search"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg transition-colors ml-1"
                title="Pencarian Materi SNBT"
              >
                <span>🔍</span>
                <span>Cari SNBT</span>
              </Link>
            )}

            <div className="h-4 w-px bg-neutral-800 mx-2" />

            {/* Tombol Akses Admin */}
            <Link
              to="/admin/login"
              className="px-3 py-1.5 text-xs font-semibold text-neutral-400 hover:text-white hover:bg-neutral-900 border border-transparent hover:border-neutral-800 rounded-lg transition-colors"
            >
              Masuk Admin
            </Link>
          </nav>

          {/* Tombol Hamburger Menu (khusus layar HP) */}
          <div className="md:hidden flex items-center gap-1">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 focus:outline-hidden border border-neutral-800"
              aria-label="Toggle menu"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        <div className="md:hidden border-t border-neutral-800 bg-black px-4 pt-3 pb-4 space-y-1.5">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                isActive(link.path)
                  ? 'bg-neutral-800 text-white font-semibold'
                  : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}

          {isTka && (
            <Link
              to="/tka/search"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-neutral-200 bg-neutral-900 border border-neutral-800"
            >
              <span>🔍</span>
              <span>Pencarian Materi TKA</span>
            </Link>
          )}

          {isSnbt && (
            <Link
              to="/snbt/search"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-neutral-200 bg-neutral-900 border border-neutral-800"
            >
              <span>🔍</span>
              <span>Pencarian Materi SNBT</span>
            </Link>
          )}

          <div className="pt-2 border-t border-neutral-800">
            <Link
              to="/admin/login"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 text-sm text-neutral-400 hover:text-white"
            >
              Masuk Admin
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}