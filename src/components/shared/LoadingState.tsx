interface LoadingStateProps {
  message?: string
}

export default function LoadingState({ message = 'Memuat data materi...' }: LoadingStateProps) {
  return (
    <div className="py-16 flex flex-col items-center justify-center space-y-4">
      {/* Animasi Spinner Berputar Monokrom */}
      <div className="w-8 h-8 border-2 border-neutral-800 border-t-white rounded-full animate-spin" />
      <p className="text-xs font-mono text-neutral-400">
        {message}
      </p>
    </div>
  )
}