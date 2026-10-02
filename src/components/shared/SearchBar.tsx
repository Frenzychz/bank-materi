import { useState } from 'react'

interface SearchBarProps {
  initialValue?: string
  placeholder?: string
  onSearch: (query: string) => void
  autoFocus?: boolean
  className?: string
}

export default function SearchBar({
  initialValue = '',
  placeholder = 'Cari materi, bab, atau latihan soal...',
  onSearch,
  autoFocus = false,
  className = '',
}: SearchBarProps) {
  const [query, setQuery] = useState(initialValue)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query.trim())
  }

  const handleClear = () => {
    setQuery('')
    onSearch('')
  }

  return (
    <form onSubmit={handleSubmit} className={`relative flex items-center w-full ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full pl-10 sm:pl-11 pr-24 py-2.5 sm:py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 shadow-xs focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
      />

      <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1">
        {query.trim() && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md transition-colors text-xs"
            title="Hapus pencarian"
          >
            ✕
          </button>
        )}
        <button
          type="submit"
          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors shadow-xs"
        >
          Cari
        </button>
      </div>
    </form>
  )
}
