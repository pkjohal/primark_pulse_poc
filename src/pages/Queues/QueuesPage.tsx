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
    <div className="p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-slate-900">Queues & Demand</h1>

        {/* Summary Stats - inline with header */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#388E3C]" />
            <span className="text-slate-600 tabular-nums">{normalCount} Normal</span>
          </div>
          {overThresholdCount > 0 && (
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D32F2F]" />
              <span className="text-slate-600 tabular-nums">{overThresholdCount} Over</span>
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-24 bg-slate-100 rounded animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {/* Store Pressure Card */}
          {pressure && <StorePressureCard pressure={pressure} />}

          {/* Queue Cards */}
          {queues && queues.length > 0 ? (
            queues.map((queue) => (
              <QueueCard key={queue.id} queue={queue} />
            ))
          ) : (
            <div className="bg-white border border-slate-200 rounded p-4 text-center">
              <Users className="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <p className="text-sm text-slate-500">No queue data available</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
