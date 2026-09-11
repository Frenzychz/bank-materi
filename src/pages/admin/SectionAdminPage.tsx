import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Breadcrumb from '../../components/shared/Breadcrumb'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/shared/ConfirmDialog'
import LoadingState from '../../components/shared/LoadingState'
import { nodesService } from '../../services/nodes.service'
import type { Section, Node, NodeType } from '../../types'

export default function SectionAdminPage() {
  const location = useLocation()
  const currentSection: Section = location.pathname.startsWith('/admin/tka') ? 'tka' : 'snbt'

  const [loading, setLoading] = useState(true)
  const [fundamentals, setFundamentals] = useState<Node[]>([])
  const [subjects, setSubjects] = useState<Node[]>([])

  // State untuk Modal Form Tambah/Edit
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingNode, setEditingNode] = useState<Node | null>(null)
  const [modalType, setModalType] = useState<NodeType>('subject')
  const [formName, setFormName] = useState('')
  const [formDesc, setFormDesc] = useState('')
  const [formSortOrder, setFormSortOrder] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // State untuk Dialog Hapus Aman (Safe Deletion)
  const [deleteTarget, setDeleteTarget] = useState<Node | null>(null)
  const [deleteWarning, setDeleteWarning] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fungsi memuat data dari Supabase
  const loadData = async () => {
    setLoading(true)
    const sectionRootId = currentSection === 'tka' ? 'sec-tka' : 'sec-snbt'
    const allNodes = await nodesService.getBySection(currentSection)

    setFundamentals(
      allNodes.filter(
        (n) => n.parent_id === sectionRootId && n.node_type === 'fundamental'
      )
    )
    setSubjects(
      allNodes.filter(
        (n) => n.parent_id === sectionRootId && n.node_type === 'subject'
      )
    )
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [currentSection])

  // Membuka modal tambah baru
  const handleOpenAddModal = (type: NodeType) => {
    setEditingNode(null)
    setModalType(type)
    setFormName('')
    setFormDesc('')
    const list = type === 'fundamental' ? fundamentals : subjects
    setFormSortOrder(list.length + 1)
    setIsModalOpen(true)
  }

  // Membuka modal edit
  const handleOpenEditModal = (node: Node) => {
    setEditingNode(node)
    setModalType(node.node_type)
    setFormName(node.name)
    setFormDesc(node.description || '')
    setFormSortOrder(node.sort_order)
    setIsModalOpen(true)
  }

  // Simpan Form (Tambah atau Edit)
  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim()) return

    try {
      setIsSubmitting(true)
      const sectionRootId = currentSection === 'tka' ? 'sec-tka' : 'sec-snbt'

      if (editingNode) {
        // Mode Edit (Update)
        await nodesService.updateNode(editingNode.id, {
          name: formName.trim(),
          description: formDesc.trim() || null,
          sort_order: Number(formSortOrder),
        })
      } else {
        // Mode Tambah Baru (Create)
        await nodesService.createNode({
          section: currentSection,
          parent_id: sectionRootId,
          node_type: modalType,
          name: formName.trim(),
          description: formDesc.trim() || null,
          sort_order: Number(formSortOrder),
        })
      }

      setIsModalOpen(false)
      await loadData()
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Terjadi kesalahan saat menyimpan.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Membuka konfirmasi hapus aman (cek isi child terlebih dahulu)
  const handleOpenDelete = async (node: Node) => {
    setDeleteTarget(node)
    const { childNodesCount, resourcesCount } = await nodesService.checkHasChildren(node.id)

    if (childNodesCount > 0 || resourcesCount > 0) {
      setDeleteWarning(
        `PERINGATAN: Bagian ini masih memiliki ${childNodesCount} bab turunan dan ${resourcesCount} file materi di dalamnya! Menghapus bagian ini dapat mempengaruhi materi di bawahnya.`
      )
    } else {
      setDeleteWarning(null)
    }
  }

  // Eksekusi Hapus
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return

    try {
      setIsDeleting(true)
      await nodesService.deleteNode(deleteTarget.id)
      setDeleteTarget(null)
      await loadData()
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Gagal menghapus data.')
    } finally {
      setIsDeleting(false)
    }
  }

  const sectionName = currentSection.toUpperCase()

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <LoadingState message={`Memuat manajemen kurikulum ${sectionName}...`} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-800">
      {/* Header Admin */}
      <header className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="text-slate-400 hover:text-white text-xs font-semibold">
              ← Dashboard
            </Link>
            <span className="text-slate-600">/</span>
            <h1 className="font-extrabold text-sm sm:text-base text-white">
              Kelola {sectionName}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/${currentSection}`}
              target="_blank"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              Lihat Tampilan Publik ↗
            </Link>
          </div>
        </div>
      </header>

      {/* Konten Utama */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-8">
        {/* Breadcrumb Admin */}
        <Breadcrumb
          items={[
            { label: 'Admin', path: '/admin' },
            { label: `Kelola ${sectionName}` },
          ]}
        />

        {/* 1. SEKSI FUNDAMENTAL */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base">⚡</span>
                <h2 className="text-lg font-bold text-slate-900">
                  Fundamental {sectionName}
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold">
                  {fundamentals.length} Topik
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Materi dasar wajib paham untuk persiapan {sectionName}.
              </p>
            </div>

            <button
              onClick={() => handleOpenAddModal('fundamental')}
              className="px-3.5 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>+</span>
              <span>Tambah Fundamental</span>
            </button>
          </div>

          {/* Daftar Fundamental */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {fundamentals.map((fund) => (
              <div
                key={fund.id}
                className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-slate-300 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between text-2xs text-slate-400 font-bold mb-1">
                    <span>Urutan: {fund.sort_order}</span>
                    <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-sm">Aktif</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{fund.name}</h3>
                  {fund.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{fund.description}</p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                  <Link
                    to={`/admin/nodes/${fund.id}`}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <span>Kelola Materi</span>
                    <span>→</span>
                  </Link>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(fund)}
                      className="p-1.5 text-xs text-slate-500 hover:text-slate-900 rounded-md hover:bg-slate-200 transition-colors"
                      title="Edit Nama / Urutan"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleOpenDelete(fund)}
                      className="p-1.5 text-xs text-rose-500 hover:text-rose-700 rounded-md hover:bg-rose-100 transition-colors"
                      title="Hapus"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. SEKSI MATA PELAJARAN / SUBTES */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base">📚</span>
                <h2 className="text-lg font-bold text-slate-900">
                  {currentSection === 'tka' ? 'Daftar Mata Pelajaran TKA' : 'Daftar Subtes UTBK-SNBT'}
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold">
                  {subjects.length} Bidang
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Klik tombol "Kelola Materi" untuk masuk ke bab, submateri, dan latihan soal.
              </p>
            </div>

            <button
              onClick={() => handleOpenAddModal('subject')}
              className="px-3.5 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>+</span>
              <span>{currentSection === 'tka' ? 'Tambah Mapel' : 'Tambah Subtes'}</span>
            </button>
          </div>

          {/* Tabel / Grid Subjek */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((sub) => (
              <div
                key={sub.id}
                className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-slate-300 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between text-2xs text-slate-400 font-bold mb-1">
                    <span>Urutan: {sub.sort_order}</span>
                    <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-sm">Aktif</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">{sub.name}</h3>
                  {sub.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{sub.description}</p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link
                    to={`/admin/nodes/${sub.id}`}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <span>Kelola Bab & Materi</span>
                    <span>→</span>
                  </Link>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(sub)}
                      className="p-1.5 text-xs text-slate-500 hover:text-slate-900 rounded-md hover:bg-slate-100 transition-colors"
                      title="Edit Nama / Urutan"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleOpenDelete(sub)}
                      className="p-1.5 text-xs text-rose-500 hover:text-rose-700 rounded-md hover:bg-rose-50 transition-colors"
                      title="Hapus"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* MODAL FORM TAMBAH / EDIT */}
      <Modal
        isOpen={isModalOpen}
        title={editingNode ? `Edit ${editingNode.name}` : `Tambah ${modalType === 'fundamental' ? 'Fundamental' : 'Mata Pelajaran/Subtes'}`}
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={handleSaveForm} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase">
              Nama {modalType === 'fundamental' ? 'Fundamental' : 'Mata Pelajaran'}
            </label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Contoh: Matematika"
              className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              required
              autoFocus
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase">
              Deskripsi Singkat (Opsional)
            </label>
            <textarea
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              placeholder="Penjelasan ringkas kompetensi materi..."
              rows={3}
              className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase">
              Nomor Urutan (Sort Order)
            </label>
            <input
              type="number"
              value={formSortOrder}
              onChange={(e) => setFormSortOrder(Number(e.target.value))}
              className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              required
            />
            <p className="text-2xs text-slate-400">Nomor urut menentukan posisi kartu yang tampil di website.</p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs flex items-center gap-2"
            >
              {isSubmitting && (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              <span>{editingNode ? 'Simpan Perubahan' : 'Tambah Sekarang'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* DIALOG KONFIRMASI HAPUS AMAN (SAFE DELETION) */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title={`Hapus "${deleteTarget?.name}"?`}
        message={
          deleteWarning ||
          'Apakah kamu yakin ingin menghapus data ini? Tindakan ini akan menghapus data secara permanen dari database.'
        }
        confirmText="Hapus Permanen"
        cancelText="Batal"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}