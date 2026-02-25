import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatSLATime } from '@/lib/utils'
import { calculateRemainingTime, getSLAUrgency } from '@/hooks/useTasks'
import type { Task } from '@/types'

interface SLATimerProps {
  task: Task
  className?: string
  inline?: boolean // Compact inline display for metadata rows
}

export function SLATimer({ task, className, inline = false }: SLATimerProps) {
  const [remainingMinutes, setRemainingMinutes] = useState(() =>
    calculateRemainingTime(task)
  )

  // Update remaining time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingMinutes(calculateRemainingTime(task))
    }, 60000)

    return () => clearInterval(interval)
  }, [task])

  const urgency = getSLAUrgency(remainingMinutes, task.sla)

  const colorClasses = {
    normal: 'text-success',
    warning: 'text-warning',
    critical: 'text-critical',
  }

  // Don't show SLA for completed tasks
  if (task.status === 'complete') {
    return null
  }

  // Inline mode for compact metadata display
  if (inline) {
    return (
      <span className={cn('flex items-center gap-1', colorClasses[urgency], className)}>
        <Clock className="w-3.5 h-3.5" />
        <span>{formatSLATime(remainingMinutes)}</span>
      </span>
    )
  }

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <Clock className={cn('w-3.5 h-3.5', colorClasses[urgency])} />
      <span className={cn('text-xs font-medium', colorClasses[urgency])}>
        {formatSLATime(remainingMinutes)}
      </span>
    </div>
  )
}
