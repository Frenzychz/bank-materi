import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Cek apakah user sudah dismiss baru-baru ini
    const dismissedUntil = localStorage.getItem('bank_materi_pwa_dismissed')
    if (dismissedUntil && new Date().getTime() < Number(dismissedUntil)) {
      return
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setIsVisible(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const choiceResult = await deferredPrompt.userChoice
    if (choiceResult.outcome === 'accepted') {
      setIsVisible(false)
    }
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setIsVisible(false)
    // Sembunyikan selama 5 hari
    const expireTime = new Date().getTime() + 5 * 24 * 60 * 60 * 1000
    localStorage.setItem('bank_materi_pwa_dismissed', String(expireTime))
  }

  if (!isVisible || !deferredPrompt) return null

  return (
    <aside
      aria-label="Install Aplikasi"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-40 bg-white dark:bg-slate-900 border-2 border-blue-500/50 dark:border-blue-400/40 rounded-2xl p-4 shadow-2xl animate-in slide-in-from-bottom duration-300"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
            📲
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
              Pasang Aplikasi di HP
            </h4>
            <p className="text-2xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
              Buka materi lebih cepat, layar penuh tanpa bar URL browser.
            </p>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          type="button"
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs p-1"
          aria-label="Tutup saran instalasi"
        >
          ✕
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={handleInstallClick}
          type="button"
          className="flex-1 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>Install Sekarang</span>
          <span>↓</span>
        </button>
        <button
          onClick={handleDismiss}
          type="button"
          className="py-2 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
        >
          Nanti Saja
        </button>
      </div>
    </aside>
  )
}
