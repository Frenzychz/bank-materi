import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { settingsService } from '../../services/settings.service'
import type { CountdownConfig } from '../../config/countdown'
import { DEFAULT_COUNTDOWN_CONFIG } from '../../config/countdown'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // State untuk pengaturan hitung mundur
  const [countdownConfig, setCountdownConfig] = useState<CountdownConfig>(DEFAULT_COUNTDOWN_CONFIG)
  const [isSavingCountdown, setIsSavingCountdown] = useState(false)
  const [countdownMessage, setCountdownMessage] = useState<string | null>(null)

  useEffect(() => {
    settingsService.getCountdownConfig().then((cfg) => {
      setCountdownConfig(cfg)
    })
  }, [])

  const handleSaveCountdown = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingCountdown(true)
    setCountdownMessage(null)
    try {
      await settingsService.saveCountdownConfig(countdownConfig)
      setCountdownMessage('✅ Tanggal hitung mundur berhasil diperbarui!')
      setTimeout(() => setCountdownMessage(null), 4000)
    } catch {
      setCountdownMessage('❌ Gagal menyimpan perubahan.')
    } finally {
      setIsSavingCountdown(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  // Tampilkan username atau email
  const displayIdentifier = user?.email?.replace('@admin.com', '') || 'Admin'

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-800">
      
      {/* 1. Header Khusus Admin */}
      <header className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">⚙️</span>
            <div>
              <h1 className="font-extrabold text-sm sm:text-base leading-none text-white">
                Admin Panel
              </h1>
              <p className="text-2xs text-slate-400 mt-0.5">
                Bank Materi dan Latsol TKA & SNBT
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:flex flex-col items-end text-xs">
              <span className="text-slate-400">Masuk sebagai:</span>
              <span className="font-bold text-blue-400">{displayIdentifier}</span>
            </div>

            <Link
              to="/"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              Lihat Web Publik ↗
            </Link>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition-colors"
            >
              Keluar
            </button>
          </div>
        </div>
      </header>

      {/* 2. Konten Utama Dashboard */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 w-full space-y-8">
        
        {/* Banner Selamat Datang */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <span>●</span>
            <span>Database Cloud Aktif</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Selamat Datang, {displayIdentifier}! 👋
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Ini adalah pusat kendali kurikulum. Pilih salah satu jalur di bawah untuk mulai mengelola mata pelajaran, bab materi, atau mengunggah modul latihan baru.
          </p>
        </div>

        {/* 3. TIGA MENU TINGKAT ATAS [TKA] [SNBT] [SETTINGS] */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* KARTU 1: TKA */}
          <Link
            to="/admin/tka"
            className="group bg-white border-2 border-slate-200 hover:border-blue-600 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                TKA
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Kelola Materi TKA
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kelola Fundamental TKA, Matematika, Bahasa Indonesia, Fisika, Kimia, Biologi, dan Matematika Lanjut.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
              <span>Buka Menu TKA</span>
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

          {/* KARTU 2: SNBT */}
          <Link
            to="/admin/snbt"
            className="group bg-white border-2 border-slate-200 hover:border-indigo-600 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                SNBT
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                Kelola Materi SNBT
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kelola Fundamental SNBT, Penalaran Umum, PPU, PBM, Pengetahuan Kuantitatif, dan Literasi Bahasa.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
              <span>Buka Menu SNBT</span>
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

          {/* KARTU 3: SETTINGS */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between opacity-90">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xl">
                ⚙️
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Pengaturan Sistem
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Informasi keamanan, koneksi Supabase Storage (PDF maks 50 MB), dan hak akses pengelola.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 text-2xs text-slate-400 font-semibold">
              Versi 1.0 (Akun Utama)
            </div>
          </div>

        </div>

        {/* 4. FORM PENGATURAN TANGGAL UJIAN (COUNTDOWN) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">⏳</span>
                <h3 className="text-lg font-bold text-slate-900">
                  Pengaturan Tanggal Hitung Mundur (TKA & UTBK)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Ubah tanggal dan judul target ujian yang tampil pada banner hitung mundur di halaman beranda publik.
              </p>
            </div>

            {countdownMessage && (
              <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 animate-in fade-in">
                {countdownMessage}
              </span>
            )}
          </div>

          <form onSubmit={handleSaveCountdown} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Kolom 1: Jalur TKA */}
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-xs font-bold">
                    TKA
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    Target Tanggal Ujian TKA
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Label / Judul Kartu TKA
                    </label>
                    <input
                      type="text"
                      value={countdownConfig.tkaLabel}
                      onChange={(e) =>
                        setCountdownConfig((prev) => ({ ...prev, tkaLabel: e.target.value }))
                      }
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      placeholder="Contoh: TKA 2026"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tanggal & Jam Pelaksanaan TKA
                    </label>
                    <input
                      type="datetime-local"
                      value={countdownConfig.tkaDate.slice(0, 16)}
                      onChange={(e) =>
                        setCountdownConfig((prev) => ({
                          ...prev,
                          tkaDate: e.target.value ? `${e.target.value}:00` : prev.tkaDate,
                        }))
                      }
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Kolom 2: Jalur UTBK */}
              <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-indigo-600 text-white text-xs font-bold">
                    SNBT
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    Target Tanggal UTBK-SNBT
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Label / Judul Kartu UTBK
                    </label>
                    <input
                      type="text"
                      value={countdownConfig.utbkLabel}
                      onChange={(e) =>
                        setCountdownConfig((prev) => ({ ...prev, utbkLabel: e.target.value }))
                      }
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      placeholder="Contoh: UTBK-SNBT 2027"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tanggal & Jam Pelaksanaan UTBK
                    </label>
                    <input
                      type="datetime-local"
                      value={countdownConfig.utbkDate.slice(0, 16)}
                      onChange={(e) =>
                        setCountdownConfig((prev) => ({
                          ...prev,
                          utbkDate: e.target.value ? `${e.target.value}:00` : prev.utbkDate,
                        }))
                      }
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSavingCountdown}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-bold transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <span>{isSavingCountdown ? 'Menyimpan...' : '💾 Simpan Perubahan Tanggal'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Ringkasan Statistik Singkat */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">230</div>
            <div className="text-2xs sm:text-xs text-slate-500 font-semibold mt-0.5">Total Bab & Materi</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-blue-600">1.014</div>
            <div className="text-2xs sm:text-xs text-slate-500 font-semibold mt-0.5">Modul & Video Live</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-emerald-600">100%</div>
            <div className="text-2xs sm:text-xs text-slate-500 font-semibold mt-0.5">Cloud Database</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-indigo-600">50 MB</div>
            <div className="text-2xs sm:text-xs text-slate-500 font-semibold mt-0.5">Batas File PDF</div>
          </div>
        </div>

      </main>
    </div>
  )
}