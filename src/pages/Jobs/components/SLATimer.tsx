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
