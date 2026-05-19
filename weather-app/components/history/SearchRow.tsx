'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import type { Search } from '@/lib/db-queries'

interface SearchRowProps {
  search: Search
  onEdit: (search: Search) => void
  onDelete: (id: number) => Promise<void>
}

export function SearchRow({ search, onEdit, onDelete }: SearchRowProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleConfirmDelete() {
    setIsDeleting(true)
    try {
      await onDelete(search.id)
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
    }
  }

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-4 py-3 text-sm text-gray-500">{search.id}</td>
        <td className="px-4 py-3 text-sm font-medium text-gray-900">{search.location}</td>
        <td className="px-4 py-3 text-sm text-gray-600">{search.date_from}</td>
        <td className="px-4 py-3 text-sm text-gray-600">{search.date_to}</td>
        <td className="px-4 py-3 text-sm text-gray-500">
          {new Date(search.created_at).toLocaleDateString()}
        </td>
        <td className="px-4 py-3">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              className="text-xs px-2 py-1"
              onClick={() => onEdit(search)}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              className="text-xs px-2 py-1"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete
            </Button>
          </div>
        </td>
      </tr>

      <Modal
        isOpen={showDeleteModal}
        title="Delete Search"
        message={`Are you sure you want to delete the search for "${search.location}"? This action cannot be undone.`}
        confirmLabel={isDeleting ? 'Deleting...' : 'Delete'}
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </>
  )
}
