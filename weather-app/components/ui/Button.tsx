'use client'

import { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  children: ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white border-transparent',
  secondary: 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300',
  danger: 'bg-red-600 hover:bg-red-700 text-white border-transparent',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-600 border-transparent',
}

export function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`
        inline-flex items-center justify-center px-4 py-2 text-sm font-medium
        border rounded-md transition-colors duration-150 focus:outline-none
        focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  )
}
