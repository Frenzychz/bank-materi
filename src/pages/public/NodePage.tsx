import { useParams, useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Breadcrumb from '../../components/shared/Breadcrumb'
import type { BreadcrumbItem } from '../../components/shared/Breadcrumb'
import ResourceCard from '../../components/shared/ResourceCard'
import ResourcePreviewModal from '../../components/shared/ResourcePreviewModal'
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
  const [previewResource, setPreviewResource] = useState<Resource | null>(null)
  const [highlightedResourceId, setHighlightedResourceId] = useState<string | null>(null)

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

  // Deteksi tautan langsung (#res-xxx) untuk auto-scroll dan auto-switch tab
  useEffect(() => {
    if (resources.length > 0 && window.location.hash) {
      const targetId = window.location.hash.replace('#res-', '')
      const found = resources.find((r) => r.id === targetId)
      if (found) {
        setActiveTab(found.category)
        setHighlightedResourceId(found.id)
        setTimeout(() => {
          const el = document.getElementById(`res-${found.id}`)
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        }, 250)
        const timer = setTimeout(() => setHighlightedResourceId(null), 4000)
        return () => clearTimeout(timer)
      }
    }
  }, [resources])

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
          className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-neutral-400 hover:text-white transition-colors py-1 cursor-pointer"
        >
          <span>←</span>
          <span>Kembali</span>
        </button>
        <Breadcrumb items={breadcrumbs} />
      </div>

      {/* Header Info Halaman */}
      <div className="space-y-2 border-b border-neutral-900 pb-6">
        <div className="flex items-center gap-2">
          <span className="text-2xs font-mono font-medium px-2.5 py-0.5 uppercase tracking-wider rounded-md bg-neutral-900 text-neutral-300 border border-neutral-800">
            {currentNode.node_type.replace('_', ' ')}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {currentNode.name}
        </h1>
        {currentNode.description && (
          <p className="text-xs sm:text-sm text-neutral-400 max-w-3xl leading-relaxed">
            {currentNode.description}
          </p>
        )}
      </div>

      {/* BAGIAN 1: Jika punya bab/submateri turunan */}
      {regularChildren.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Pilih Materi / Sub-bab
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {regularChildren.map((child) => (
              <Link
                key={child.id}
                to={`/${child.section}/${child.id}`}
                className="card-obsidian group rounded-xl p-4 sm:p-5 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <h3 className="font-bold text-white text-sm sm:text-base group-hover:text-neutral-200 transition-colors">
                    {child.name}
                  </h3>
                  {child.description && (
                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                      {child.description}
                    </p>
                  )}
                </div>
                <div className="mt-4 pt-2.5 border-t border-neutral-900 flex items-center justify-between text-xs font-medium text-neutral-300 group-hover:text-white">
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
            <span className="text-base">🎯</span>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Koleksi Latihan Soal Terpadu
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {practiceCollections.map((pc) => (
              <Link
                key={pc.id}
                to={`/${pc.section}/${pc.id}`}
                className="card-obsidian group rounded-xl p-5 flex flex-col justify-between border-neutral-700/60"
              >
                <div className="space-y-1.5">
                  <span className="text-2xs font-mono font-medium uppercase tracking-wider px-2 py-0.5 rounded-sm bg-neutral-900 text-neutral-300 border border-neutral-700">
                    Koleksi Latihan Soal
                  </span>
                  <h3 className="font-bold text-white text-base group-hover:text-neutral-200 transition-colors pt-1">
                    {pc.name}
                  </h3>
                  {pc.description && (
                    <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">
                      {pc.description}
                    </p>
                  )}
                </div>
                <div className="mt-4 pt-3 border-t border-neutral-900 flex items-center justify-between text-xs font-medium text-neutral-300 group-hover:text-white">
                  <span>Buka Koleksi Latihan</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* BAGIAN 3: Tab Materi & Latihan Soal */}
      {(regularChildren.length === 0 || resources.length > 0) && (
        <section className="space-y-6 pt-2">
          {/* Tombol Tab Pilihan: Materi vs Latihan Soal */}
          <div className="flex border-b border-neutral-900 gap-2 sm:gap-4">
            <button
              onClick={() => setActiveTab('materi')}
              className={`pb-3 px-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'materi'
                  ? 'border-white text-white'
                  : 'border-transparent text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <span>📖</span>
              <span>Materi Pembelajaran</span>
              <span className="text-xs py-0.5 px-2 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 font-mono font-medium">
                {materiResources.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('latihan_soal')}
              className={`pb-3 px-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'latihan_soal'
                  ? 'border-white text-white'
                  : 'border-transparent text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <span>✍️</span>
              <span>Latihan Soal</span>
              <span className="text-xs py-0.5 px-2 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 font-mono font-medium">
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
                    <ResourceCard
                      key={res.id}
                      resource={res}
                      onPreview={setPreviewResource}
                      isHighlighted={res.id === highlightedResourceId}
                    />
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
                  <ResourceCard
                    key={res.id}
                    resource={res}
                    onPreview={setPreviewResource}
                    isHighlighted={res.id === highlightedResourceId}
                  />
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

      {/* Modal In-App Preview (YouTube & PDF) */}
      <ResourcePreviewModal
        isOpen={!!previewResource}
        resource={previewResource}
        onClose={() => setPreviewResource(null)}
      />
    </div>
  )
}