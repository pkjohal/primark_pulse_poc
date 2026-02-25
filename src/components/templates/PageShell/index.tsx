import { ReactNode } from 'react'
import { Header } from './Header'
import { BottomNav } from '@/components/custom/bottom-nav'
import { cn } from '@/lib/utils'

interface PageShellProps {
  children: ReactNode
  className?: string
  hideHeader?: boolean
  hideNav?: boolean
}

export function PageShell({
  children,
  className,
  hideHeader = false,
  hideNav = false,
}: PageShellProps) {
  return (
    <div className="min-h-screen-safe bg-background flex flex-col">
      {/* Header */}
      {!hideHeader && <Header />}

      {/* Main content area with safe padding */}
      <main
        className={cn(
          'flex-1 overflow-y-auto',
          !hideHeader && 'pt-14', // Header height
          !hideNav && 'pb-nav-safe', // Bottom nav height + safe area (uses CSS calc)
          className
        )}
      >
        {children}
      </main>

      {/* Bottom Navigation */}
      {!hideNav && <BottomNav />}
    </div>
  )
}

export { Header } from './Header'
