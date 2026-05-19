'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-blue-700 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 flex items-center gap-6 h-14">
        <span className="font-bold text-lg">WeatherWise</span>
        <div className="flex gap-1">
          <Link
            href="/"
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              pathname === '/'
                ? 'bg-blue-900 text-white'
                : 'hover:bg-blue-600 text-blue-100'
            }`}
          >
            Current Weather
          </Link>
          <Link
            href="/history"
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              pathname === '/history'
                ? 'bg-blue-900 text-white'
                : 'hover:bg-blue-600 text-blue-100'
            }`}
          >
            Search History
          </Link>
        </div>
      </div>
    </nav>
  )
}
