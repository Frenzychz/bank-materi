import { Link } from 'react-router-dom'

export interface BreadcrumbItem {
  label: string
  path?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center text-xs sm:text-sm text-slate-500 dark:text-slate-400 py-3 overflow-x-auto whitespace-nowrap">
      <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1">
        <span>🏠</span>
        <span>Beranda</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <div key={index} className="flex items-center">
            <span className="mx-2 text-slate-400 dark:text-slate-600">/</span>
            {isLast || !item.path ? (
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {item.label}
              </span>
            ) : (
              <Link to={item.path} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {item.label}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}