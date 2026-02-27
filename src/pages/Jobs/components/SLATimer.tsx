import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatSLATime } from '@/lib/utils'
import { calculateRemainingTime, getSLAUrgency } from '@/hooks/useJobs'
import type { Job } from '@/types'

interface SLATimerProps {
  job: Job
  className?: string
  inline?: boolean
}

export function SLATimer({ job, className, inline = false }: SLATimerProps) {
  const [remainingMinutes, setRemainingMinutes] = useState(() =>
    calculateRemainingTime(job)
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingMinutes(calculateRemainingTime(job))
    }, 60000)

    return () => clearInterval(interval)
  }, [job])

  const urgency = getSLAUrgency(remainingMinutes, job.sla)

  const colorClasses = {
    normal: 'text-success',
    warning: 'text-warning',
    critical: 'text-critical',
  }

  if (job.status === 'complete') {
    return null
  }

  const isNotStarted = job.status === 'unassigned' || job.status === 'pending'
  const label = remainingMinutes <= 0 && isNotStarted
    ? 'Not started'
    : remainingMinutes <= 0
      ? 'Running late'
      : formatSLATime(remainingMinutes)
  const colorClass = isNotStarted ? 'text-primary' : colorClasses[urgency]

  if (inline) {
    return (
      <span className={cn('flex items-center gap-1', colorClass, className)}>
        <Clock className="w-3.5 h-3.5" />
        <span>{label}</span>
      </span>
    )
  }

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <Clock className={cn('w-3.5 h-3.5', colorClass)} />
      <span className={cn('text-xs font-medium', colorClass)}>
        {label}
      </span>
    </div>
  )
}
