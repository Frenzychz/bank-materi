import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Breadcrumb from '../../components/shared/Breadcrumb'
import SearchBar from '../../components/shared/SearchBar'
import LoadingState from '../../components/shared/LoadingState'
import EmptyState from '../../components/shared/EmptyState'
import { searchService } from '../../services/search.service'
import type { SearchResultItem } from '../../services/search.service'
import type { Section } from '../../types'

export default function SearchResultPage() {
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()

  const currentSection: Section = location.pathname.startsWith('/tka') ? 'tka' : 'snbt'
  const queryParam = searchParams.get('q') || ''

  const [query, setQuery] = useState(queryParam)
  const [results, setResults] = useState<SearchResultItem[]>([])
  const [loading, setLoading] = useState(false)
  const [filterTab, setFilterTab] = useState<'all' | 'topics' | 'materials'>('all')

  // Sinkronisasi input dengan parameter URL
  useEffect(() => {
    setQuery(queryParam)
  }, [queryParam])

  // Lakukan pencarian setiap kali queryParam berubah
  useEffect(() => {
    async function doSearch() {
      if (!queryParam.trim()) {
        setResults([])
        return
      }

      setLoading(true)
      const data = await searchService.search(currentSection, queryParam)
      setResults(data)
      setLoading(false)
    }

    doSearch()
  }, [currentSection, queryParam])

  const handleSearch = (newQuery: string) => {
    if (!newQuery.trim()) {
      setSearchParams({})
    } else {
      setSearchParams({ q: newQuery.trim() })
    }
  }

  // Filter berdasarkan tab
  const filteredResults = results.filter((item) => {
    if (filterTab === 'topics') return item.resultType === 'node'
    if (filterTab === 'materials') return item.resultType === 'resource'
    return true
  })

  const topicCount = results.filter((r) => r.resultType === 'node').length
  const materialCount = results.filter((r) => r.resultType === 'resource').length

  const getBadgeColor = (item: SearchResultItem) => {
    if (item.resultType === 'node') {
      if (item.nodeType === 'fundamental') return 'bg-amber-100 text-amber-800 border-amber-200'
      if (item.nodeType === 'subject') return 'bg-blue-100 text-blue-800 border-blue-200'
      if (item.nodeType === 'material') return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      return 'bg-slate-100 text-slate-700 border-slate-200'
    }

    if (item.sourceType === 'youtube') return 'bg-rose-100 text-rose-800 border-rose-200'
    if (item.sourceType === 'google_drive') return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    return 'bg-blue-100 text-blue-800 border-blue-200'
  }

  const getTypeLabel = (item: SearchResultItem) => {
    if (item.resultType === 'node') {
      if (item.nodeType === 'fundamental') return '⚡ Fundamental'
      if (item.nodeType === 'subject') return '📚 Mata Pelajaran'
      if (item.nodeType === 'material') return '📖 Bab Materi'
      if (item.nodeType === 'practice_collection') return '📝 Koleksi Soal'
      return '📄 Sub-bab'
    }

    const catLabel = item.category === 'latihan_soal' ? 'Latsol' : 'Materi'
    if (item.sourceType === 'youtube') return `▶ Video (${catLabel})`
    if (item.sourceType === 'google_drive') return `☁ Drive (${catLabel})`
    return `📄 PDF (${catLabel})`
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
      {/* 1. Breadcrumb Navigasi */}
      <Breadcrumb
        items={[
          { label: currentSection.toUpperCase(), path: `/${currentSection}` },
          { label: 'Pencarian Materi' },
        ]}
      />

      {/* 2. Header & Search Bar Utama */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Pencarian {currentSection.toUpperCase()}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Temukan konsep materi, video pembahasan, modul PDF, atau latihan soal di kurikulum {currentSection.toUpperCase()}.
          </p>
        </div>

        <SearchBar
          initialValue={query}
          placeholder={`Cari materi, rumus, bab, atau latihan soal di ${currentSection.toUpperCase()}...`}
          onSearch={handleSearch}
          autoFocus={!queryParam}
        />
      </div>

      {/* 3. Tampilan Hasil */}
      {loading ? (
        <LoadingState message="Mencari materi yang sesuai..." />
      ) : !queryParam.trim() ? (
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-3">
          <span className="text-3xl">🔍</span>
          <h2 className="text-base font-bold text-slate-800 dark:text-white">
            Ketik kata kunci untuk mulai mencari
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Contoh: "aljabar", "fungsi invers", "penalaran kuantitatif", atau judul materi yang ingin kamu pelajari.
          </p>
        </div>
      ) : results.length === 0 ? (
        <EmptyState
          title={`Tidak ada hasil untuk "${queryParam}"`}
          description={`Kami tidak menemukan bab materi atau latihan soal yang cocok di kurikulum ${currentSection.toUpperCase()}. Coba periksa ejaan atau gunakan kata kunci lain.`}
          action={
            <Link
              to={`/${currentSection}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors"
            >
              Lihat Semua Materi {currentSection.toUpperCase()} →
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {/* Bar Info & Filter Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Ditemukan <span className="font-extrabold text-blue-600 dark:text-blue-400">{results.length}</span> hasil untuk "{queryParam}"
            </p>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg self-start sm:self-auto text-xs font-semibold">
              <button
                onClick={() => setFilterTab('all')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  filterTab === 'all'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Semua ({results.length})
              </button>
              <button
                onClick={() => setFilterTab('topics')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  filterTab === 'topics'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Bab & Topik ({topicCount})
              </button>
              <button
                onClick={() => setFilterTab('materials')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  filterTab === 'materials'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Modul & Video ({materialCount})
              </button>
            </div>
          </div>

          {/* Daftar Kartu Hasil Pencarian */}
          <div className="space-y-3">
            {filteredResults.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 rounded-xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all group"
              >
                {/* 1. Baris Jejak Hierarki (Breadcrumbs Context) */}
                {item.breadcrumbs.length > 0 && (
                  <div className="flex items-center gap-1.5 text-2xs text-slate-400 dark:text-slate-500 font-medium mb-1.5 flex-wrap">
                    <span>{currentSection.toUpperCase()}</span>
                    {item.breadcrumbs.map((crumb, idx) => (
                      <span key={idx} className="flex items-center gap-1.5">
                        <span>›</span>
                        <span className="hover:text-slate-600 dark:hover:text-slate-300">{crumb}</span>
                      </span>
                    ))}
                  </div>
                )}

                {/* 2. Judul & Label Tipe */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-2xs font-bold px-2 py-0.5 rounded-md border ${getBadgeColor(
                          item
                        )}`}
                      >
                        {getTypeLabel(item)}
                      </span>

                      <Link
                        to={`/${currentSection}/${item.targetNodeId}`}
                        className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                      >
                        {item.title}
                      </Link>
                    </div>

                    {item.description && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* 3. Tombol Aksi */}
                  <div className="shrink-0">
                    {item.resultType === 'resource' && item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white text-xs font-bold transition-colors"
                      >
                        Buka Konten ↗
                      </a>
                    ) : (
                      <Link
                        to={`/${currentSection}/${item.targetNodeId}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-blue-600 group-hover:text-white text-xs font-bold transition-colors"
                      >
                        Buka Bab →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
