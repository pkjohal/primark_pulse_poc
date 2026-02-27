import { useState } from 'react'
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
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen-safe bg-background">
      {/* Top header — full width, fixed */}
      {!hideHeader && (
        <Header onMenuClick={() => setSidebarOpen(true)} />
      )}

      {/* Left sidebar */}
      {!hideNav && (
        <SidebarNav
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main
        className={cn(
          'min-h-screen-safe',
          !hideHeader && 'pt-16',
          !hideNav && 'lg:ml-64',
          className
        )}
      >
        {children}
      </main>
    </div>
  )
}

export { Header } from './Header'
