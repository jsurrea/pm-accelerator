import { ReactNode } from 'react'

type BadgeColor = 'blue' | 'green' | 'yellow' | 'red' | 'gray' | 'purple'

interface BadgeProps {
  children: ReactNode
  color?: BadgeColor
  className?: string
}

const colorClasses: Record<BadgeColor, string> = {
  blue: 'bg-blue-100 text-blue-800',
  green: 'bg-green-100 text-green-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  red: 'bg-red-100 text-red-800',
  gray: 'bg-gray-100 text-gray-800',
  purple: 'bg-purple-100 text-purple-800',
}

export function Badge({ children, color = 'blue', className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        ${colorClasses[color]} ${className}
      `}
    >
      {children}
    </span>
  )
}
