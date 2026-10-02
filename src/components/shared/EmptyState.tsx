interface EmptyStateProps {
  title?: string
  description?: string
  icon?: string
  action?: React.ReactNode
}

export default function EmptyState({
  title = 'Belum ada konten tersedia',
  description = 'Materi atau latihan soal untuk bagian ini sedang dalam tahap kurasi dan persiapan.',
  icon = '📂',
  action,
}: EmptyStateProps) {
  return (
    <div className="card-obsidian border border-dashed border-neutral-800 rounded-xl p-8 sm:p-12 text-center space-y-3">
      <div className="text-3xl sm:text-4xl">{icon}</div>
      <h3 className="font-bold text-white text-sm sm:text-base">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
        {description}
      </p>
      {action && <div className="pt-2">{action}</div>}
    </div>
  )
}