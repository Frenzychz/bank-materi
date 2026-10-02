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
          previewText: 'Baca PDF',
          icon: '📄',
        }
      case 'google_drive':
        return {
          label: 'Google Drive',
          previewText: 'Buka Drive',
          icon: '📁',
        }
      case 'youtube':
        return {
          label: 'YouTube Video',
          previewText: 'Tonton di Web',
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
      className={`card-obsidian rounded-xl p-4 sm:p-5 flex flex-col justify-between space-y-4 relative ${
        isHighlighted
          ? 'border-white/60 ring-2 ring-white/20 scale-[1.01]'
          : ''
      }`}
    >
      <div className="space-y-2.5">
        {/* Baris Badge Tipe, Kategori, & Tombol Salin */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Badge Tipe Sumber (PDF / Drive / YouTube) */}
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-2xs font-mono font-medium border bg-neutral-900 text-neutral-300 border-neutral-800">
              <span>{sourceConfig.icon}</span>
              <span>{sourceConfig.label}</span>
            </span>

            {/* Badge Kategori (Materi / Latihan Soal) */}
            <span className="px-2 py-0.5 rounded-md text-2xs font-mono font-medium bg-neutral-900/90 text-neutral-400 border border-neutral-800">
              {resource.category === 'materi' ? 'Materi' : 'Latsol'}
            </span>
          </div>

          {/* Tombol Salin Tautan Cepat */}
          <button
            onClick={handleCopyLink}
            type="button"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 border border-transparent hover:border-neutral-800 transition-colors shrink-0 cursor-pointer"
            title="Salin tautan langsung ke modul ini"
            aria-label="Salin link materi"
          >
            {copied ? (
              <span className="text-2xs font-mono font-bold text-neutral-200 flex items-center gap-1">
                ✓ Disalin
              </span>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        <h4 className="font-bold text-white text-base leading-snug">
          {resource.title}
        </h4>

        {/* Deskripsi (jika ada) */}
        {resource.description && (
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed line-clamp-3">
            {resource.description}
          </p>
        )}
      </div>

      {/* Baris Tombol Aksi: Preview di Web & Buka Tab Baru */}
      <div className="pt-3 border-t border-neutral-900 flex items-center gap-2">
        {onPreview ? (
          <button
            onClick={() => onPreview(resource)}
            type="button"
            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer bg-white hover:bg-neutral-200 text-black hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>{sourceConfig.previewText}</span>
            <span>👁️</span>
          </button>
        ) : (
          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all shadow-xs bg-white hover:bg-neutral-200 text-black hover:-translate-y-0.5 active:translate-y-0"
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
          className="p-2 rounded-lg border border-neutral-800 hover:border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors shrink-0"
          title="Buka langsung di tab baru browser"
        >
          <span className="text-xs font-bold">↗</span>
        </a>
      </div>
    </div>
  )
}