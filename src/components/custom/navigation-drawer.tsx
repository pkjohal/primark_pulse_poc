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

const coreOperations: MenuItem[] = [
  { icon: Home, label: 'Live Store Overview', path: '/', status: 'active' },
  { icon: MessageSquare, label: 'Team Comms', path: '/team', status: 'active' },
  { icon: Users, label: 'Staff Overview', path: '/staff', status: 'active' },
  { icon: ClipboardList, label: 'Job Management', path: '/jobs', status: 'active' },
  { icon: Calendar, label: 'My Schedule', path: '/schedule', status: 'active' },
  { icon: TrendingUp, label: 'Queues & Demand', path: '/queues', status: 'active' },
  { icon: Package, label: 'Stock & Availability', path: '/stock', status: 'active' },
  { icon: Shield, label: 'Compliance', path: '/compliance', status: 'active' },
  { icon: BarChart3, label: 'Performance Insights', path: '/insights', status: 'active' },
]

const intelligenceLayer: MenuItem[] = [
  { icon: Brain, label: 'Decision Engine', description: 'AI-powered suggestions', status: 'preview' },
  { icon: Zap, label: 'Automation', description: 'Smart defaults & rules', status: 'preview' },
  { icon: Clock, label: 'Forecasting', description: 'Predictive demand', status: 'preview' },
  { icon: Target, label: 'Prioritisation', description: 'Value scoring', status: 'preview' },
  { icon: AlertTriangle, label: 'Alerts', description: 'Smart notifications', status: 'preview' },
  { icon: Play, label: 'Replay', description: 'Shift analysis', status: 'preview' },
  { icon: Award, label: 'Skills', description: 'Optimisation', status: 'preview' },
  { icon: Heart, label: 'Sentiment', description: 'Experience signals', status: 'preview' },
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
          <SheetTitle className="text-white text-lg font-bold">All Modules</SheetTitle>
        </SheetHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 pb-24">
          {/* Core Operations */}
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Core Operations
          </p>
          <div className="space-y-1 mb-6">
            {coreOperations.map((item) => {
              const Icon = item.icon
              const isActive = item.status === 'active'
              const isCurrent = isCurrentPath(item.path)

              return (
                <button
                  key={item.label}
                  onClick={() => handleNavigation(item)}
                  disabled={!isActive}
                  className={cn(
                    'flex items-center gap-3 w-full p-3 rounded-xl text-left transition-colors',
                    isActive
                      ? 'hover:bg-muted cursor-pointer'
                      : 'opacity-60 cursor-not-allowed',
                    isCurrent && 'bg-primary/5'
                  )}
                >
                  <div
                    className={cn(
                      'p-2 rounded-lg',
                      isActive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className={cn(
                      'font-medium',
                      isActive ? 'text-foreground' : 'text-muted-foreground'
                    )}>
                      {item.label}
                    </p>
                    {!isActive && (
                      <p className="text-xs text-muted-foreground">Coming soon</p>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              )
            })}
          </div>

          {/* Intelligence Layer */}
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Intelligence Layer
          </p>
          <div className="space-y-1">
            {intelligenceLayer.map((item) => {
              const Icon = item.icon

              return (
                <button
                  key={item.label}
                  disabled
                  className="flex items-center gap-3 w-full p-3 rounded-xl text-left opacity-60 cursor-not-allowed"
                >
                  <div className="p-2 rounded-lg bg-violet-100 text-violet-500">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <span className="text-xs bg-violet-100 text-violet-600 px-2 py-1 rounded-full">
                    Preview
                  </span>
                </button>
              )
            })}
          </div>

        </div>
      </SheetContent>
    </Sheet>
  )
}
