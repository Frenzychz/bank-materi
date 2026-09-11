interface ModalProps {
  isOpen: boolean
  title: string
  onClose: () => void
  children: React.ReactNode
}

export default function Modal({ isOpen, title, onClose, children }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8 animate-in fade-in zoom-in duration-150">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-extrabold text-slate-900 text-lg leading-tight">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center text-lg font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Isi Form / Konten */}
        <div>
          {children}
        </div>

      </div>
    </div>
  )
}