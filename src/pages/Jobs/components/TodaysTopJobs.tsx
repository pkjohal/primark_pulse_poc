import { AlertCircle, Clock, MapPin, Play } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { formatSLATime } from '@/lib/utils'
import { useTopJobs, calculateRemainingTime, getSLAUrgency } from '@/hooks/useJobs'
import type { Job, JobPriority } from '@/types'

interface PriorityJobsProps {
  onJobClick: (job: Job) => void
  onStartJob: (jobId: string) => void
  className?: string
}

const priorityColors: Record<JobPriority, string> = {
  CRITICAL: 'bg-critical text-white border-critical',
  HIGH: 'bg-primary text-white border-primary',
  MEDIUM: 'bg-amber-500 text-white border-amber-500',
  LOW: 'bg-slate-500 text-white border-slate-500',
}

export function PriorityJobs({ onJobClick, onStartJob, className }: PriorityJobsProps) {
  const { data: topJobs, isLoading } = useTopJobs()

  if (isLoading) {
    return (
      <div className={cn('space-y-3', className)}>
        <div className="flex items-center gap-2 px-1">
          <AlertCircle className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Priority Jobs</h2>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide snap-x-mandatory overscroll-rubber">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[280px] h-[140px] rounded-xl bg-muted animate-pulse snap-start"
            />
          ))}
        </div>
      </div>
    )
  }

  if (!topJobs || topJobs.length === 0) {
    return null
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2 px-1">
        <AlertCircle className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">Priority Jobs</h2>
      </div>

      {/* Carousel with snap scrolling */}
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide snap-x-mandatory overscroll-rubber">
        {topJobs.map((job, index) => {
          const remainingMinutes = calculateRemainingTime(job)
          const urgency = getSLAUrgency(remainingMinutes, job.sla)

          return (
            <Card
              key={job.id}
              variant="interactive"
              className={cn(
                'flex-shrink-0 w-[280px] p-4 cursor-pointer snap-start',
                'hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200',
                'animate-fade-in-up'
              )}
              style={{ animationDelay: `${index * 75}ms` }}
              onClick={() => onJobClick(job)}
            >
              {/* Priority badge */}
              <div className="flex items-center justify-between mb-2">
                <span
                  className={cn(
                    'text-[10px] font-semibold px-2 py-0.5 rounded-full',
                    priorityColors[job.priority]
                  )}
                >
                  {job.priority}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-2">
                {job.title}
              </h3>

              {/* Metadata */}
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {job.zone}
                </span>
                <span
                  className={cn(
                    'flex items-center gap-1',
                    urgency === 'critical' && 'text-critical font-medium',
                    urgency === 'warning' && 'text-warning font-medium'
                  )}
                >
                  <Clock className="w-3 h-3" />
                  {formatSLATime(remainingMinutes)}
                </span>
              </div>

              {/* Start button with press animation */}
              <button
                className={cn(
                  'w-full flex items-center justify-center gap-1.5 py-2 rounded-lg',
                  'text-xs font-medium bg-primary text-white',
                  'hover:bg-primary/90 active:scale-95 transition-all duration-150'
                )}
                onClick={(e) => {
                  e.stopPropagation()
                  onStartJob(job.id)
                }}
              >
                <Play className="w-3.5 h-3.5" />
                Start
              </button>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
