import type { Resource } from '../../types'

interface ResourceCardProps {
  resource: Resource
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  // Menentukan URL tujuan (baik dari link langsung atau path file)
  const targetUrl = resource.url || resource.file_path || '#'

  // Pengaturan tampilan berdasarkan jenis sumber file
  const getSourceBadge = () => {
    switch (resource.source_type) {
      case 'pdf':
        return {
          label: 'PDF Document',
          bgColor: 'bg-rose-50 text-rose-700 border-rose-200',
          btnText: 'Buka PDF',
          btnBg: 'bg-rose-600 hover:bg-rose-700 text-white',
          icon: '📄',
        }
      case 'google_drive':
        return {
          label: 'Google Drive',
          bgColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          btnText: 'Buka Google Drive',
          btnBg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
          icon: '📁',
        }
      case 'youtube':
        return {
          label: 'YouTube Video',
          bgColor: 'bg-red-50 text-red-700 border-red-200',
          btnText: 'Tonton Video',
          btnBg: 'bg-red-600 hover:bg-red-700 text-white',
          icon: '▶️',
        }
    }
  }

  const sourceConfig = getSourceBadge()

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between space-y-4">
      <div className="space-y-2">
        {/* Baris Badge Tipe & Kategori */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Badge Tipe Sumber (PDF / Drive / YouTube) */}
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold border ${sourceConfig.bgColor}`}>
            <span>{sourceConfig.icon}</span>
            <span>{sourceConfig.label}</span>
          </span>

          {/* Badge Kategori (Materi / Latihan Soal) */}
          <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold ${
            resource.category === 'materi'
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}>
            {resource.category === 'materi' ? 'Materi' : 'Latihan Soal'}
          </span>
        </div>

        {/* Judul Konten */}
        <h4 className="font-bold text-slate-900 text-base leading-snug">
          {resource.title}
        </h4>

        {/* Deskripsi (jika ada) */}
        {resource.description && (
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
            {resource.description}
          </p>
        )}
      </div>

      {/* Tombol Buka Resource (selalu terbuka di tab baru) */}
      <div className="pt-2 border-t border-slate-100">
        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors shadow-xs ${sourceConfig.btnBg}`}
        >
          <span>{sourceConfig.btnText}</span>
          <span className="text-xs">↗</span>
        </a>
      </div>
    </div>
  )
}