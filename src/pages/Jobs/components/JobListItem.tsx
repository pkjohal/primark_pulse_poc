import { useState, type CSSProperties } from 'react'
import { MapPin, Clock, Plus, Check, Loader2 } from 'lucide-react'
import { cn, getInitials } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { formatSLATime } from '@/lib/utils'
import { calculateRemainingTime } from '@/hooks/useJobs'
import { PeerTipCard } from './PeerTipCard'
import type { Job } from '@/types'

interface JobListItemProps {
  job: Job
  onClick?: () => void
  onQuickComplete?: (jobId: string) => void
  onAssignToMe?: (jobId: string) => void
  className?: string
  style?: CSSProperties
}

export function JobListItem({
  job,
  onClick,
  onQuickComplete,
  onAssignToMe,
  className,
  style,
}: JobListItemProps) {
  const [isClaimLoading, setIsClaimLoading] = useState(false)
  const [isDoneLoading, setIsDoneLoading] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)

  const remainingMinutes = calculateRemainingTime(job)
  const isOverdue = remainingMinutes <= 0 && job.status !== 'complete'
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
        {isEscalated && (
          <span className="text-xs font-medium text-warning bg-warning/10 px-2 py-0.5 rounded-full">
            Flagged
          </span>
        )}
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
        <span className="text-muted-foreground/40">•</span>
        <span className={cn('flex items-center gap-1', isOverdue && 'text-critical font-medium')}>
          <Clock className="w-3.5 h-3.5" />
          {isComplete ? 'Done' : isOverdue ? 'Overdue' : formatSLATime(remainingMinutes)}
        </span>
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
        {!isComplete && !isEscalated && (
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
