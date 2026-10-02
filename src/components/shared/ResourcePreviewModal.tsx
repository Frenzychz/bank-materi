import { useEffect } from 'react'
import type { Resource } from '../../types'

interface ResourcePreviewModalProps {
  isOpen: boolean
  resource: Resource | null
  onClose: () => void
}

function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11
    ? `https://www.youtube-nocookie.com/embed/${match[2]}?autoplay=1&rel=0`
    : null
}

function getDriveEmbedUrl(url: string): string | null {
  if (!url) return null
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
  if (match && match[1]) {
    return `https://drive.google.com/file/d/${match[1]}/preview`
  }
  return null
}

export default function ResourcePreviewModal({
  isOpen,
  resource,
  onClose,
}: ResourcePreviewModalProps) {
  // Lock body scroll saat modal aktif
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose()
      }
      window.addEventListener('keydown', handleKeyDown)
      return () => {
        document.body.style.overflow = ''
        window.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [isOpen, onClose])

  if (!isOpen || !resource) return null

  const targetUrl = resource.url || resource.file_path || '#'
  const isYouTube = resource.source_type === 'youtube'
  const isPdf = resource.source_type === 'pdf'
  const isDrive = resource.source_type === 'google_drive'

  const youtubeEmbedUrl = isYouTube ? getYouTubeEmbedUrl(targetUrl) : null
  const driveEmbedUrl = isDrive ? getDriveEmbedUrl(targetUrl) : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0e0e10] rounded-2xl w-full max-w-5xl shadow-2xl border border-neutral-800 flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Header Modal */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-neutral-900 flex items-center justify-between gap-3 bg-[#0a0a0c]">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-xl shrink-0">
              {isYouTube ? '🎬' : isPdf ? '📄' : '📁'}
            </span>
            <div className="min-w-0">
              <h3 className="font-bold text-white text-sm sm:text-base truncate">
                {resource.title}
              </h3>
              <p className="text-2xs font-mono text-neutral-400 capitalize">
                {resource.category === 'materi' ? 'Materi Pembelajaran' : 'Latihan Soal'} •{' '}
                {isYouTube ? 'YouTube Video' : isPdf ? 'Dokumen PDF' : 'Google Drive'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Tombol Buka Tab Baru Eksternal */}
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition-colors"
              title="Buka langsung di tab baru"
            >
              <span>Buka di Tab Baru</span>
              <span>↗</span>
            </a>

            {/* Tombol Tutup */}
            <button
              onClick={onClose}
              type="button"
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              aria-label="Tutup preview"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Isi Preview Konten */}
        <div className="flex-1 bg-black overflow-hidden flex items-center justify-center min-h-[360px] sm:min-h-[500px]">
          {/* 1. YouTube Player */}
          {isYouTube && youtubeEmbedUrl && (
            <div className="w-full h-full aspect-video max-h-[75vh]">
              <iframe
                src={youtubeEmbedUrl}
                title={resource.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          )}

          {/* 2. PDF Viewer */}
          {isPdf && (
            <div className="w-full h-full min-h-[500px] max-h-[78vh] flex flex-col bg-slate-900">
              <iframe
                src={`${targetUrl}#toolbar=1`}
                title={resource.title}
                className="w-full h-full flex-1 border-0"
              />
            </div>
          )}

          {/* 3. Google Drive Preview */}
          {isDrive && driveEmbedUrl && (
            <div className="w-full h-full min-h-[500px] max-h-[78vh] flex flex-col bg-slate-900">
              <iframe
                src={driveEmbedUrl}
                title={resource.title}
                className="w-full h-full flex-1 border-0"
                allow="autoplay"
              />
            </div>
          )}

          {/* Fallback jika URL tidak mendukung embed langsung */}
          {((isYouTube && !youtubeEmbedUrl) || (isDrive && !driveEmbedUrl)) && (
            <div className="text-center p-8 space-y-4 bg-slate-900 text-white w-full">
              <span className="text-4xl block">🔗</span>
              <h4 className="text-base font-bold">Preview Tidak Dapat Dimuat Otomatis</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Tautan materi ini dapat dibuka langsung di aplikasi/situs resminya.
              </p>
              <a
                href={targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
              >
                <span>Buka Materi di Tab Baru</span>
                <span>↗</span>
              </a>
            </div>
          )}
        </div>

        {/* Footer Modal Ringkas */}
        <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="truncate max-w-xs sm:max-w-md">
            {resource.description || 'Fokus belajar tanpa gangguan iklan & algoritma.'}
          </span>
          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="sm:hidden text-blue-600 dark:text-blue-400 font-semibold"
          >
            Tab Baru ↗
          </a>
        </div>

      </div>
    </div>
  )
}
