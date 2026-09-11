interface LoadingStateProps {
  message?: string
}

export default function LoadingState({ message = 'Memuat data materi...' }: LoadingStateProps) {
  return (
    <div className="py-16 flex flex-col items-center justify-center space-y-4">
      {/* Animasi Spinner Berputar Modern */}
      <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-xs sm:text-sm text-slate-500 font-medium">
        {message}
      </p>
    </div>
  )
}