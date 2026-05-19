import { SearchRow } from './SearchRow'
import type { Search } from '@/lib/db-queries'

interface SearchTableProps {
  searches: Search[]
  onEdit: (search: Search) => void
  onDelete: (id: number) => Promise<void>
}

export function SearchTable({ searches, onEdit, onDelete }: SearchTableProps) {
  if (searches.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-lg">
        <p className="text-lg">No searches yet</p>
        <p className="text-sm mt-1">Add a search using the button above</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="w-full text-left">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">ID</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Location</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date From</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date To</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Captured At</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {searches.map((search) => (
            <SearchRow
              key={search.id}
              search={search}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
