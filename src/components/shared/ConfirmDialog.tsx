interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isDestructive?: boolean
  isLoading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Ya, Lanjutkan',
  cancelText = 'Batal',
  isDestructive = false,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-150">
        
        {/* Ikon & Judul */}
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
            isDestructive ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
          }`}>
            {isDestructive ? '⚠️' : 'ℹ️'}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base leading-tight">
              {title}
            </h3>
          </div>
        </div>

        {/* Pesan Penjelasan */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {message}
        </p>

        {/* Tombol Aksi Batal & Konfirmasi */}
        <div className="pt-2 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold text-white shadow-xs transition-colors disabled:opacity-50 flex items-center gap-2 ${
              isDestructive
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading && (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            <span>{confirmText}</span>
          </button>
        </div>

      </div>
    </div>
  )
}