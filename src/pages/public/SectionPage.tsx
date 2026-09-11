import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Breadcrumb from '../../components/shared/Breadcrumb'
import SearchBar from '../../components/shared/SearchBar'
import LoadingState from '../../components/shared/LoadingState'
import { nodesService } from '../../services/nodes.service'
import type { Section, Node } from '../../types'

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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {sectionTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
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
          <div className="flex items-center gap-2">
            <span className="text-lg">⚡</span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Materi Fundamental {currentSection.toUpperCase()}
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold">
              Wajib Paham
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {fundamentals.map((fund) => (
              <Link
                key={fund.id}
                to={`/${currentSection}/${fund.id}`}
                className="bg-gradient-to-br from-blue-50/50 to-white border border-blue-200/80 hover:border-blue-500 rounded-xl p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-all group flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-blue-700 transition-colors">
                    {fund.name}
                  </h3>
                  {fund.description && (
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {fund.description}
                    </p>
                  )}
                </div>
                <div className="mt-4 pt-3 border-t border-blue-100/60 flex items-center justify-between text-xs font-semibold text-blue-700">
                  <span>Buka Fundamental</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 4. DAFTAR MATA PELAJARAN / SUBTEST */}
      <section className="space-y-4 pt-4">
        <h2 className="text-base sm:text-lg font-bold text-slate-900">
          {currentSection === 'tka' ? 'Daftar Mata Pelajaran TKA' : 'Daftar Subtes UTBK-SNBT'}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {subjects.map((sub) => (
            <Link
              key={sub.id}
              to={`/${currentSection}/${sub.id}`}
              className="bg-white border border-slate-200 hover:border-slate-400 rounded-xl p-5 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {sub.name.charAt(0)}
                </div>
                <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                  {sub.name}
                </h3>
                {sub.description && (
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {sub.description}
                  </p>
                )}
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700 group-hover:text-blue-600">
                <span>Lihat Bab & Materi</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}