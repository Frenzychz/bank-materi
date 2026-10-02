import type { Resource } from '../../types'

interface DraggableResourceCardProps {
  res: Resource
  index: number
  total: number
  isDragging: boolean
  isDragOver: boolean
  onDragStart: () => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
  onDragEnd: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onEdit: () => void
  onDelete: () => void
}

export default function DraggableResourceCard({
  res,
  index,
  total,
  isDragging,
  isDragOver,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onMoveUp,
  onMoveDown,
  onEdit,
  onDelete,
}: DraggableResourceCardProps) {
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
      <div className="space-y-2">
        {/* Baris Atas: Drag Handle + Panah Geser + Badge Status */}
        <div className="flex items-center justify-between gap-1 text-2xs">
          <div className="flex items-center gap-1.5">
            <span
              className="cursor-grab active:cursor-grabbing p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Seret / Drag untuk memindahkan posisi materi"
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

            {/* Tombol Geser Cepat */}
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

            <span className="text-slate-400 font-bold ml-1">#{index + 1}</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-2xs uppercase px-1.5 py-0.5 rounded-sm font-bold bg-slate-100 text-slate-600">
              {res.source_type.replace('_', ' ')}
            </span>
            <span
              className={`text-2xs font-bold px-1.5 py-0.5 rounded-sm ${
                res.status === 'published'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-amber-50 text-amber-700'
              }`}
            >
              {res.status.toUpperCase()}
            </span>
          </div>
        </div>

        <h4 className="font-bold text-slate-900 text-sm leading-snug">{res.title}</h4>
        {res.description && (
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {res.description}
          </p>
        )}
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
        <a
          href={res.url || res.file_path || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold text-blue-600 hover:underline"
        >
          Buka Link ↗
        </a>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onEdit}
            className="p-1.5 text-xs text-slate-500 hover:text-slate-900 rounded-md hover:bg-slate-100 transition-colors"
            title="Edit Materi"
          >
            ✏️
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="p-1.5 text-xs text-rose-500 hover:text-rose-700 rounded-md hover:bg-rose-50 transition-colors"
            title="Hapus Materi"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  )
}
