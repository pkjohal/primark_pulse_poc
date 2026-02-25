import { AlertCircle, AlertTriangle, Info, X } from 'lucide-react'
import { cn, formatRelativeTime } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { Alert, AlertType } from '@/types'

interface AlertItemProps {
  alert: Alert
  onDismiss?: (id: string) => void
  className?: string
}

const alertConfig: Record<AlertType, {
  icon: typeof AlertCircle
  iconColor: string
  badge: 'critical' | 'warning' | 'default'
}> = {
  critical: {
    icon: AlertCircle,
    iconColor: 'text-primary',
    badge: 'critical',
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-primary',
    badge: 'warning',
  },
  info: {
    icon: Info,
    iconColor: 'text-primary',
    badge: 'default',
  },
}

export function AlertItem({ alert, onDismiss, className }: AlertItemProps) {
  const config = alertConfig[alert.type]
  const Icon = config.icon

  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-3 py-3',
        'border-b border-border last:border-b-0',
        className
      )}
    >
      <Icon className={cn('w-5 h-5 mt-0.5 shrink-0', config.iconColor)} />

      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground">{alert.message}</p>

        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground">{alert.zone}</span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground">
            {formatRelativeTime(alert.timestamp)}
          </span>
        </div>
      </div>

      {onDismiss && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDismiss(alert.id)}
          className="shrink-0 h-8 w-8 text-muted-foreground hover:text-foreground"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  )
}
