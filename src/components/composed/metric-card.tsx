import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ChevronRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  status?: 'green' | 'amber' | 'red'
  showProgress?: boolean
  progressValue?: number
  subtitle?: string
  className?: string
  onClick?: () => void
}

const statusColors = {
  green: {
    icon: 'text-success/15',
    subtitle: 'text-success',
  },
  amber: {
    icon: 'text-warning/15',
    subtitle: 'text-warning',
  },
  red: {
    icon: 'text-critical/15',
    subtitle: 'text-critical font-medium',
  },
  default: {
    icon: 'text-primary/10',
    subtitle: 'text-muted-foreground',
  },
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  status,
  showProgress = false,
  progressValue,
  subtitle,
  className,
  onClick,
}: MetricCardProps) {
  const colors = status ? statusColors[status] : statusColors.default

  return (
    <Card
      variant="interactive"
      className={cn(
        'p-4 active:scale-[0.98] hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200 relative overflow-hidden',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Large faded background icon */}
      <div className="absolute -bottom-3 -right-3 pointer-events-none">
        <Icon className={cn('w-20 h-20', colors.icon)} strokeWidth={1.5} />
      </div>

      <div className="flex flex-col h-full relative z-10">
        {/* Header with chevron */}
        <div className="flex items-start justify-between mb-2">
          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>

        {/* Content - bigger text */}
        <div className="flex-1">
          <p className="text-2xl font-bold leading-tight">{value}</p>
          {subtitle && (
            <p className={cn('text-sm mt-1', colors.subtitle)}>{subtitle}</p>
          )}
        </div>

        {/* Progress bar */}
        {showProgress && progressValue !== undefined && (
          <div className="mt-3">
            <Progress value={progressValue} className="h-1.5" />
          </div>
        )}
      </div>
    </Card>
  )
}
