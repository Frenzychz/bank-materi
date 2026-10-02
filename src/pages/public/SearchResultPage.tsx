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

  const getBadgeColor = () => {
    return 'bg-neutral-900 text-neutral-300 border-neutral-800'
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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Pencarian {currentSection.toUpperCase()}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
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
        <div className="card-obsidian rounded-2xl p-8 text-center space-y-3">
          <span className="text-2xl">🔍</span>
          <h2 className="text-base font-bold text-white">
            Ketik kata kunci untuk mulai mencari
          </h2>
          <p className="text-xs text-neutral-400 max-w-md mx-auto">
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
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-neutral-200 text-black rounded-lg text-xs font-bold transition-colors"
            >
              Lihat Semua Materi {currentSection.toUpperCase()} →
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {/* Bar Info & Filter Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-900">
            <p className="text-xs font-mono text-neutral-400">
              Ditemukan <span className="font-bold text-white">{results.length}</span> hasil untuk "{queryParam}"
            </p>

            <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-lg border border-neutral-800 self-start sm:self-auto text-xs font-medium">
              <button
                onClick={() => setFilterTab('all')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  filterTab === 'all'
                    ? 'bg-neutral-800 text-white font-semibold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Semua ({results.length})
              </button>
              <button
                onClick={() => setFilterTab('topics')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  filterTab === 'topics'
                    ? 'bg-neutral-800 text-white font-semibold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Bab & Topik ({topicCount})
              </button>
              <button
                onClick={() => setFilterTab('materials')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  filterTab === 'materials'
                    ? 'bg-neutral-800 text-white font-semibold'
                    : 'text-neutral-400 hover:text-white'
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
                className="card-obsidian rounded-xl p-4 sm:p-5 group"
              >
                {/* 1. Baris Jejak Hierarki (Breadcrumbs Context) */}
                {item.breadcrumbs.length > 0 && (
                  <div className="flex items-center gap-1.5 text-2xs text-neutral-500 font-mono mb-2 flex-wrap">
                    <span>{currentSection.toUpperCase()}</span>
                    {item.breadcrumbs.map((crumb, idx) => (
                      <span key={idx} className="flex items-center gap-1.5">
                        <span>›</span>
                        <span className="hover:text-neutral-300">{crumb}</span>
                      </span>
                    ))}
                  </div>
                )}

                {/* 2. Judul & Label Tipe */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-2xs font-mono font-medium px-2 py-0.5 rounded-md border ${getBadgeColor()}`}
                      >
                        {getTypeLabel(item)}
                      </span>

                      <Link
                        to={`/${currentSection}/${item.targetNodeId}`}
                        className="text-base font-bold text-white group-hover:text-neutral-200 transition-colors"
                      >
                        {item.title}
                      </Link>
                    </div>

                    {item.description && (
                      <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">
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
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white hover:bg-neutral-200 text-black text-xs font-semibold transition-colors"
                      >
                        Buka Konten ↗
                      </a>
                    ) : (
                      <Link
                        to={`/${currentSection}/${item.targetNodeId}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold transition-colors"
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
