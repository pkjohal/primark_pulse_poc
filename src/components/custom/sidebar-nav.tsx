import { useNavigate, useLocation } from 'react-router-dom'
import {
  Home,
  Users,
  ClipboardList,
  TrendingUp,
  Package,
  ScanLine,
  Shield,
  BarChart3,
  Calendar,
  MessageSquare,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface MenuItem {
  icon: LucideIcon
  label: string
  path: string
}

interface MenuGroup {
  label: string
  items: MenuItem[]
}

const navGroups: MenuGroup[] = [
  {
    label: 'My Day',
    items: [
      { icon: Home,     label: 'Store Overview', path: '/'         },
      { icon: Calendar, label: 'My Schedule',    path: '/schedule' },
    ],
  },
  {
    label: 'People & Comms',
    items: [
      { icon: Users,         label: 'Staff Overview', path: '/staff' },
      { icon: MessageSquare, label: 'Team Comms',     path: '/team'  },
    ],
  },
  {
    label: 'Operations',
    items: [
      { icon: ClipboardList, label: 'Job Management',  path: '/jobs'   },
      { icon: TrendingUp,    label: 'Queues & Demand', path: '/queues' },
    ],
  },
  {
    label: 'Stock',
    items: [
      { icon: ScanLine, label: 'Scan Stock',           path: '/scan-stock' },
      { icon: Package,  label: 'Stock & Availability', path: '/stock'      },
    ],
  },
  {
    label: 'Compliance & Reporting',
    items: [
      { icon: Shield,    label: 'Compliance',           path: '/compliance' },
      { icon: BarChart3, label: 'Performance Insights', path: '/insights'   },
    ],
  },
]

export function SidebarNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-border-grey z-40 flex flex-col overflow-hidden">
      <nav className="flex-1 overflow-y-auto py-3">
        {navGroups.map((group, groupIndex) => (
          <div key={group.label} className={cn('px-3', groupIndex > 0 && 'mt-1')}>
            <p className="text-xs font-semibold text-mid-grey uppercase tracking-wider px-2 py-2">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon
                const active = isActive(item.path)

                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={cn(
                      'flex items-center gap-3 w-full px-2 py-2.5 rounded-lg text-left transition-colors',
                      active
                        ? 'bg-primark-blue-light text-primark-blue-dark font-medium'
                        : 'text-charcoal hover:bg-light-grey'
                    )}
                  >
                    <div className={cn(
                      'p-1.5 rounded-md shrink-0',
                      active ? 'bg-primark-blue text-white' : 'bg-light-grey text-mid-grey'
                    )}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm flex-1">{item.label}</span>
                    {active && <ChevronRight className="w-3.5 h-3.5 shrink-0 text-primark-blue" />}
                  </button>
                )
              })}
            </div>

            {/* Divider between groups */}
            {groupIndex < navGroups.length - 1 && (
              <div className="border-t border-border-grey mx-2 mt-2" />
            )}
          </div>
        ))}
      </nav>
    </aside>
  )
}
