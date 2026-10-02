import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Breadcrumb from '../../components/shared/Breadcrumb'
import SearchBar from '../../components/shared/SearchBar'
import LoadingState from '../../components/shared/LoadingState'
import { nodesService } from '../../services/nodes.service'
import type { Section, Node } from '../../types'
import { isTkaWajib, cleanDescription } from '../../types'

export default function SectionPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const currentSection: Section = location.pathname.startsWith('/tka') ? 'tka' : 'snbt'

  const [loading, setLoading] = useState(true)
  const [fundamentals, setFundamentals] = useState<Node[]>([])
  const [subjects, setSubjects] = useState<Node[]>([])

  useEffect(() => {
    async function loadSectionData() {
      setLoading(true)
      const sectionRootId = currentSection === 'tka' ? 'sec-tka' : 'sec-snbt'
      
      // Ambil data langsung dari Supabase melalui service
      const allNodes = await nodesService.getBySection(currentSection)

      // Pisahkan Fundamental dan Mata Pelajaran
      const funds = allNodes.filter(
        (n) => n.parent_id === sectionRootId && n.node_type === 'fundamental'
      )
      const subs = allNodes.filter(
        (n) => n.parent_id === sectionRootId && n.node_type === 'subject'
      )

      setFundamentals(funds)
      setSubjects(subs)
      setLoading(false)
    }

    loadSectionData()
  }, [currentSection])

  const sectionTitle =
    currentSection === 'tka'
      ? 'Tes Kemampuan Akademik (TKA)'
      : 'Seleksi Nasional Berdasarkan Tes (SNBT)'
      
  const sectionDesc =
    currentSection === 'tka'
      ? 'Pilih materi Fundamental atau mata pelajaran di bawah untuk mulai belajar.'
      : 'Pilih materi Fundamental atau subtes UTBK di bawah untuk mulai belajar.'

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <LoadingState message={`Memuat kurikulum ${currentSection.toUpperCase()} dari cloud...`} />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* 1. Navigasi Jejak (Breadcrumb) */}
      <Breadcrumb items={[{ label: currentSection.toUpperCase() }]} />

      {/* 2. Header Judul Section & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {sectionTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
            {sectionDesc}
          </p>
        </div>

        <div className="w-full md:w-80 shrink-0">
          <SearchBar
            placeholder={`Cari di ${currentSection.toUpperCase()}...`}
            onSearch={(q) => {
              if (q.trim()) {
                navigate(`/${currentSection}/search?q=${encodeURIComponent(q.trim())}`)
              }
            }}
          />
        </div>
      </div>

      {/* 3. MENU KHUSUS FUNDAMENTAL (Di bagian atas) */}
      {fundamentals.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 text-base">
              ⚡
            </span>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
              Materi Fundamental {currentSection.toUpperCase()}
            </h2>
            <span className="text-2xs px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-cyan-300 font-extrabold uppercase tracking-wider border border-blue-200 dark:border-cyan-400/30">
              Wajib Paham
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {fundamentals.map((fund) => (
              <Link
                key={fund.id}
                to={`/${currentSection}/${fund.id}`}
                className="group relative rounded-2xl p-5 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-cyan-400/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                    {fund.name}
                  </h3>
                  {fund.description && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {fund.description}
                    </p>
                  )}
                </div>
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-cyan-400">
                  <span>Buka Konsep Dasar</span>
                  <span className="group-hover:translate-x-1.5 transition-transform">→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 4. DAFTAR MATA PELAJARAN (TKA: DIPISAH WAJIB & PILIHAN, SNBT: SUBTES UTBK) */}
      {currentSection === 'tka' ? (
        <div className="space-y-10 pt-2">
          {/* A. SEKSI MATERI TKA WAJIB */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 text-base">
                  📘
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  Materi TKA Wajib
                </h2>
                <span className="text-2xs px-3 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-extrabold uppercase tracking-wider border border-blue-200 dark:border-blue-800">
                  Semua Jurusan
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Diujikan untuk seluruh peserta tes tanpa terkecuali
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {subjects
                .filter((sub) => isTkaWajib(sub))
                .map((sub) => (
                  <Link
                    key={sub.id}
                    to={`/${currentSection}/${sub.id}`}
                    className="group relative rounded-2xl p-6 bg-white dark:bg-slate-900/80 border-2 border-blue-100 dark:border-slate-800 hover:border-blue-500 dark:hover:border-cyan-400/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800 flex items-center justify-center font-black text-base group-hover:scale-110 transition-transform">
                          {sub.name.charAt(0)}
                        </div>
                        <span className="text-2xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          Wajib
                        </span>
                      </div>
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-base group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                        {sub.name}
                      </h3>
                      {sub.description && (
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                          {cleanDescription(sub.description)}
                        </p>
                      )}
                    </div>

                    <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-cyan-400">
                      <span>Lihat Bab & Materi</span>
                      <span className="group-hover:translate-x-1.5 transition-transform">→</span>
                    </div>
                  </Link>
                ))}
            </div>
          </section>

          {/* B. SEKSI MATERI TKA PILIHAN */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 text-base">
                  🧪
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  Materi TKA Pilihan
                </h2>
                <span className="text-2xs px-3 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold uppercase tracking-wider border border-slate-200 dark:border-slate-700">
                  Peminatan Jurusan
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pilih mata pelajaran sesuai prodi impianmu
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {subjects
                .filter((sub) => !isTkaWajib(sub))
                .map((sub) => (
                  <Link
                    key={sub.id}
                    to={`/${currentSection}/${sub.id}`}
                    className="group relative rounded-2xl p-6 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-black text-base group-hover:scale-110 transition-transform">
                          {sub.name.charAt(0)}
                        </div>
                        <span className="text-2xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          Pilihan
                        </span>
                      </div>
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {sub.name}
                      </h3>
                      {sub.description && (
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                          {cleanDescription(sub.description)}
                        </p>
                      )}
                    </div>

                    <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      <span>Lihat Bab & Materi</span>
                      <span className="group-hover:translate-x-1.5 transition-transform">→</span>
                    </div>
                  </Link>
                ))}
            </div>
          </section>
        </div>
      ) : (
        /* 4. DAFTAR SUBTES UTBK-SNBT */
        <section className="space-y-4 pt-2">
          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
            Daftar Subtes UTBK-SNBT
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {subjects.map((sub) => (
              <Link
                key={sub.id}
                to={`/${currentSection}/${sub.id}`}
                className="group relative rounded-2xl p-6 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-400/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center font-black text-base group-hover:scale-110 transition-transform">
                    {sub.name.charAt(0)}
                  </div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {sub.name}
                  </h3>
                  {sub.description && (
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                      {cleanDescription(sub.description)}
                    </p>
                  )}
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  <span>Lihat Bab & Materi</span>
                  <span className="group-hover:translate-x-1.5 transition-transform">→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}