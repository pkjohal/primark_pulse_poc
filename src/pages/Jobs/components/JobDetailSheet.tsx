import { useState } from 'react'
import { User, MapPin, Clock, Calendar, Play, CheckCircle2, UserPlus, AlertTriangle, CheckSquare, Square } from 'lucide-react'
import { cn, getInitials, formatRelativeTime } from '@/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { SLATimer } from './SLATimer'
import { PeerTipCard } from './PeerTipCard'
import { useUpdateJob, useCompleteJob } from '@/hooks/useJobs'
import type { Job, JobPriority, JobStatus } from '@/types'

interface JobDetailSheetProps {
  job: Job | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onAssign?: () => void
  onEscalate?: () => void
  onComplete?: (job: Job, timeTaken: number) => void
}

const priorityConfig: Record<
  JobPriority,
  { bgColor: string; textColor: string; label: string }
> = {
  CRITICAL: { bgColor: 'bg-critical/10', textColor: 'text-critical', label: 'CRITICAL' },
  HIGH: { bgColor: 'bg-primary/10', textColor: 'text-primary', label: 'HIGH' },
  MEDIUM: { bgColor: 'bg-primary/5', textColor: 'text-primary/80', label: 'MEDIUM' },
  LOW: { bgColor: 'bg-muted', textColor: 'text-muted-foreground', label: 'LOW' },
}

const statusConfig: Record<
  JobStatus,
  { label: string; color: string }
> = {
  unassigned: { label: 'Unassigned', color: 'text-critical' },
  pending: { label: 'Pending', color: 'text-muted-foreground' },
  'in-progress': { label: 'In Progress', color: 'text-primary' },
  complete: { label: 'Completed', color: 'text-success' },
  escalated: { label: 'Flagged', color: 'text-warning' },
}

export function JobDetailSheet({
  job,
  open,
  onOpenChange,
  onAssign,
  onEscalate,
  onComplete,
}: JobDetailSheetProps) {
  const updateJob = useUpdateJob()
  const completeJob = useCompleteJob()
  const [checkedCriteria, setCheckedCriteria] = useState<Set<number>>(new Set())

  if (!job) return null

  const config = priorityConfig[job.priority]
  const statusInfo = statusConfig[job.status]

  const handleStart = () => {
    updateJob.mutate({
      id: job.id,
      status: 'in-progress',
      startedAt: new Date().toISOString(),
    })
  }

  const handleComplete = () => {
    // Calculate time taken
    const startTime = job.startedAt ? new Date(job.startedAt) : new Date(job.createdAt)
    const timeTaken = Math.round((Date.now() - startTime.getTime()) / (60 * 1000))

    completeJob.mutate(
      { id: job.id, completedIn: timeTaken },
      {
        onSuccess: () => {
          onOpenChange(false)
          onComplete?.(job, timeTaken)
        },
      }
    )
  }

  const toggleCriteria = (index: number) => {
    const newChecked = new Set(checkedCriteria)
    if (newChecked.has(index)) {
      newChecked.delete(index)
    } else {
      newChecked.add(index)
    }
    setCheckedCriteria(newChecked)
  }

  const canStart = job.status === 'pending' || job.status === 'unassigned'
  const canComplete = job.status === 'in-progress'
  const isComplete = job.status === 'complete'
  const isEscalated = job.status === 'escalated'

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-auto max-h-[85vh] overflow-y-auto">
        <SheetHeader className="text-left">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={cn(
                'px-2 py-0.5 text-xs font-semibold rounded-full',
                config.bgColor,
                config.textColor
              )}
            >
              {config.label}
            </span>
            {isEscalated && (
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-warning/10 text-warning">
                FLAGGED
              </span>
            )}
          </div>
          <SheetTitle className="text-lg">{job.title}</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          {/* Why This Matters - Human-focused context */}
          {job.whyItMatters && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs font-medium text-muted-foreground mb-1">Why this matters</p>
              <p className="text-sm text-foreground">{job.whyItMatters}</p>
            </div>
          )}

          {/* Done When - Success Criteria */}
          {job.successCriteria && job.successCriteria.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Done when</p>
              <div className="space-y-2">
                {job.successCriteria.map((criteria, index) => (
                  <button
                    key={index}
                    onClick={() => toggleCriteria(index)}
                    className="flex items-start gap-2 w-full text-left group"
                  >
                    {checkedCriteria.has(index) ? (
                      <CheckSquare className="w-4 h-4 text-success mt-0.5 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0 group-hover:text-foreground transition-colors" />
                    )}
                    <span
                      className={cn(
                        'text-sm',
                        checkedCriteria.has(index)
                          ? 'text-muted-foreground line-through'
                          : 'text-foreground'
                      )}
                    >
                      {criteria}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Peer Tip */}
          {job.peerTip && (
            <PeerTipCard tip={job.peerTip} />
          )}

          {/* Metadata */}
          <div className="space-y-3 pt-3 border-t border-border">
            {/* Status */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Status:</span>
              <span className={cn('text-sm font-medium', statusInfo.color)}>
                {statusInfo.label}
              </span>
            </div>

            {/* SLA */}
            {!isComplete && job.status !== 'unassigned' && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Time remaining:</span>
                <SLATimer job={job} />
              </div>
            )}

            {/* Assignee */}
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Assigned to:</span>
              {job.assigneeName ? (
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-medium text-primary">
                    {getInitials(job.assigneeName)}
                  </div>
                  <span className="text-sm font-medium">{job.assigneeName}</span>
                </div>
              ) : (
                <span className="text-sm font-medium text-warning">Unassigned</span>
              )}
            </div>

            {/* Zone */}
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Zone:</span>
              <span className="text-sm font-medium">{job.zone}</span>
            </div>

            {/* Time estimate */}
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Estimate:</span>
              <span className="text-sm font-medium">~{job.sla} min</span>
            </div>

            {/* Created */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Created:</span>
              <span className="text-sm">{formatRelativeTime(job.createdAt)}</span>
            </div>
          </div>

          {/* Actions */}
          {!isComplete && (
            <div className="pt-4 border-t border-border space-y-2">
              {/* Flag Issue button - always show if not complete/escalated */}
              {!isEscalated && onEscalate && (
                <Button
                  variant="outline"
                  className="w-full text-warning border-warning/30 hover:bg-warning/10"
                  onClick={onEscalate}
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Flag Issue
                </Button>
              )}

              {!job.assignee && onAssign && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={onAssign}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Assign Job
                </Button>
              )}

              {canStart && job.assignee && (
                <Button
                  className="w-full"
                  onClick={handleStart}
                  disabled={updateJob.isPending}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Job
                </Button>
              )}

              {canComplete && (
                <Button
                  className="w-full"
                  onClick={handleComplete}
                  disabled={completeJob.isPending}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Done
                </Button>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
