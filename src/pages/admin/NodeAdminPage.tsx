import { useParams, useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Breadcrumb from '../../components/shared/Breadcrumb'
import type { BreadcrumbItem } from '../../components/shared/Breadcrumb'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/shared/ConfirmDialog'
import LoadingState from '../../components/shared/LoadingState'
import SortableNodeGrid from '../../components/admin/SortableNodeGrid'
import SortableResourceGrid from '../../components/admin/SortableResourceGrid'
import { nodesService } from '../../services/nodes.service'
import { resourcesService } from '../../services/resources.service'
import type { Node, Resource, NodeType, ResourceCategory, SourceType, ResourceStatus } from '../../types'

export default function NodeAdminPage() {
  const { nodeId } = useParams<{ nodeId: string }>()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [currentNode, setCurrentNode] = useState<Node | null>(null)
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([])
  const [childNodes, setChildNodes] = useState<Node[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [activeTab, setActiveTab] = useState<'materi' | 'latihan_soal'>('materi')
  const [reorderFeedback, setReorderFeedback] = useState<string | null>(null)

  // --- STATE MODAL NODE (SUB-BAB / KOLEKSI) ---
  const [isNodeModalOpen, setIsNodeModalOpen] = useState(false)
  const [editingNode, setEditingNode] = useState<Node | null>(null)
  const [nodeModalType, setNodeModalType] = useState<NodeType>('submaterial')
  const [nodeName, setNodeName] = useState('')
  const [nodeDesc, setNodeDesc] = useState('')
  const [nodeSortOrder, setNodeSortOrder] = useState(1)

  // --- STATE MODAL RESOURCE (MODUL / LINK) ---
  const [isResModalOpen, setIsResModalOpen] = useState(false)
  const [editingRes, setEditingRes] = useState<Resource | null>(null)
  const [resCategory, setResCategory] = useState<ResourceCategory>('materi')
  const [resTitle, setResTitle] = useState('')
  const [resDesc, setResDesc] = useState('')
  const [resSourceType, setResSourceType] = useState<SourceType>('pdf')
  const [resUrl, setResUrl] = useState('')
  const [resFile, setResFile] = useState<File | null>(null)
  const [resStatus, setResStatus] = useState<ResourceStatus>('published')
  const [resSortOrder, setResSortOrder] = useState(1)
  const [uploadProgress, setUploadProgress] = useState(false)

  // --- STATE DIALOG HAPUS ---
  const [deleteNodeTarget, setDeleteNodeTarget] = useState<Node | null>(null)
  const [deleteNodeWarning, setDeleteNodeWarning] = useState<string | null>(null)
  const [deleteResTarget, setDeleteResTarget] = useState<Resource | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Muat data dari Supabase
  const loadData = async () => {
    if (!nodeId) return
    setLoading(true)

    const node = await nodesService.getById(nodeId)
    setCurrentNode(node)

    if (node) {
      // Susun Breadcrumb Admin
      const ancestors = await nodesService.getAncestors(node)
      const items: BreadcrumbItem[] = [
        { label: 'Admin', path: '/admin' },
        { label: node.section.toUpperCase(), path: `/admin/${node.section}` },
      ]
      ancestors.forEach((anc) => {
        if (anc.node_type !== 'section') {
          items.push({ label: anc.name, path: `/admin/nodes/${anc.id}` })
        }
      })
      items.push({ label: node.name })
      setBreadcrumbs(items)

      // Ambil anak-anak dan resources
      const children = await nodesService.getChildren(node.id)
      setChildNodes(children)

      const resList = await resourcesService.getAllByNodeId(node.id)
      setResources(resList)
    }

    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [nodeId])

  // --- HANDLER NODE (SUB-BAB / KOLEKSI) ---
  const handleOpenAddNode = (type: NodeType) => {
    setEditingNode(null)
    setNodeModalType(type)
    setNodeName('')
    setNodeDesc('')
    setNodeSortOrder(childNodes.length + 1)
    setIsNodeModalOpen(true)
  }

  const handleOpenEditNode = (n: Node) => {
    setEditingNode(n)
    setNodeModalType(n.node_type)
    setNodeName(n.name)
    setNodeDesc(n.description || '')
    setNodeSortOrder(n.sort_order)
    setIsNodeModalOpen(true)
  }

  const handleSaveNode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentNode || !nodeName.trim()) return

    try {
      if (editingNode) {
        await nodesService.updateNode(editingNode.id, {
          name: nodeName.trim(),
          description: nodeDesc.trim() || null,
          sort_order: Number(nodeSortOrder),
        })
      } else {
        await nodesService.createNode({
          section: currentNode.section,
          parent_id: currentNode.id,
          node_type: nodeModalType,
          name: nodeName.trim(),
          description: nodeDesc.trim() || null,
          sort_order: Number(nodeSortOrder),
        })
      }

      setIsNodeModalOpen(false)
      await loadData()
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Gagal menyimpan bab.')
    }
  }

  const handleOpenDeleteNode = async (n: Node) => {
    setDeleteNodeTarget(n)
    const { childNodesCount, resourcesCount } = await nodesService.checkHasChildren(n.id)
    if (childNodesCount > 0 || resourcesCount > 0) {
      setDeleteNodeWarning(
        `PERINGATAN: Bagian ini masih memiliki ${childNodesCount} bab turunan dan ${resourcesCount} file materi! Menghapus bab ini akan menghapus data di dalamnya.`
      )
    } else {
      setDeleteNodeWarning(null)
    }
  }

  const handleConfirmDeleteNode = async () => {
    if (!deleteNodeTarget) return
    try {
      setIsDeleting(true)
      await nodesService.deleteNode(deleteNodeTarget.id)
      setDeleteNodeTarget(null)
      await loadData()
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Gagal menghapus bab.')
    } finally {
      setIsDeleting(false)
    }
  }

  // Handle Drag & Drop Reorder Sub-bab (childNodes)
  const handleReorderChildren = async (reordered: Node[]) => {
    setChildNodes((prev) => {
      const practice = prev.filter((n) => n.node_type === 'practice_collection')
      return [...reordered, ...practice]
    })
    setReorderFeedback('Menyimpan urutan sub-bab...')
    try {
      await nodesService.reorderNodes(reordered.map((n) => n.id))
      setReorderFeedback('✓ Urutan sub-bab berhasil diperbarui!')
      setTimeout(() => setReorderFeedback(null), 2500)
    } catch {
      setReorderFeedback('❌ Gagal menyimpan urutan.')
      setTimeout(() => setReorderFeedback(null), 3000)
    }
  }

  // Handle Drag & Drop Reorder Practice Collections
  const handleReorderPractice = async (reordered: Node[]) => {
    setChildNodes((prev) => {
      const regular = prev.filter((n) => n.node_type !== 'practice_collection')
      return [...regular, ...reordered]
    })
    setReorderFeedback('Menyimpan urutan koleksi latihan...')
    try {
      await nodesService.reorderNodes(reordered.map((n) => n.id))
      setReorderFeedback('✓ Urutan koleksi latihan berhasil diperbarui!')
      setTimeout(() => setReorderFeedback(null), 2500)
    } catch {
      setReorderFeedback('❌ Gagal menyimpan urutan.')
      setTimeout(() => setReorderFeedback(null), 3000)
    }
  }

  // Handle Drag & Drop Reorder Resources (materi/latsol)
  const handleReorderResources = async (reordered: Resource[]) => {
    setResources((prev) => {
      const otherTab = prev.filter((r) => r.category !== activeTab)
      return [...otherTab, ...reordered]
    })
    setReorderFeedback(`Menyimpan urutan ${activeTab === 'materi' ? 'materi' : 'latihan soal'}...`)
    try {
      await resourcesService.reorderResources(reordered.map((r) => r.id))
      setReorderFeedback('✓ Urutan materi berhasil diperbarui!')
      setTimeout(() => setReorderFeedback(null), 2500)
    } catch {
      setReorderFeedback('❌ Gagal menyimpan urutan.')
      setTimeout(() => setReorderFeedback(null), 3000)
    }
  }

  // --- HANDLER RESOURCE (MATERI / LATIHAN) ---
  const handleOpenAddRes = (category: ResourceCategory) => {
    setEditingRes(null)
    setResCategory(category)
    setResTitle('')
    setResDesc('')
    setResSourceType('pdf')
    setResUrl('')
    setResFile(null)
    setResStatus('published')
    const currentList = resources.filter((r) => r.category === category)
    setResSortOrder(currentList.length + 1)
    setIsResModalOpen(true)
  }

  const handleOpenEditRes = (r: Resource) => {
    setEditingRes(r)
    setResCategory(r.category)
    setResTitle(r.title)
    setResDesc(r.description || '')
    setResSourceType(r.source_type)
    setResUrl(r.url || '')
    setResFile(null)
    setResStatus(r.status)
    setResSortOrder(r.sort_order)
    setIsResModalOpen(true)
  }

  const handleSaveRes = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentNode || !resTitle.trim()) return

    try {
      setUploadProgress(true)
      let finalUrl = resUrl.trim()
      let finalFilePath = editingRes?.file_path || null

      // Jika ada upload file PDF baru
      if (resSourceType === 'pdf' && resFile) {
        const uploadResult = await resourcesService.uploadPdf(resFile, currentNode.id)
        finalUrl = uploadResult.publicUrl
        finalFilePath = uploadResult.filePath
      }

      if (editingRes) {
        // Edit resource yang sudah ada
        await resourcesService.updateResource(editingRes.id, {
          title: resTitle.trim(),
          description: resDesc.trim() || null,
          category: resCategory,
          source_type: resSourceType,
          url: finalUrl || null,
          file_path: finalFilePath,
          status: resStatus,
          sort_order: Number(resSortOrder),
        })
      } else {
        // Tambah resource baru
        await resourcesService.createResource({
          node_id: currentNode.id,
          title: resTitle.trim(),
          description: resDesc.trim() || null,
          category: resCategory,
          source_type: resSourceType,
          url: finalUrl || null,
          file_path: finalFilePath,
          status: resStatus,
          sort_order: Number(resSortOrder),
        })
      }

      setIsResModalOpen(false)
      await loadData()
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Gagal menyimpan materi.')
    } finally {
      setUploadProgress(false)
    }
  }

  const handleConfirmDeleteRes = async () => {
    if (!deleteResTarget) return
    try {
      setIsDeleting(true)
      await resourcesService.deleteResource(deleteResTarget.id)
      setDeleteResTarget(null)
      await loadData()
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Gagal menghapus materi.')
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading || !currentNode) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <LoadingState message="Memuat detail pengelola materi..." />
      </div>
    )
  }

  const regularChildren = childNodes.filter((n) => n.node_type !== 'practice_collection')
  const practiceCollections = childNodes.filter((n) => n.node_type === 'practice_collection')
  const materiList = resources.filter((r) => r.category === 'materi')
  const latsolList = resources.filter((r) => r.category === 'latihan_soal')

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-800">
      {/* Header Admin */}
      <header className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="text-slate-400 hover:text-white text-xs font-semibold"
            >
              ← Kembali
            </button>
            <span className="text-slate-600">/</span>
            <h1 className="font-extrabold text-sm sm:text-base text-white truncate max-w-xs sm:max-w-md">
              {currentNode.name}
            </h1>
          </div>

          <Link
            to={`/${currentNode.section}/${currentNode.id}`}
            target="_blank"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Lihat di Web Publik ↗
          </Link>
        </div>
      </header>

      {/* Konten Utama */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Breadcrumb items={breadcrumbs} />

          {reorderFeedback && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold shadow-md animate-fade-in">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{reorderFeedback}</span>
            </div>
          )}
        </div>

        {/* Petunjuk Drag & Drop */}
        <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-3.5 flex items-center gap-2.5 text-xs text-blue-900">
          <span className="text-base">💡</span>
          <p>
            <strong>Tips Pengurutan:</strong> Kamu bisa langsung <strong>menyeret (drag & drop)</strong> kartu dengan mouse atau menggunakan tombol panah <strong>◀ / ▶</strong> untuk memindahkan posisi sub-bab dan materi secara instan.
          </p>
        </div>

        {/* Info Header Bab Saat Ini */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold uppercase">
              Tipe: {currentNode.node_type.replace('_', ' ')}
            </span>
            <span className="text-xs text-slate-400 font-semibold">
              Urutan: {currentNode.sort_order}
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900">{currentNode.name}</h2>
          {currentNode.description && (
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
              {currentNode.description}
            </p>
          )}
        </div>

        {/* 1. SEKSI BAB & SUBMATERI TURUNAN */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Sub-bab & Materi Turunan ({regularChildren.length})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Bab materi spesifik yang berada di bawah naungan {currentNode.name}. Geser kartu untuk mengatur urutan.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenAddNode('submaterial')}
                className="px-3.5 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
              >
                + Tambah Submateri
              </button>
              <button
                onClick={() => handleOpenAddNode('practice_collection')}
                className="px-3 py-2 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors"
              >
                + Tambah Koleksi Latihan
              </button>
            </div>
          </div>

          {/* Daftar Submateri (Sortable Drag & Drop) */}
          {regularChildren.length > 0 ? (
            <SortableNodeGrid
              nodes={regularChildren}
              onReorder={handleReorderChildren}
              onEdit={handleOpenEditNode}
              onDelete={handleOpenDeleteNode}
              badge="Submateri"
              badgeColor="bg-slate-100 text-slate-700 border-slate-200"
            />
          ) : (
            <p className="text-xs text-slate-400 italic">
              Tidak ada sub-bab di bawah bagian ini. Materi langsung dikelola pada bagian bawah.
            </p>
          )}

          {/* Koleksi Latihan Manual */}
          {practiceCollections.length > 0 && (
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800">
                Koleksi Latihan Soal Terpadu ({practiceCollections.length})
              </h4>
              <SortableNodeGrid
                nodes={practiceCollections}
                onReorder={handleReorderPractice}
                onEdit={handleOpenEditNode}
                onDelete={handleOpenDeleteNode}
                badge="Koleksi"
                badgeColor="bg-amber-50 text-amber-800 border-amber-200"
              />
            </div>
          )}
        </section>

        {/* 2. SEKSI FILE & MODUL (RESOURCES: PDF, DRIVE, YOUTUBE) */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                File Modul & Tautan Materi
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Kelola file PDF (maks 50 MB), link Google Drive, dan video YouTube. Geser kartu untuk mengatur urutan.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenAddRes('materi')}
                className="px-3.5 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
              >
                + Tambah Materi
              </button>
              <button
                onClick={() => handleOpenAddRes('latihan_soal')}
                className="px-3.5 py-2 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors"
              >
                + Tambah Latihan Soal
              </button>
            </div>
          </div>

          {/* Tab Pilihan: Materi vs Latihan Soal */}
          <div className="flex border-b border-slate-200 gap-4">
            <button
              onClick={() => setActiveTab('materi')}
              className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'materi'
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>📖</span>
              <span>Materi ({materiList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('latihan_soal')}
              className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'latihan_soal'
                  ? 'border-amber-600 text-amber-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>✍️</span>
              <span>Latihan Soal ({latsolList.length})</span>
            </button>
          </div>

          {/* Daftar Resource (Sortable Drag & Drop) */}
          {(() => {
            const currentResList = activeTab === 'materi' ? materiList : latsolList
            if (currentResList.length === 0) {
              return (
                <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl space-y-1">
                  <p className="text-sm font-bold text-slate-700">Belum ada {activeTab === 'materi' ? 'materi' : 'latihan soal'}.</p>
                  <p className="text-xs text-slate-400">Klik tombol di atas untuk menambahkan modul PDF, Drive, atau YouTube.</p>
                </div>
              )
            }

            return (
              <SortableResourceGrid
                resources={currentResList}
                onReorder={handleReorderResources}
                onEdit={handleOpenEditRes}
                onDelete={setDeleteResTarget}
              />
            )
          })()}
        </section>
      </main>

      {/* MODAL TAMBAH / EDIT BAB NODE */}
      <Modal
        isOpen={isNodeModalOpen}
        title={editingNode ? `Edit ${editingNode.name}` : `Tambah ${nodeModalType === 'practice_collection' ? 'Koleksi Latihan' : 'Submateri'}`}
        onClose={() => setIsNodeModalOpen(false)}
      >
        <form onSubmit={handleSaveNode} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase">Nama Bagian</label>
            <input
              type="text"
              value={nodeName}
              onChange={(e) => setNodeName(e.target.value)}
              placeholder="Contoh: Fungsi Komposisi"
              className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              required
              autoFocus
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase">Deskripsi Singkat</label>
            <textarea
              value={nodeDesc}
              onChange={(e) => setNodeDesc(e.target.value)}
              placeholder="Rangkuman cakupan materi..."
              rows={3}
              className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase">Nomor Urutan</label>
            <input
              type="number"
              value={nodeSortOrder}
              onChange={(e) => setNodeSortOrder(Number(e.target.value))}
              className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsNodeModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
            >
              {editingNode ? 'Simpan Perubahan' : 'Tambah Bab'}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL TAMBAH / EDIT RESOURCE (PDF, DRIVE, YOUTUBE) */}
      <Modal
        isOpen={isResModalOpen}
        title={editingRes ? `Edit Modul / Link` : `Tambah ${resCategory === 'materi' ? 'Materi Pembelajaran' : 'Latihan Soal'}`}
        onClose={() => setIsResModalOpen(false)}
      >
        <form onSubmit={handleSaveRes} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase">Judul Modul / Video</label>
            <input
              type="text"
              value={resTitle}
              onChange={(e) => setResTitle(e.target.value)}
              placeholder="Contoh: Modul Ringkasan Relasi dan Fungsi"
              className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              required
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase">Kategori</label>
              <select
                value={resCategory}
                onChange={(e) => setResCategory(e.target.value as ResourceCategory)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm bg-white"
              >
                <option value="materi">Materi Pembelajaran</option>
                <option value="latihan_soal">Latihan Soal</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase">Tipe Sumber</label>
              <select
                value={resSourceType}
                onChange={(e) => setResSourceType(e.target.value as SourceType)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm bg-white"
              >
                <option value="pdf">Dokumen PDF</option>
                <option value="google_drive">Google Drive</option>
                <option value="youtube">YouTube Video</option>
              </select>
            </div>
          </div>

          {/* Form Dinamis Berdasarkan Tipe Sumber */}
          {resSourceType === 'pdf' ? (
            <div className="space-y-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Upload File PDF (Maksimal 50 MB)
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setResFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
                <p className="text-2xs text-slate-400">
                  File &gt; 50 MB akan otomatis ditolak. Untuk file besar, gunakan opsi Google Drive.
                </p>
              </div>

              <div className="relative flex py-1 items-center">
                <div className="grow border-t border-slate-200"></div>
                <span className="shrink mx-2 text-2xs text-slate-400 font-bold uppercase">Atau Gunakan URL PDF</span>
                <div className="grow border-t border-slate-200"></div>
              </div>

              <div className="space-y-1">
                <input
                  type="url"
                  value={resUrl}
                  onChange={(e) => setResUrl(e.target.value)}
                  placeholder="https://contoh.com/file.pdf"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>
          ) : resSourceType === 'google_drive' ? (
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase">Tautan Google Drive</label>
              <input
                type="url"
                value={resUrl}
                onChange={(e) => setResUrl(e.target.value)}
                placeholder="https://drive.google.com/..."
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm"
                required
              />
            </div>
          ) : (
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase">Tautan Video YouTube</label>
              <input
                type="url"
                value={resUrl}
                onChange={(e) => setResUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm"
                required
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase">Status Publikasi</label>
              <select
                value={resStatus}
                onChange={(e) => setResStatus(e.target.value as ResourceStatus)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm bg-white"
              >
                <option value="published">Published (Tampil)</option>
                <option value="draft">Draft (Disembunyikan)</option>
                <option value="hidden">Hidden (Arsip)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase">Nomor Urut</label>
              <input
                type="number"
                value={resSortOrder}
                onChange={(e) => setResSortOrder(Number(e.target.value))}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase">Deskripsi Tambahan (Opsional)</label>
            <textarea
              value={resDesc}
              onChange={(e) => setResDesc(e.target.value)}
              placeholder="Catatan tambahan isi modul atau pembahasan..."
              rows={2}
              className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsResModalOpen(false)}
              disabled={uploadProgress}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={uploadProgress}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs flex items-center gap-2"
            >
              {uploadProgress && (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              <span>{uploadProgress ? 'Mengunggah...' : editingRes ? 'Simpan Perubahan' : 'Tambah Modul'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* DIALOG KONFIRMASI HAPUS BAB */}
      <ConfirmDialog
        isOpen={!!deleteNodeTarget}
        title={`Hapus "${deleteNodeTarget?.name}"?`}
        message={
          deleteNodeWarning ||
          'Apakah kamu yakin ingin menghapus bab ini? Tindakan ini tidak dapat dibatalkan.'
        }
        confirmText="Hapus Bab"
        cancelText="Batal"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleConfirmDeleteNode}
        onCancel={() => setDeleteNodeTarget(null)}
      />

      {/* DIALOG KONFIRMASI HAPUS RESOURCE */}
      <ConfirmDialog
        isOpen={!!deleteResTarget}
        title={`Hapus Modul "${deleteResTarget?.title}"?`}
        message="Apakah kamu yakin ingin menghapus materi/latihan soal ini dari website?"
        confirmText="Hapus Materi"
        cancelText="Batal"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleConfirmDeleteRes}
        onCancel={() => setDeleteResTarget(null)}
      />
    </div>
  )
}