import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { StatusDot } from '@/components/custom/status-dot'
import { cn } from '@/lib/utils'
import type { StoreMetrics } from '@/types'

interface StoreStatusCardProps {
  metrics: StoreMetrics
  className?: string
}

export function StoreStatusCard({ metrics, className }: StoreStatusCardProps) {
  const statusLabel = {
    green: 'All Systems Operational',
    amber: 'Attention Needed',
    red: 'Critical Issues',
  }

  return (
    <Card className={cn(className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>{statusLabel[metrics.storeStatus]}</CardTitle>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <span>Live</span>
            <StatusDot status={metrics.storeStatus} pulse size="lg" />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mt-2">
          {/* Staff */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Staff Active</span>
              <span className="text-sm font-semibold">
                {metrics.staffActive}/{metrics.staffTotal}
              </span>
            </div>
            <Progress
              value={(metrics.staffActive / metrics.staffTotal) * 100}
              className="h-1.5"
            />
          </div>

          {/* Tills */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Tills Open</span>
              <span className="text-sm font-semibold">
                {metrics.tillsOpen}/{metrics.tillsTotal}
              </span>
            </div>
            <Progress
              value={(metrics.tillsOpen / metrics.tillsTotal) * 100}
              className="h-1.5"
            />
          </div>

          {/* Tasks */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Open Tasks</span>
              <span className="text-sm font-semibold">{metrics.openTasks}</span>
            </div>
            {metrics.criticalTasks > 0 && (
              <p className="text-xs text-critical font-medium">
                {metrics.criticalTasks} critical
              </p>
            )}
          </div>

          {/* Compliance */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Compliance</span>
              <span className="text-sm font-semibold">
                {metrics.complianceProgress}%
              </span>
            </div>
            <Progress
              value={metrics.complianceProgress}
              className="h-1.5"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
