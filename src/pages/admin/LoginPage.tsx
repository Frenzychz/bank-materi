import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!identifier.trim() || !password) {
      setErrorMsg('Harap isi username dan password!')
      return
    }

    try {
      setIsSubmitting(true)
      await login(identifier, password)
      // Jika berhasil login, langsung arahkan ke Dashboard Admin
      navigate('/admin')
    } catch {
      setErrorMsg('Username atau password salah. Silakan periksa kembali!')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white text-xl shadow-xs">
          🔐
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Masuk Panel Admin
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Bank Materi dan Latsol TKA & SNBT by frenzych
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl sm:px-10 space-y-6">
          
          {/* Pesan Error jika login gagal */}
          {errorMsg && (
            <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-2">
              <span className="text-base leading-none">⚠️</span>
              <p className="leading-snug">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Input Username atau Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Username atau Email
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Masukkan username kamu..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                disabled={isSubmitting}
                autoFocus
              />
            </div>

            {/* Input Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all pr-10"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 text-xs font-medium"
                >
                  {showPassword ? 'Tutup' : 'Lihat'}
                </button>
              </div>
            </div>

            {/* Tombol Submit Masuk */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Memverifikasi Akun...</span>
                </>
              ) : (
                <span>Masuk Sekarang →</span>
              )}
            </button>
          </form>

          {/* Tombol Kembali ke Beranda */}
          <div className="pt-4 border-t border-slate-100 text-center">
            <Link
              to="/"
              className="text-xs text-slate-500 hover:text-blue-600 font-semibold transition-colors"
            >
              ← Kembali ke Halaman Publik
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}