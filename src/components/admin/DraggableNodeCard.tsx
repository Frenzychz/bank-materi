import { Link } from 'react-router-dom'
import type { Node } from '../../types'
import { cleanDescription } from '../../types'

interface DraggableNodeCardProps {
  node: Node
  index: number
  total: number
  isDragging: boolean
  isDragOver: boolean
  badge?: string
  badgeColor?: string
  onDragStart: () => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
  onDragEnd: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onEdit: () => void
  onDelete: () => void
}

export default function DraggableNodeCard({
  node,
  index,
  total,
  isDragging,
  isDragOver,
  badge,
  badgeColor = 'bg-blue-50 text-blue-700 border-blue-200',
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onMoveUp,
  onMoveDown,
  onEdit,
  onDelete,
}: DraggableNodeCardProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={`bg-white border rounded-xl p-4 flex flex-col justify-between space-y-3 transition-all select-none ${
        isDragging
          ? 'opacity-40 border-dashed border-blue-500 scale-95 shadow-none'
          : isDragOver
          ? 'border-blue-600 ring-2 ring-blue-500/20 scale-[1.02] shadow-md'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
      }`}
    >
      <div>
        {/* Baris Atas: Drag Handle + Urutan + Status + Tombol Naik/Turun */}
        <div className="flex items-center justify-between text-2xs font-bold mb-2 gap-1">
          <div className="flex items-center gap-1.5">
            {/* Handle Drag */}
            <span
              className="cursor-grab active:cursor-grabbing p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Seret / Drag untuk memindahkan posisi"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="5" cy="3" r="1.5" />
                <circle cx="11" cy="3" r="1.5" />
                <circle cx="5" cy="8" r="1.5" />
                <circle cx="11" cy="8" r="1.5" />
                <circle cx="5" cy="13" r="1.5" />
                <circle cx="11" cy="13" r="1.5" />
              </svg>
            </span>

            {/* Tombol Geser Cepat (Touch/Click) */}
            <div className="flex items-center bg-slate-100 rounded-md p-0.5">
              <button
                type="button"
                onClick={onMoveUp}
                disabled={index === 0}
                className="px-1 py-0.5 text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed text-2xs"
                title="Geser ke kiri / atas"
              >
                ◀
              </button>
              <button
                type="button"
                onClick={onMoveDown}
                disabled={index === total - 1}
                className="px-1 py-0.5 text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed text-2xs"
                title="Geser ke kanan / bawah"
              >
                ▶
              </button>
            </div>

            <span className="text-slate-400 ml-1">#{index + 1}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {badge && (
              <span className={`px-2 py-0.5 rounded-md text-2xs font-bold border ${badgeColor}`}>
                {badge}
              </span>
            )}
            <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded-sm">
              Aktif
            </span>
          </div>
        </div>

        {/* Judul & Deskripsi */}
        <h3 className="font-bold text-slate-900 text-sm">{node.name}</h3>
        {node.description && (
          <p className="text-xs text-slate-500 line-clamp-2 mt-1">
            {cleanDescription(node.description)}
          </p>
        )}
      </div>

      {/* Baris Bawah: Link Masuk & Tombol Edit/Hapus */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
        <Link
          to={`/admin/nodes/${node.id}`}
          className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <span>Kelola Materi</span>
          <span>→</span>
        </Link>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onEdit}
            className="p-1.5 text-xs text-slate-500 hover:text-slate-900 rounded-md hover:bg-slate-100 transition-colors"
            title="Edit Nama / Keterangan"
          >
            ✏️
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="p-1.5 text-xs text-rose-500 hover:text-rose-700 rounded-md hover:bg-rose-50 transition-colors"
            title="Hapus"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  )
}
