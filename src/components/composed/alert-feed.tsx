import { AlertItem } from './alert-item'
import { SkeletonListItem } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { Alert } from '@/types'

interface AlertFeedProps {
  alerts: Alert[]
  isLoading?: boolean
  onDismiss?: (id: string) => void
  maxItems?: number
  className?: string
}

export function AlertFeed({
  alerts,
  isLoading = false,
  onDismiss,
  maxItems,
  className,
}: AlertFeedProps) {
  const displayAlerts = maxItems ? alerts.slice(0, maxItems) : alerts

  if (isLoading) {
    return (
      <div className={cn('space-y-2', className)}>
        {[1, 2, 3].map((i) => (
          <SkeletonListItem key={i} />
        ))}
      </div>
    )
  }

  if (alerts.length === 0) {
    return (
      <div className={cn('p-6 text-center', className)}>
        <p className="text-muted-foreground">No alerts at this time</p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-2', className)}>
      {displayAlerts.map((alert) => (
        <AlertItem
          key={alert.id}
          alert={alert}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  )
}
