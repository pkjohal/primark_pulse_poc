import { Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type { QueueStatus } from '@/types'

interface QueueCardProps {
  queue: QueueStatus
  className?: string
}

export function QueueCard({ queue, className }: QueueCardProps) {
  const percentage = (queue.current / queue.max) * 100
  const thresholdPercentage = (queue.threshold / queue.max) * 100
  const isOverThreshold = queue.status === 'over-threshold'

  return (
    <Card className={cn('p-4 space-y-3', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className={cn('w-4 h-4', isOverThreshold ? 'text-critical' : 'text-muted-foreground')} />
          <h3 className="text-sm font-medium text-foreground">{queue.name}</h3>
        </div>
        <span
          className={cn(
            'text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full',
            isOverThreshold
              ? 'bg-critical/10 text-critical'
              : 'bg-success/10 text-success'
          )}
        >
          {isOverThreshold ? 'Over Threshold' : 'Normal'}
        </span>
      </div>

      {/* Count */}
      <div className="flex items-baseline gap-1">
        <span className={cn('text-2xl font-bold tabular-nums', isOverThreshold ? 'text-critical' : 'text-foreground')}>
          {queue.current}
        </span>
        <span className="text-sm text-muted-foreground">/ {queue.max}</span>
      </div>

      {/* Progress bar */}
      <Progress value={percentage} threshold={thresholdPercentage} className="h-1.5" />

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Threshold: {queue.threshold}</span>
        <span className="tabular-nums">{Math.round(percentage)}% capacity</span>
      </div>
    </Card>
  )
}
