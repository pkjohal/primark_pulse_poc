import { useNavigate } from 'react-router-dom'
import { Users, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useQueues, useStorePressure } from '@/hooks/useQueues'
import { WavePattern } from '@/components/decorative'
import type { StorePressure } from '@/types'

interface QueueSummaryCardProps {
  className?: string
}

const pressureConfig: Record<StorePressure, { label: string; color: string; bgColor: string }> = {
  low: { label: 'LOW', color: 'text-green-300', bgColor: 'bg-white/20' },
  medium: { label: 'MEDIUM', color: 'text-amber-300', bgColor: 'bg-white/20' },
  high: { label: 'HIGH', color: 'text-red-300', bgColor: 'bg-white/20' },
}

export function QueueSummaryCard({ className }: QueueSummaryCardProps) {
  const navigate = useNavigate()
  const { data: queues, isLoading: queuesLoading } = useQueues()
  const { data: pressure, isLoading: pressureLoading } = useStorePressure()

  const isLoading = queuesLoading || pressureLoading

  if (isLoading) {
    return (
      <div className={cn('bg-primary rounded-xl p-3 animate-pulse', className)}>
        <div className="h-4 w-32 bg-white/20 rounded mb-2" />
        <div className="h-5 w-20 bg-white/20 rounded mb-1.5" />
        <div className="h-4 w-40 bg-white/20 rounded" />
      </div>
    )
  }

  if (!pressure || !queues) {
    return null
  }

  const config = pressureConfig[pressure.level]
  const overThreshold = queues.filter(q => q.status === 'over-threshold').length
  const totalQueues = queues.length

  return (
    <div
      className={cn(
        'relative bg-primary rounded-xl p-3 cursor-pointer overflow-hidden text-white',
        'hover:bg-primary/90 active:scale-[0.99] transition-all duration-150',
        className
      )}
      onClick={() => navigate('/queues')}
    >
      {/* Decorative wave */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <WavePattern className="text-white h-8" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-2 relative z-10">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-white/80" />
          <span className="text-sm font-medium text-white">Queues & Pressure</span>
        </div>
        <ChevronRight className="w-4 h-4 text-white/70" />
      </div>

      {/* Pressure Level */}
      <div className="flex items-center gap-2 mb-1.5 relative z-10">
        <span
          className={cn(
            'px-1.5 py-0.5 text-[10px] font-bold rounded-sm',
            config.bgColor,
            config.color
          )}
        >
          {config.label}
        </span>
        <span className="text-xs text-white/80">
          {pressure.peakForecast}
        </span>
      </div>

      {/* Queue Status */}
      <p className="text-xs text-white/80 relative z-10">
        {overThreshold === 0 ? (
          <span className="text-green-300">All queues normal</span>
        ) : (
          <>
            <span className="text-red-300 font-medium">{overThreshold} of {totalQueues}</span>
            {' '}queues over threshold
          </>
        )}
      </p>
    </div>
  )
}
