'use client'

import { Button } from '@/components/ui/Button'

const FORMATS = [
  { key: 'json', label: 'JSON', icon: '{ }' },
  { key: 'csv', label: 'CSV', icon: '📊' },
  { key: 'xml', label: 'XML', icon: '</>' },
  { key: 'markdown', label: 'Markdown', icon: '#' },
  { key: 'pdf', label: 'PDF', icon: '📄' },
] as const

type ExportFormat = typeof FORMATS[number]['key']

export function ExportPanel() {
  function handleExport(format: ExportFormat) {
    window.location.href = `/api/export?format=${format}`
  }

  return (
    <div className="flex flex-wrap gap-2">
      <span className="text-sm font-medium text-gray-500 self-center">Export:</span>
      {FORMATS.map(({ key, label, icon }) => (
        <Button
          key={key}
          variant="secondary"
          className="text-xs"
          onClick={() => handleExport(key)}
        >
          <span className="mr-1">{icon}</span>
          {label}
        </Button>
      ))}
    </div>
  )
}
