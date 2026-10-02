import { useState } from 'react'
import type { Resource } from '../../types'

interface ResourceCardProps {
  resource: Resource
  onPreview?: (resource: Resource) => void
  isHighlighted?: boolean
}

export default function ResourceCard({
  resource,
  onPreview,
  isHighlighted = false,
}: ResourceCardProps) {
  const [copied, setCopied] = useState(false)

  // Menentukan URL tujuan
  const targetUrl = resource.url || resource.file_path || '#'

  // Pengaturan tampilan berdasarkan jenis sumber file
  const getSourceBadge = () => {
    switch (resource.source_type) {
      case 'pdf':
        return {
          label: 'PDF Document',
          bgColor: 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
          previewText: 'Baca PDF',
          btnBg: 'bg-rose-600 hover:bg-rose-700 text-white',
          icon: '📄',
        }
      case 'google_drive':
        return {
          label: 'Google Drive',
          bgColor: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
          previewText: 'Buka Drive',
          btnBg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
          icon: '📁',
        }
      case 'youtube':
        return {
          label: 'YouTube Video',
          bgColor: 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
          previewText: 'Tonton di Web',
          btnBg: 'bg-red-600 hover:bg-red-700 text-white',
          icon: '▶️',
        }
    }
  }

  const sourceConfig = getSourceBadge()

  // Salin link langsung ke materi ini
  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const fullUrl = `${window.location.origin}${window.location.pathname}#res-${resource.id}`
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  return (
    <div
      id={`res-${resource.id}`}
      className={`bg-white dark:bg-slate-900 border rounded-xl p-4 sm:p-5 shadow-xs transition-all duration-300 flex flex-col justify-between space-y-4 relative ${
        isHighlighted
          ? 'border-blue-500 ring-4 ring-blue-500/30 dark:ring-blue-500/20 scale-[1.01]'
          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div className="space-y-2.5">
        {/* Baris Badge Tipe, Kategori, & Tombol Salin */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Badge Tipe Sumber (PDF / Drive / YouTube) */}
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border ${sourceConfig.bgColor}`}
            >
              <span>{sourceConfig.icon}</span>
              <span>{sourceConfig.label}</span>
            </span>

            {/* Badge Kategori (Materi / Latihan Soal) */}
            <span
              className={`px-2 py-0.5 rounded-md text-xs font-semibold ${
                resource.category === 'materi'
                  ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                  : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
              }`}
            >
              {resource.category === 'materi' ? 'Materi' : 'Latsol'}
            </span>
          </div>

          {/* Tombol Salin Tautan Cepat */}
          <button
            onClick={handleCopyLink}
            type="button"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
            title="Salin tautan langsung ke modul ini"
            aria-label="Salin link materi"
          >
            {copied ? (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                ✓ Disalin
              </span>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Judul Konten */}
        <h4 className="font-bold text-slate-900 dark:text-white text-base leading-snug">
          {resource.title}
        </h4>

        {/* Deskripsi (jika ada) */}
        {resource.description && (
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
            {resource.description}
          </p>
        )}
      </div>

      {/* Baris Tombol Aksi: Preview di Web & Buka Tab Baru */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
        {onPreview ? (
          <button
            onClick={() => onPreview(resource)}
            type="button"
            className={`flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors shadow-xs cursor-pointer ${sourceConfig.btnBg}`}
          >
            <span>{sourceConfig.previewText}</span>
            <span>👁️</span>
          </button>
        ) : (
          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors shadow-xs ${sourceConfig.btnBg}`}
          >
            <span>Buka Langsung</span>
            <span className="text-xs">↗</span>
          </a>
        )}

        {/* Tombol Tab Baru Mini */}
        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors shrink-0"
          title="Buka langsung di tab baru browser"
        >
          <span className="text-xs font-bold">↗</span>
        </a>
      </div>
    </div>
  )
}