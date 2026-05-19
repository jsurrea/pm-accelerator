'use client'

import { ReactNode } from 'react'
import { Button } from './Button'

interface ModalProps {
  isOpen: boolean
  title: string
  message?: string
  children?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  confirmVariant?: 'primary' | 'danger'
  onConfirm: () => void
  onCancel: () => void
}

export function Modal({
  isOpen,
  title,
  message,
  children,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'primary',
  onConfirm,
  onCancel,
}: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onCancel}
        aria-hidden="true"
      />
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6 z-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">{title}</h2>
        {message && <p className="text-sm text-gray-600 mb-4">{message}</p>}
        {children && <div className="mb-4">{children}</div>}
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant={confirmVariant} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
