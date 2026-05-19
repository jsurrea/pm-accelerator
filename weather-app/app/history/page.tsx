'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { SearchForm } from '@/components/history/SearchForm'
import { SearchTable } from '@/components/history/SearchTable'
import { ExportPanel } from '@/components/history/ExportPanel'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { ErrorBanner } from '@/components/ui/ErrorBanner'
import { useSearchHistory } from '@/hooks/useSearchHistory'
import type { Search } from '@/lib/db-queries'

type ViewMode = 'table' | 'create' | 'edit'

export default function HistoryPage() {
  const { searches, isLoading, error, create, update, remove } = useSearchHistory()
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [editingSearch, setEditingSearch] = useState<Search | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  function handleAddNew() {
    setEditingSearch(null)
    setFormError(null)
    setViewMode('create')
  }

  function handleEdit(search: Search) {
    setEditingSearch(search)
    setFormError(null)
    setViewMode('edit')
  }

  function handleCancel() {
    setViewMode('table')
    setEditingSearch(null)
    setFormError(null)
  }

  async function handleCreate(data: {
    location: string
    lat: number
    lon: number
    date_from: string
    date_to: string
  }) {
    await create(data)
    setViewMode('table')
  }

  async function handleUpdate(data: {
    location: string
    lat: number
    lon: number
    date_from: string
    date_to: string
  }) {
    if (!editingSearch) return
    await update(editingSearch.id, data)
    setViewMode('table')
    setEditingSearch(null)
  }

  return (
    <div className="space-y-6">
      <Header />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-800">Search History</h2>
        <div className="flex flex-wrap items-center gap-3">
          <ExportPanel />
          {viewMode === 'table' && (
            <Button variant="primary" onClick={handleAddNew}>
              + Add New Search
            </Button>
          )}
        </div>
      </div>

      {error && <ErrorBanner message={error} />}
      {formError && <ErrorBanner message={formError} />}

      {(viewMode === 'create' || viewMode === 'edit') && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {viewMode === 'create' ? 'New Search Entry' : 'Edit Search Entry'}
          </h3>
          <SearchForm
            mode={viewMode}
            initial={editingSearch ?? undefined}
            onSubmit={viewMode === 'create' ? handleCreate : handleUpdate}
            onCancel={handleCancel}
          />
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : (
        <SearchTable searches={searches} onEdit={handleEdit} onDelete={remove} />
      )}
    </div>
  )
}
