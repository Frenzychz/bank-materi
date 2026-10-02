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
    <nav className="flex items-center text-xs font-mono text-neutral-400 py-2 overflow-x-auto whitespace-nowrap">
      <Link to="/" className="hover:text-white transition-colors flex items-center gap-1">
        <span>Beranda</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <div key={index} className="flex items-center">
            <span className="mx-2 text-neutral-600">/</span>
            {isLast || !item.path ? (
              <span className="font-semibold text-white">
                {item.label}
              </span>
            ) : (
              <Link to={item.path} className="hover:text-white transition-colors">
                {item.label}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}