import { useNavigate, useLocation } from 'react-router-dom'
import {
  Home,
  Users,
  ClipboardList,
  TrendingUp,
  Package,
  Shield,
  BarChart3,
  Brain,
  Zap,
  Clock,
  Target,
  AlertTriangle,
  Play,
  Award,
  Heart,
  ChevronRight,
  Calendar,
  MessageSquare,
} from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface MenuItem {
  icon: LucideIcon
  label: string
  path?: string
  description?: string
  status: 'active' | 'coming-soon' | 'preview'
}

interface MenuGroup {
  label: string
  items: MenuItem[]
}

const navGroups: MenuGroup[] = [
  {
    label: 'My Day',
    items: [
      { icon: Home,     label: 'Store Overview', path: '/',         status: 'active' },
      { icon: Calendar, label: 'My Schedule',    path: '/schedule', status: 'active' },
    ],
  },
  {
    label: 'People & Comms',
    items: [
      { icon: Users,         label: 'Staff Overview', path: '/staff', status: 'active' },
      { icon: MessageSquare, label: 'Team Comms',     path: '/team',  status: 'active' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { icon: ClipboardList, label: 'Job Management',    path: '/jobs',   status: 'active' },
      { icon: TrendingUp,    label: 'Queues & Demand',   path: '/queues', status: 'active' },
    ],
  },
  {
    label: 'Stock & Compliance',
    items: [
      { icon: Package, label: 'Stock & Availability', path: '/stock',      status: 'active' },
      { icon: Shield,  label: 'Compliance',           path: '/compliance', status: 'active' },
    ],
  },
  {
    label: 'Analytics',
    items: [
      { icon: BarChart3, label: 'Performance Insights', path: '/insights', status: 'active' },
    ],
  },
]

const intelligenceLayer: MenuItem[] = [
  { icon: Brain,         label: 'Decision Engine', description: 'AI-powered suggestions', status: 'preview' },
  { icon: Zap,           label: 'Automation',      description: 'Smart defaults & rules',  status: 'preview' },
  { icon: Clock,         label: 'Forecasting',     description: 'Predictive demand',        status: 'preview' },
  { icon: Target,        label: 'Prioritisation',  description: 'Value scoring',            status: 'preview' },
  { icon: AlertTriangle, label: 'Alerts',           description: 'Smart notifications',     status: 'preview' },
  { icon: Play,          label: 'Replay',           description: 'Shift analysis',          status: 'preview' },
  { icon: Award,         label: 'Skills',           description: 'Optimisation',            status: 'preview' },
  { icon: Heart,         label: 'Sentiment',        description: 'Experience signals',      status: 'preview' },
]

interface NavigationDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NavigationDrawer({ open, onOpenChange }: NavigationDrawerProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleNavigation = (item: MenuItem) => {
    if (item.status === 'active' && item.path) {
      navigate(item.path)
      onOpenChange(false)
    }
  }

  const isCurrentPath = (path?: string) => {
    if (!path) return false
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-80 p-0"
        closeClassName="text-white hover:text-white/80"
        onSwipeClose={() => onOpenChange(false)}
      >
        {/* Header */}
        <SheetHeader className="bg-navy text-white p-4 border-b-0">
          <SheetTitle className="text-white text-lg font-bold">Navigation</SheetTitle>
        </SheetHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pb-24">

          {/* Grouped nav sections */}
          {navGroups.map((group, groupIndex) => (
            <div key={group.label} className={cn('px-4', groupIndex === 0 ? 'pt-4' : 'pt-2')}>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-1.5">
                {group.label}
              </p>
              <div className="space-y-0.5 mb-3">
                {group.items.map((item) => {
                  const Icon = item.icon
                  const isCurrent = isCurrentPath(item.path)

                  return (
                    <button
                      key={item.label}
                      onClick={() => handleNavigation(item)}
                      className={cn(
                        'flex items-center gap-3 w-full p-3 rounded-xl text-left transition-colors',
                        'hover:bg-muted cursor-pointer',
                        isCurrent && 'bg-primary/5'
                      )}
                    >
                      <div className={cn(
                        'p-2 rounded-lg shrink-0',
                        isCurrent ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
                      )}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={cn(
                        'text-sm flex-1',
                        isCurrent ? 'font-semibold text-foreground' : 'font-medium text-foreground'
                      )}>
                        {item.label}
                      </span>
                      <ChevronRight className={cn(
                        'w-4 h-4 shrink-0',
                        isCurrent ? 'text-primary' : 'text-muted-foreground'
                      )} />
                    </button>
                  )
                })}
              </div>

              {/* Divider between groups (not after last active group) */}
              {groupIndex < navGroups.length - 1 && (
                <div className="border-t border-border mx-1 mb-2" />
              )}
            </div>
          ))}

          {/* Intelligence Layer */}
          <div className="px-4 pt-3 border-t border-border mt-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-1.5">
              Intelligence Layer
            </p>
            <div className="space-y-0.5 mb-4">
              {intelligenceLayer.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.label}
                    disabled
                    className="flex items-center gap-3 w-full p-3 rounded-xl text-left opacity-50 cursor-not-allowed"
                  >
                    <div className="p-2 rounded-lg bg-violet-100 text-violet-500 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                    <span className="text-xs bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full shrink-0">
                      Soon
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

        </div>
      </SheetContent>
    </Sheet>
  )
}
