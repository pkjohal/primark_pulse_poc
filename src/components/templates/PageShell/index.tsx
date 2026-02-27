import { ReactNode } from 'react'
import { Header } from './Header'
import { SidebarNav } from '@/components/custom/sidebar-nav'
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
    <div className="min-h-screen-safe bg-background">
      {/* Top header — full width, fixed */}
      {!hideHeader && <Header />}

      {/* Left sidebar — fixed, below header */}
      {!hideNav && <SidebarNav />}

      {/* Main content — offset right of sidebar, below header */}
      <main
        className={cn(
          'min-h-screen-safe',
          !hideHeader && 'pt-16',
          !hideNav && 'ml-64',
          className
        )}
      >
        {children}
      </main>
    </div>
  )
}

export { Header } from './Header'
