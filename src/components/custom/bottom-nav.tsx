import { useLocation, useNavigate } from 'react-router-dom'
import { Home, MessageSquare, Briefcase, Package, ClipboardCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { NavItem } from '@/types'

interface NavItemConfig {
  id: NavItem
  label: string
  icon: typeof Home
  path: string
}

const navItems: NavItemConfig[] = [
  { id: 'home', label: 'Home', icon: Home, path: '/' },
  { id: 'team', label: 'Teams', icon: MessageSquare, path: '/team' },
  { id: 'jobs', label: 'Jobs', icon: Briefcase, path: '/jobs' },
  { id: 'stock', label: 'Stock', icon: Package, path: '/stock' },
  { id: 'compliance', label: 'Compliance', icon: ClipboardCheck, path: '/compliance' },
]

export function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const active = isActive(item.path)
          const Icon = item.icon

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={cn(
                'relative flex flex-col items-center justify-center gap-1',
                'min-w-touch min-h-touch px-3 py-2',
                'transition-all duration-200 touch-manipulation',
                active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
              aria-current={active ? 'page' : undefined}
            >
              {/* Active indicator background */}
              {active && (
                <span className="absolute inset-x-2 top-1 bottom-1 bg-primary/10 rounded-lg -z-10" />
              )}
              <Icon
                className={cn(
                  'w-6 h-6 transition-transform',
                  active && 'scale-110'
                )}
                strokeWidth={active ? 2.5 : 2}
              />
              <span className={cn(
                'text-sm',
                active ? 'font-semibold' : 'font-normal'
              )}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
