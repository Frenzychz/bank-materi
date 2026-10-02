import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Breadcrumb from '../../components/shared/Breadcrumb'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/shared/ConfirmDialog'
import LoadingState from '../../components/shared/LoadingState'
import SortableNodeGrid from '../../components/admin/SortableNodeGrid'
import { nodesService } from '../../services/nodes.service'
import type { Section, Node, NodeType, SubjectGroup } from '../../types'
import { isTkaWajib, cleanDescription } from '../../types'

export default function SectionAdminPage() {
  const location = useLocation()
  const currentSection: Section = location.pathname.startsWith('/admin/tka') ? 'tka' : 'snbt'

  const [loading, setLoading] = useState(true)
  const [fundamentals, setFundamentals] = useState<Node[]>([])
  const [subjects, setSubjects] = useState<Node[]>([])

  // State untuk Notifikasi Feedback Reorder (Drag & Drop)
  const [reorderFeedback, setReorderFeedback] = useState<string | null>(null)

  // State untuk Modal Form Tambah/Edit
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingNode, setEditingNode] = useState<Node | null>(null)
  const [modalType, setModalType] = useState<NodeType>('subject')
  const [formGroup, setFormGroup] = useState<SubjectGroup>('wajib')
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
  const handleOpenAddModal = (type: NodeType, group: SubjectGroup = 'wajib') => {
    setEditingNode(null)
    setModalType(type)
    setFormGroup(group)
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
    setFormGroup(isTkaWajib(node) ? 'wajib' : 'pilihan')
    setFormName(node.name)
    setFormDesc(cleanDescription(node.description) || '')
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

      // Susun deskripsi dengan tag penanda kelompok jika di TKA
      let finalDesc = formDesc.trim()
      if (currentSection === 'tka' && modalType === 'subject') {
        const cleaned = cleanDescription(finalDesc) || ''
        finalDesc = `[${formGroup}] ${cleaned}`.trim()
      }

      if (editingNode) {
        // Mode Edit (Update)
        await nodesService.updateNode(editingNode.id, {
          name: formName.trim(),
          description: finalDesc || null,
          sort_order: Number(formSortOrder),
        })
      } else {
        // Mode Tambah Baru (Create)
        await nodesService.createNode({
          section: currentSection,
          parent_id: sectionRootId,
          node_type: modalType,
          name: formName.trim(),
          description: finalDesc || null,
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

  // Handle Drag and Drop Reorder
  const handleReorder = async (category: 'fundamental' | 'wajib' | 'pilihan' | 'subject', reorderedList: Node[]) => {
    if (category === 'fundamental') {
      setFundamentals(reorderedList)
    } else if (category === 'wajib') {
      const other = subjects.filter((s) => !isTkaWajib(s))
      setSubjects([...reorderedList, ...other])
    } else if (category === 'pilihan') {
      const other = subjects.filter((s) => isTkaWajib(s))
      setSubjects([...other, ...reorderedList])
    } else {
      setSubjects(reorderedList)
    }

    setReorderFeedback('Menyimpan urutan baru...')

    try {
      await nodesService.reorderNodes(reorderedList.map((n) => n.id))
      setReorderFeedback('✓ Urutan berhasil diperbarui!')
      setTimeout(() => setReorderFeedback(null), 2500)
    } catch {
      setReorderFeedback('❌ Gagal menyimpan urutan.')
      setTimeout(() => setReorderFeedback(null), 3000)
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
      alert(err instanceof Error ? err.message : 'Gagal menghapus bagian.')
    } finally {
      setIsDeleting(false)
    }
  }

  const sectionName = currentSection.toUpperCase()
  const wajibSubjects = subjects.filter((s) => isTkaWajib(s))
  const pilihanSubjects = subjects.filter((s) => !isTkaWajib(s))

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
        {/* Breadcrumb Admin & Feedback Toast */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Breadcrumb
            items={[
              { label: 'Admin', path: '/admin' },
              { label: `Kelola ${sectionName}` },
            ]}
          />

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
            <strong>Tips Pengurutan:</strong> Kamu bisa langsung <strong>menyeret (drag & drop)</strong> kartu dengan mouse atau menekan tombol panah <strong>◀ / ▶</strong> untuk memindahkan posisi kartu secara instan.
          </p>
        </div>

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
                Materi dasar wajib paham untuk persiapan {sectionName}. Geser kartu untuk mengatur urutan.
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

          <SortableNodeGrid
            nodes={fundamentals}
            onReorder={(newNodes) => handleReorder('fundamental', newNodes)}
            onEdit={handleOpenEditModal}
            onDelete={handleOpenDelete}
            badge="Fundamental"
            badgeColor="bg-amber-50 text-amber-800 border-amber-200"
          />
        </section>

        {/* 2. SEKSI MATA PELAJARAN (TKA: DIPISAH WAJIB & PILIHAN, SNBT: UTBK SUBTES) */}
        {currentSection === 'tka' ? (
          <div className="space-y-8">
            {/* A. MATERI TKA WAJIB */}
            <section className="bg-white border-2 border-blue-100 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base">📘</span>
                    <h2 className="text-lg font-bold text-slate-900">
                      Materi TKA Wajib
                    </h2>
                    <span className="text-xs px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold">
                      {wajibSubjects.length} Mata Pelajaran
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Mata pelajaran wajib untuk seluruh jurusan (Matematika, B. Indonesia, B. Inggris). Geser kartu untuk menata urutan.
                  </p>
                </div>

                <button
                  onClick={() => handleOpenAddModal('subject', 'wajib')}
                  className="px-3.5 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <span>+</span>
                  <span>Tambah Mapel Wajib</span>
                </button>
              </div>

              <SortableNodeGrid
                nodes={wajibSubjects}
                onReorder={(newNodes) => handleReorder('wajib', newNodes)}
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDelete}
                badge="Wajib"
                badgeColor="bg-blue-50 text-blue-700 border-blue-200"
              />
            </section>

            {/* B. MATERI TKA PILIHAN */}
            <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base">🧪</span>
                    <h2 className="text-lg font-bold text-slate-900">
                      Materi TKA Pilihan
                    </h2>
                    <span className="text-xs px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold">
                      {pilihanSubjects.length} Mata Pelajaran
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Mata pelajaran peminatan/jurusan (Fisika, Kimia, Biologi, Mat Lanjut, dll). Geser kartu untuk menata urutan.
                  </p>
                </div>

                <button
                  onClick={() => handleOpenAddModal('subject', 'pilihan')}
                  className="px-3.5 py-2 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <span>+</span>
                  <span>Tambah Mapel Pilihan</span>
                </button>
              </div>

              <SortableNodeGrid
                nodes={pilihanSubjects}
                onReorder={(newNodes) => handleReorder('pilihan', newNodes)}
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDelete}
                badge="Pilihan"
                badgeColor="bg-slate-100 text-slate-700 border-slate-200"
              />
            </section>
          </div>
        ) : (
          /* UNTUK SNBT: DAFTAR SUBTES UTBK */
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base">📚</span>
                  <h2 className="text-lg font-bold text-slate-900">
                    Daftar Subtes UTBK-SNBT
                  </h2>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 font-bold">
                    {subjects.length} Subtes
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Seluruh subtes skolastik dan literasi UTBK. Geser kartu untuk menata urutan.
                </p>
              </div>

              <button
                onClick={() => handleOpenAddModal('subject')}
                className="px-3.5 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
              >
                <span>+</span>
                <span>Tambah Subtes</span>
              </button>
            </div>

            <SortableNodeGrid
              nodes={subjects}
              onReorder={(newNodes) => handleReorder('subject', newNodes)}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDelete}
              badge="Subtes"
              badgeColor="bg-indigo-50 text-indigo-700 border-indigo-200"
            />
          </section>
        )}
      </main>

      {/* MODAL TAMBAH / EDIT NODE */}
      <Modal
        isOpen={isModalOpen}
        title={editingNode ? `Edit ${editingNode.name}` : `Tambah ${modalType === 'fundamental' ? 'Fundamental' : 'Mata Pelajaran'}`}
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={handleSaveForm} className="space-y-4">
          {/* Pilihan Kelompok Wajib / Pilihan jika di TKA dan bertipe subject */}
          {currentSection === 'tka' && modalType === 'subject' && (
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Kelompok Mata Pelajaran
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormGroup('wajib')}
                  className={`px-3 py-2 rounded-lg text-xs font-bold border transition-colors ${
                    formGroup === 'wajib'
                      ? 'bg-blue-50 border-blue-600 text-blue-700 ring-2 ring-blue-500/20'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  📘 Wajib (Semua Jurusan)
                </button>
                <button
                  type="button"
                  onClick={() => setFormGroup('pilihan')}
                  className={`px-3 py-2 rounded-lg text-xs font-bold border transition-colors ${
                    formGroup === 'pilihan'
                      ? 'bg-slate-100 border-slate-700 text-slate-800 ring-2 ring-slate-400/20'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  🧪 Pilihan (Peminatan)
                </button>
              </div>
            </div>
          )}

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
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? 'Menyimpan...' : editingNode ? 'Simpan Perubahan' : 'Tambah'}
            </button>
          </div>
        </form>
      </Modal>

      {/* DIALOG KONFIRMASI HAPUS AMAN */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title={`Hapus ${deleteTarget?.name}?`}
        message={
          deleteWarning ||
          `Apakah kamu yakin ingin menghapus "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`
        }
        confirmText="Ya, Hapus Sekarang"
        cancelText="Batal"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}