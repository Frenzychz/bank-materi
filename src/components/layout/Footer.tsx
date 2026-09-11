import { Link } from 'react-router-dom'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Kolom 1: Identitas & Deskripsi Singkat */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-base tracking-wide">
              Bank Materi dan Latsol TKA & SNBT
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Platform repositori materi pembelajaran dan latihan soal terstruktur untuk persiapan seleksi masuk Perguruan Tinggi Negeri (PTN).
            </p>
            <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800/50">
              Curated by frenzych
            </span>
          </div>

          {/* Kolom 2: Navigasi Cepat */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Navigasi Materi</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/tka" className="hover:text-blue-400 transition-colors">
                  Tes Kemampuan Akademik (TKA)
                </Link>
              </li>
              <li>
                <Link to="/snbt" className="hover:text-blue-400 transition-colors">
                  Seleksi Nasional Berdasarkan Tes (SNBT)
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-slate-300 text-slate-500 transition-colors">
                  Panel Khusus Pengelola
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Catatan Penggunaan */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Akses Terbuka</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Seluruh materi berstatus terbit dapat diakses langsung secara publik tanpa perlu membuat akun atau login.
            </p>
          </div>

        </div>

        {/* Baris Hak Cipta */}
        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <p>© {currentYear} Bank Materi TKA & SNBT by frenzych. Hak cipta materi milik penyusun dan kreator masing-masing.</p>
          <p className="mt-2 sm:mt-0 font-medium text-slate-400">Semangat Pejuang PTN! 🎓</p>
        </div>
      </div>
    </footer>
  )
}