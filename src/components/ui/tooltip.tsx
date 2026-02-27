import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TooltipProps {
  content: string
  children: ReactNode
  className?: string
}

export function Tooltip({ content, children, className }: TooltipProps) {
  return (
    <div className={cn('relative group inline-flex', className)}>
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 pointer-events-none">
        <div className="bg-foreground text-background text-xs rounded px-2 py-1 whitespace-nowrap shadow">
          {content}
        </div>
        <div className="w-2 h-2 bg-foreground rotate-45 mx-auto -mt-1" />
      </div>
    </div>
  )
}
