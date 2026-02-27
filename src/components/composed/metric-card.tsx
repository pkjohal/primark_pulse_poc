import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface MetricCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  status?: 'green' | 'amber' | 'red'
  showProgress?: boolean
  progressValue?: number
  subtitle?: string
  graphic?: ReactNode
  tooltip?: string
  className?: string
  onClick?: () => void
}

const statusColors = {
  green: {
    iconBg: 'bg-success/10',
    iconText: 'text-success',
    subtitle: 'text-success',
  },
  amber: {
    iconBg: 'bg-warning/10',
    iconText: 'text-warning',
    subtitle: 'text-warning',
  },
  red: {
    iconBg: 'bg-critical/10',
    iconText: 'text-critical',
    subtitle: 'text-critical font-medium',
  },
  default: {
    iconBg: 'bg-primary/10',
    iconText: 'text-primary',
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
  graphic,
  tooltip,
  className,
  onClick,
}: MetricCardProps) {
  const colors = status ? statusColors[status] : statusColors.default

  return (
    <Card
      variant="interactive"
      title={tooltip}
      className={cn(
        'overflow-hidden active:scale-[0.98] hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="flex px-4">
        {/* Left: icon + title + value + subtitle */}
        <div className="flex flex-col justify-between flex-1 min-w-0 py-4">
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className={cn('p-1.5 rounded-md shrink-0', colors.iconBg)}>
              <Icon className={cn('w-3 h-3', colors.iconText)} />
            </div>
            <p className="text-[10px] font-medium text-muted-foreground flex-1 leading-tight truncate">
              {title}
            </p>
          </div>
          <div>
            <p className="text-base font-bold leading-tight">{value}</p>
            {subtitle && (
              <p className={cn('text-[10px] mt-0.5 leading-tight', colors.subtitle)}>{subtitle}</p>
            )}
            {showProgress && progressValue !== undefined && !graphic && (
              <div className="mt-1.5">
                <Progress value={progressValue} className="h-1" />
              </div>
            )}
          </div>
        </div>

        {/* Right: graphic — square, width = card height */}
        {graphic && (
          <div className="w-10 flex items-center justify-center shrink-0 bg-muted/20">
            {graphic}
          </div>
        )}
      </div>
    </Card>
  )
}
