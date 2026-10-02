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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-900 pb-6">
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {sectionTitle}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-xl leading-relaxed">
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
            <span className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 text-sm">
              ⚡
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Materi Fundamental {currentSection.toUpperCase()}
            </h2>
            <span className="text-2xs font-mono font-medium px-2.5 py-0.5 rounded-md bg-neutral-900 text-neutral-300 border border-neutral-800 uppercase tracking-wider">
              Wajib Paham
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {fundamentals.map((fund) => (
              <Link
                key={fund.id}
                to={`/${currentSection}/${fund.id}`}
                className="card-obsidian group rounded-xl p-5 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <h3 className="font-bold text-white text-base group-hover:text-neutral-200 transition-colors">
                    {fund.name}
                  </h3>
                  {fund.description && (
                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                      {fund.description}
                    </p>
                  )}
                </div>
                <div className="mt-5 pt-3 border-t border-neutral-900 flex items-center justify-between text-xs font-medium text-neutral-300 group-hover:text-white">
                  <span>Buka Konsep Dasar</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-900 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 text-sm">
                  📘
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Materi TKA Wajib
                </h2>
                <span className="text-2xs font-mono font-medium px-2.5 py-0.5 rounded-md bg-neutral-900 text-neutral-300 border border-neutral-800 uppercase tracking-wider">
                  Semua Jurusan
                </span>
              </div>
              <p className="text-xs text-neutral-500 font-mono">
                Diujikan untuk seluruh peserta tes tanpa terkecuali
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {subjects
                .filter((sub) => isTkaWajib(sub))
                .map((sub) => (
                  <Link
                    key={sub.id}
                    to={`/${currentSection}/${sub.id}`}
                    className="card-obsidian group rounded-xl p-5 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-9 h-9 rounded-lg bg-neutral-900 text-white border border-neutral-800 flex items-center justify-center font-bold text-sm group-hover:border-neutral-600 transition-colors">
                          {sub.name.charAt(0)}
                        </div>
                        <span className="text-2xs font-mono font-medium uppercase tracking-wider px-2 py-0.5 rounded-md bg-neutral-900 text-neutral-300 border border-neutral-800">
                          Wajib
                        </span>
                      </div>
                      <h3 className="font-bold text-white text-base group-hover:text-neutral-200 transition-colors">
                        {sub.name}
                      </h3>
                      {sub.description && (
                        <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">
                          {cleanDescription(sub.description)}
                        </p>
                      )}
                    </div>

                    <div className="mt-5 pt-3 border-t border-neutral-900 flex items-center justify-between text-xs font-medium text-neutral-300 group-hover:text-white">
                      <span>Lihat Bab & Materi</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </Link>
                ))}
            </div>
          </section>

          {/* B. SEKSI MATERI TKA PILIHAN */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-900 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 text-sm">
                  🧪
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Materi TKA Pilihan
                </h2>
                <span className="text-2xs font-mono font-medium px-2.5 py-0.5 rounded-md bg-neutral-900 text-neutral-400 border border-neutral-800 uppercase tracking-wider">
                  Peminatan Jurusan
                </span>
              </div>
              <p className="text-xs text-neutral-500 font-mono">
                Pilih mata pelajaran sesuai prodi impianmu
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {subjects
                .filter((sub) => !isTkaWajib(sub))
                .map((sub) => (
                  <Link
                    key={sub.id}
                    to={`/${currentSection}/${sub.id}`}
                    className="card-obsidian group rounded-xl p-5 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-9 h-9 rounded-lg bg-neutral-900 text-neutral-300 border border-neutral-800 flex items-center justify-center font-bold text-sm group-hover:border-neutral-600 transition-colors">
                          {sub.name.charAt(0)}
                        </div>
                        <span className="text-2xs font-mono font-medium uppercase tracking-wider px-2 py-0.5 rounded-md bg-neutral-900 text-neutral-400 border border-neutral-800">
                          Pilihan
                        </span>
                      </div>
                      <h3 className="font-bold text-white text-base group-hover:text-neutral-200 transition-colors">
                        {sub.name}
                      </h3>
                      {sub.description && (
                        <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">
                          {cleanDescription(sub.description)}
                        </p>
                      )}
                    </div>

                    <div className="mt-5 pt-3 border-t border-neutral-900 flex items-center justify-between text-xs font-medium text-neutral-300 group-hover:text-white">
                      <span>Lihat Bab & Materi</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </Link>
                ))}
            </div>
          </section>
        </div>
      ) : (
        /* 4. DAFTAR SUBTES UTBK-SNBT */
        <section className="space-y-4 pt-2">
          <div className="border-b border-neutral-900 pb-3">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Daftar Subtes UTBK-SNBT
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {subjects.map((sub) => (
              <Link
                key={sub.id}
                to={`/${currentSection}/${sub.id}`}
                className="card-obsidian group rounded-xl p-5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-9 h-9 rounded-lg bg-neutral-900 text-white border border-neutral-800 flex items-center justify-center font-bold text-sm group-hover:border-neutral-600 transition-colors">
                    {sub.name.charAt(0)}
                  </div>
                  <h3 className="font-bold text-white text-base group-hover:text-neutral-200 transition-colors">
                    {sub.name}
                  </h3>
                  {sub.description && (
                    <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">
                      {cleanDescription(sub.description)}
                    </p>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-neutral-900 flex items-center justify-between text-xs font-medium text-neutral-300 group-hover:text-white">
                  <span>Lihat Bab & Materi</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}