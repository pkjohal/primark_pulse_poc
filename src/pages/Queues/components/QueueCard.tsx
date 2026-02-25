import { Users } from 'lucide-react'
import { cn } from '@/lib/utils'
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
    <div
      className={cn(
        'bg-white border border-slate-200 rounded p-3 space-y-2',
        className
      )}
    >
      {/* Header with name and status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users
            className={cn(
              'w-4 h-4',
              isOverThreshold ? 'text-[#D32F2F]' : 'text-slate-500'
            )}
          />
          <h3 className="text-sm font-medium text-slate-900">{queue.name}</h3>
        </div>
        <span
          className={cn(
            'text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-sm',
            isOverThreshold
              ? 'bg-[#D32F2F]/10 text-[#D32F2F]'
              : 'bg-[#388E3C]/10 text-[#388E3C]'
          )}
        >
          {isOverThreshold ? 'Over Threshold' : 'Normal'}
        </span>
      </div>

      {/* Current count - more compact */}
      <div className="flex items-baseline gap-1">
        <span
          className={cn(
            'text-2xl font-semibold tabular-nums',
            isOverThreshold ? 'text-[#D32F2F]' : 'text-slate-900'
          )}
        >
          {queue.current}
        </span>
        <span className="text-sm text-slate-500">/ {queue.max}</span>
      </div>

      {/* Progress bar - thinner, square caps */}
      <div className="pt-3">
        <Progress
          value={percentage}
          threshold={thresholdPercentage}
          className="h-1.5"
        />
      </div>

      {/* Footer stats */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
        <span>Threshold: {queue.threshold}</span>
        <span className="tabular-nums">{Math.round(percentage)}% capacity</span>
      </div>
    </div>
  )
}
