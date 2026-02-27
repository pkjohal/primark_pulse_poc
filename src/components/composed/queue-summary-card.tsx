import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useQueues, useStorePressure } from '@/hooks/useQueues'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import type { StorePressure } from '@/types'

interface QueueSummaryCardProps {
  className?: string
}

const pressureConfig: Record<StorePressure, { label: string; dot: string; text: string }> = {
  low:    { label: 'Low pressure',    dot: 'bg-success',  text: 'text-success'  },
  medium: { label: 'Medium pressure', dot: 'bg-warning',  text: 'text-warning'  },
  high:   { label: 'High pressure',   dot: 'bg-critical', text: 'text-critical' },
}

export function QueueSummaryCard({ className }: QueueSummaryCardProps) {
  const navigate = useNavigate()
  const { data: queues, isLoading: queuesLoading } = useQueues()
  const { data: pressure, isLoading: pressureLoading } = useStorePressure()

  const isLoading = queuesLoading || pressureLoading

  if (isLoading) {
    return (
      <Card className={cn('animate-pulse', className)}>
        <CardContent className="p-3 space-y-2">
          <div className="h-3 w-24 bg-muted rounded" />
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-2.5 w-20 bg-muted rounded" />
              <div className="flex-1 h-2 bg-muted rounded-full" />
              <div className="h-2.5 w-8 bg-muted rounded" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (!pressure || !queues) return null

  const config = pressureConfig[pressure.level]

  return (
    <Card
      variant="interactive"
      className={cn('active:scale-[0.99] transition-all duration-150', className)}
      onClick={() => navigate('/queues')}
      role="button"
      tabIndex={0}
    >
      <CardHeader className="flex-row items-center justify-between px-3 pt-3 pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm">Queues & Demand</CardTitle>
          <div className="flex items-center gap-1">
            <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
            <span className={cn('text-xs font-medium', config.text)}>{config.label}</span>
          </div>
        </div>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
      </CardHeader>

      <CardContent className="px-3 pb-3 space-y-2">
        {queues.map(queue => {
          const fillPct = Math.min(100, Math.round((queue.current / queue.max) * 100))
          const isOver = queue.status === 'over-threshold'
          const isNearThreshold = !isOver && queue.current / queue.max > 0.6

          return (
            <div key={queue.id} className="flex items-center gap-2.5">
              {/* Queue name */}
              <p className="text-xs text-muted-foreground w-24 shrink-0 truncate">
                {queue.name}
              </p>

              {/* Fill bar */}
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    isOver          ? 'bg-critical' :
                    isNearThreshold ? 'bg-warning'  :
                                      'bg-success'
                  )}
                  style={{ width: `${fillPct}%` }}
                />
              </div>

              {/* Count badge */}
              <span className={cn(
                'text-xs font-semibold w-10 text-right shrink-0',
                isOver ? 'text-critical' : 'text-foreground'
              )}>
                {queue.current}/{queue.max}
              </span>
            </div>
          )
        })}

        {/* Forecast note */}
        {pressure.peakForecast && (
          <p className="text-xs text-muted-foreground pt-1 border-t border-border">
            {pressure.peakForecast}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
