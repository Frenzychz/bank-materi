import { useParams, useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Breadcrumb from '../../components/shared/Breadcrumb'
import type { BreadcrumbItem } from '../../components/shared/Breadcrumb'
import ResourceCard from '../../components/shared/ResourceCard'
import EmptyState from '../../components/shared/EmptyState'
import LoadingState from '../../components/shared/LoadingState'
import { nodesService } from '../../services/nodes.service'
import { resourcesService } from '../../services/resources.service'
import type { Node, Resource } from '../../types'

export default function NodePage() {
  const { nodeId } = useParams<{ nodeId: string }>()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [currentNode, setCurrentNode] = useState<Node | null>(null)
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([])
  const [childNodes, setChildNodes] = useState<Node[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [activeTab, setActiveTab] = useState<'materi' | 'latihan_soal'>('materi')

  useEffect(() => {
    async function loadNodeData() {
      if (!nodeId) return
      setLoading(true)

      // 1. Ambil node saat ini
      const node = await nodesService.getById(nodeId)
      setCurrentNode(node)

      if (node) {
        // 2. Ambil jejak leluhur (parent) untuk Breadcrumb
        const ancestors = await nodesService.getAncestors(node)
        const items: BreadcrumbItem[] = [
          { label: node.section.toUpperCase(), path: `/${node.section}` }
        ]
        ancestors.forEach((anc) => {
          if (anc.node_type !== 'section') {
            items.push({ label: anc.name, path: `/${node.section}/${anc.id}` })
          }
        })
        items.push({ label: node.name })
        setBreadcrumbs(items)

        // 3. Ambil anak-anak (children) jika ada
        const children = await nodesService.getChildren(node.id)
        setChildNodes(children)

        // 4. Ambil file/link materi dari Supabase
        const resList = await resourcesService.getByNodeId(node.id)
        setResources(resList)
      }

      setLoading(false)
    }

    loadNodeData()
  }, [nodeId])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <LoadingState message="Memuat materi dari database..." />
      </div>
    )
  }

  if (!currentNode) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <EmptyState
          icon="🔍"
          title="Halaman materi tidak ditemukan"
          description="ID materi yang kamu tuju tidak terdaftar atau sudah dipindahkan."
        />
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          ← Kembali ke Halaman Sebelumnya
        </button>
      </div>
    )
  }

  // Pisahkan bab reguler dengan Practice Collection manual
  const regularChildren = childNodes.filter((n) => n.node_type !== 'practice_collection')
  const practiceCollections = childNodes.filter((n) => n.node_type === 'practice_collection')

  // Filter resources berdasarkan tab aktif
  const materiResources = resources.filter((r) => r.category === 'materi')
  const latsolResources = resources.filter((r) => r.category === 'latihan_soal')

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Tombol Kembali & Breadcrumb */}
      <div className="space-y-2">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors py-1"
        >
          <span>←</span>
          <span>Kembali</span>
        </button>
        <Breadcrumb items={breadcrumbs} />
      </div>

      {/* Header Info Halaman */}
      <div className="space-y-2 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-0.5 font-bold uppercase tracking-wider rounded-md bg-slate-100 text-slate-700">
            {currentNode.node_type.replace('_', ' ')}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {currentNode.name}
        </h1>
        {currentNode.description && (
          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
            {currentNode.description}
          </p>
        )}
      </div>

      {/* BAGIAN 1: Jika punya bab/submateri turunan */}
      {regularChildren.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Pilih Materi / Sub-bab
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {regularChildren.map((child) => (
              <Link
                key={child.id}
                to={`/${child.section}/${child.id}`}
                className="bg-white border border-slate-200 hover:border-blue-500 rounded-xl p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-all group flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-blue-600 transition-colors">
                    {child.name}
                  </h3>
                  {child.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {child.description}
                    </p>
                  )}
                </div>
                <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                  <span>Buka Materi</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* BAGIAN 2: Practice Collection Manual (Latihan Soal Semua X) */}
      {practiceCollections.length > 0 && (
        <section className="space-y-4 pt-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎯</span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Koleksi Latihan Soal Terpadu
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {practiceCollections.map((pc) => (
              <Link
                key={pc.id}
                to={`/${pc.section}/${pc.id}`}
                className="bg-amber-50/60 border border-amber-200 hover:border-amber-400 rounded-xl p-5 shadow-2xs hover:shadow-xs transition-all group flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <span className="text-2xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-amber-200/70 text-amber-900">
                    Koleksi Latihan Soal
                  </span>
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-amber-800 transition-colors pt-1">
                    {pc.name}
                  </h3>
                  {pc.description && (
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {pc.description}
                    </p>
                  )}
                </div>
                <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center justify-between text-xs font-semibold text-amber-800">
                  <span>Buka Koleksi Latihan</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* BAGIAN 3: Tab Materi & Latihan Soal (Untuk Submateri atau Koleksi) */}
      {(regularChildren.length === 0 || resources.length > 0) && (
        <section className="space-y-6 pt-2">
          {/* Tombol Tab Pilihan: Materi vs Latihan Soal */}
          <div className="flex border-b border-slate-200 gap-2 sm:gap-4">
            <button
              onClick={() => setActiveTab('materi')}
              className={`pb-3 px-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'materi'
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>📖</span>
              <span>Materi Pembelajaran</span>
              <span className="text-xs py-0.5 px-2 rounded-full bg-slate-100 text-slate-600 font-semibold">
                {materiResources.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('latihan_soal')}
              className={`pb-3 px-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'latihan_soal'
                  ? 'border-amber-600 text-amber-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>✍️</span>
              <span>Latihan Soal</span>
              <span className="text-xs py-0.5 px-2 rounded-full bg-slate-100 text-slate-600 font-semibold">
                {latsolResources.length}
              </span>
            </button>
          </div>

          {/* Konten Kartu Resource */}
          <div>
            {activeTab === 'materi' ? (
              materiResources.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {materiResources.map((res) => (
                    <ResourceCard key={res.id} resource={res} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon="📖"
                  title="Belum ada materi tersedia"
                  description="Materi belajar berupa PDF modul, rangkuman Google Drive, atau video YouTube untuk bagian ini sedang dipersiapkan."
                />
              )
            ) : latsolResources.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {latsolResources.map((res) => (
                  <ResourceCard key={res.id} resource={res} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon="✍️"
                title="Belum ada latihan soal tersedia"
                description="Paket latihan soal dan video pembahasan untuk bagian ini sedang disusun oleh tim kurator."
              />
            )}
          </div>
        </section>
      )}
    </div>
  )
}