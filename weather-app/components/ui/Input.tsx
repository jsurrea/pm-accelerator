'use client'

import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          {...props}
          className={`
            block w-full px-3 py-2 border rounded-md shadow-sm text-sm
            placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500
            ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'}
            disabled:opacity-50 disabled:bg-gray-50
            ${className}
          `}
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
