import { useState, type CSSProperties } from 'react'
import { MapPin, Clock, Plus, Check, Loader2, UserPlus } from 'lucide-react'
import { cn, getInitials } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { formatSLATime } from '@/lib/utils'
import { calculateRemainingTime } from '@/hooks/useJobs'
import { useAuthStore } from '@/stores/authStore'
import { PeerTipCard } from './PeerTipCard'
import type { Job, JobPriority } from '@/types'

const priorityConfig: Record<JobPriority, { bg: string; text: string; label: string }> = {
  CRITICAL: { bg: 'bg-critical/10', text: 'text-critical',          label: 'Critical' },
  HIGH:     { bg: 'bg-primary/10',  text: 'text-primary',           label: 'High'     },
  MEDIUM:   { bg: 'bg-muted',       text: 'text-muted-foreground',  label: 'Medium'   },
  LOW:      { bg: 'bg-muted',       text: 'text-muted-foreground/60', label: 'Low'    },
}

interface JobListItemProps {
  job: Job
  onClick?: () => void
  onQuickComplete?: (jobId: string) => void
  onAssignToMe?: (jobId: string) => void
  onAssign?: (jobId: string) => void
  className?: string
  style?: CSSProperties
}

export function JobListItem({
  job,
  onClick,
  onQuickComplete,
  onAssignToMe,
  onAssign,
  className,
  style,
}: JobListItemProps) {
  const [isClaimLoading, setIsClaimLoading] = useState(false)
  const [isDoneLoading, setIsDoneLoading] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)

  const role = useAuthStore(s => s.user?.role)
  const isManager = role === 'manager'

  const remainingMinutes = calculateRemainingTime(job)
  const isNotStarted = job.status === 'unassigned' || job.status === 'pending'
  const isOverdue = remainingMinutes <= 0 && !isNotStarted && job.status !== 'complete'
  const isComplete = job.status === 'complete'
  const isEscalated = job.status === 'escalated'

  const handleClaim = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsClaimLoading(true)

    // Small delay for visual feedback
    await new Promise(resolve => setTimeout(resolve, 300))

    onAssignToMe?.(job.id)
    setIsClaimLoading(false)
  }

  const handleDone = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsDoneLoading(true)

    // Small delay for visual feedback
    await new Promise(resolve => setTimeout(resolve, 200))

    setIsDoneLoading(false)
    setIsCompleting(true)

    // Trigger completion after success flash
    setTimeout(() => {
      onQuickComplete?.(job.id)
    }, 400)
  }

  return (
    <Card
      variant="interactive"
      className={cn(
        'p-4 hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200',
        isComplete && 'opacity-60',
        isEscalated && 'border-warning/30 bg-warning/5',
        isCompleting && 'animate-success-flash',
        className
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      style={style}
    >
      {/* Row 1: Title */}
      <div className="flex items-start justify-between gap-3">
        <h3 className={cn(
          'text-sm font-medium text-foreground leading-snug flex-1',
          isComplete && 'line-through text-muted-foreground'
        )}>
          {job.title}
        </h3>
        <div className="flex items-center gap-1 shrink-0">
          <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', priorityConfig[job.priority].bg, priorityConfig[job.priority].text)}>
            {priorityConfig[job.priority].label}
          </span>
          {isEscalated && (
            <span className="text-xs font-medium text-warning bg-warning/10 px-2 py-0.5 rounded-full">
              Flagged
            </span>
          )}
        </div>
      </div>

      {/* Row 2: Why it matters (human-focused context) */}
      {job.whyItMatters && (
        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
          {job.whyItMatters}
        </p>
      )}

      {/* Row 3: Location + Time */}
      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" />
          {job.zone}
        </span>
        {job.status !== 'unassigned' && (
          <>
            <span className="text-muted-foreground/40">•</span>
            <span className={cn('flex items-center gap-1', isOverdue && 'text-critical font-medium', isNotStarted && 'text-primary', job.status === 'in-progress' && !isOverdue && 'text-success')}>
              <Clock className="w-3.5 h-3.5" />
              {isComplete
                ? 'Done'
                : isOverdue
                  ? 'Running late'
                  : job.status === 'in-progress'
                    ? 'In progress'
                    : job.status === 'pending'
                      ? 'Not started'
                      : formatSLATime(remainingMinutes)}
            </span>
          </>
        )}
      </div>

      {/* Row 4: Peer tip indicator */}
      {job.peerTip && !isComplete && (
        <div className="mt-2">
          <PeerTipCard tip={job.peerTip} compact />
        </div>
      )}

      {/* Row 5: Footer with hairline divider */}
      <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
        {/* Left: Assignee */}
        <div className="flex items-center gap-2 text-xs">
          {job.assigneeName ? (
            <>
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-medium text-primary">
                {getInitials(job.assigneeName)}
              </div>
              <span className="text-foreground/70">{job.assigneeName}</span>
            </>
          ) : (
            <span className="text-foreground/50">Unassigned</span>
          )}
        </div>

        {/* Right: Action button */}
        {!isComplete && !isEscalated && isManager && !job.assigneeName && onAssign && (
          <button
            className={cn(
              'flex items-center justify-center gap-1 px-3 py-1.5 rounded-full',
              'bg-primary text-white text-xs font-medium',
              'hover:bg-primary/90 active:scale-95 transition-all duration-150',
              'min-w-[72px]'
            )}
            onClick={(e) => { e.stopPropagation(); onAssign(job.id) }}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Assign
          </button>
        )}
        {!isComplete && !isEscalated && !isManager && (
          job.assigneeName ? (
            <button
              className={cn(
                'flex items-center justify-center gap-1 px-3 py-1.5 rounded-full',
                'bg-primary text-white text-xs font-medium',
                'hover:bg-primary/90 active:scale-95 transition-all duration-150',
                'min-w-[72px]'
              )}
              onClick={handleDone}
              disabled={isDoneLoading || isCompleting}
            >
              {isDoneLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Done
                </>
              )}
            </button>
          ) : (
            <button
              className={cn(
                'flex items-center justify-center gap-1 px-3 py-1.5 rounded-full',
                'bg-primary text-white text-xs font-medium',
                'hover:bg-primary/90 active:scale-95 transition-all duration-150',
                'min-w-[72px]'
              )}
              onClick={handleClaim}
              disabled={isClaimLoading}
            >
              {isClaimLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  Claim
                </>
              )}
            </button>
          )
        )}
      </div>
    </Card>
  )
}
