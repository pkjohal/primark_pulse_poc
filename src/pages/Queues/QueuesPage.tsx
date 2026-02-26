import { Users } from 'lucide-react'
import { useQueues, useStorePressure } from '@/hooks/useQueues'
import { StorePressureCard } from './components/StorePressureCard'
import { QueueCard } from './components/QueueCard'

export default function QueuesPage() {
  const { data: queues, isLoading: queuesLoading } = useQueues()
  const { data: pressure, isLoading: pressureLoading } = useStorePressure()

  const isLoading = queuesLoading || pressureLoading

  // Count queues by status
  const overThresholdCount = queues?.filter(q => q.status === 'over-threshold').length || 0
  const normalCount = queues?.filter(q => q.status === 'normal').length || 0

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <h1 className="text-lg font-semibold text-foreground">Queues & Demand</h1>

        {/* Summary Stats - inline with header */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            <span className="text-muted-foreground tabular-nums">{normalCount} Normal</span>
          </div>
          {overThresholdCount > 0 && (
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-critical" />
              <span className="text-muted-foreground tabular-nums">{overThresholdCount} Over</span>
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-24 bg-muted rounded animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {/* Store Pressure Card */}
          {pressure && (
            <div className="animate-fade-in-up animation-delay-100">
              <StorePressureCard pressure={pressure} />
            </div>
          )}

          {/* Queue Cards */}
          {queues && queues.length > 0 ? (
            queues.map((queue, index) => (
              <div
                key={queue.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${(index + 2) * 100}ms` }}
              >
                <QueueCard queue={queue} />
              </div>
            ))
          ) : (
            <div className="bg-white border border-border rounded p-4 text-center">
              <Users className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No queue data available</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
