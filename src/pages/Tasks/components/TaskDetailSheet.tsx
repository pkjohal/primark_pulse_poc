import { User, MapPin, Clock, Calendar, Play, CheckCircle2, UserPlus } from 'lucide-react'
import { cn, getInitials, formatRelativeTime } from '@/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { SLATimer } from './SLATimer'
import { useUpdateTask } from '@/hooks/useTasks'
import type { Task, TaskPriority, TaskStatus } from '@/types'

interface TaskDetailSheetProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onAssign?: () => void
}

// Primark-themed priority colors
const priorityConfig: Record<
  TaskPriority,
  { bgColor: string; textColor: string; label: string }
> = {
  CRITICAL: { bgColor: 'bg-critical/10', textColor: 'text-critical', label: 'CRITICAL' },
  HIGH: { bgColor: 'bg-primary/10', textColor: 'text-primary', label: 'HIGH' },
  MEDIUM: { bgColor: 'bg-primary/5', textColor: 'text-primary/80', label: 'MEDIUM' },
  LOW: { bgColor: 'bg-muted', textColor: 'text-muted-foreground', label: 'LOW' },
}

const statusConfig: Record<
  TaskStatus,
  { label: string; color: string }
> = {
  unassigned: { label: 'Unassigned', color: 'text-critical' },
  pending: { label: 'Pending', color: 'text-muted-foreground' },
  'in-progress': { label: 'In Progress', color: 'text-primary' },
  complete: { label: 'Completed', color: 'text-primary' },
}

export function TaskDetailSheet({
  task,
  open,
  onOpenChange,
  onAssign,
}: TaskDetailSheetProps) {
  const updateTask = useUpdateTask()

  if (!task) return null

  const config = priorityConfig[task.priority]
  const statusInfo = statusConfig[task.status]

  const handleStart = () => {
    updateTask.mutate({
      id: task.id,
      status: 'in-progress',
    })
  }

  const handleComplete = () => {
    updateTask.mutate({
      id: task.id,
      status: 'complete',
    })
    onOpenChange(false)
  }

  const canStart = task.status === 'pending' || task.status === 'unassigned'
  const canComplete = task.status === 'in-progress'
  const isComplete = task.status === 'complete'

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-auto max-h-[85vh]">
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
          </div>
          <SheetTitle className="text-lg">{task.title}</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          {/* Status */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Status:</span>
            <span className={cn('text-sm font-medium', statusInfo.color)}>
              {statusInfo.label}
            </span>
          </div>

          {/* SLA */}
          {!isComplete && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Time remaining:</span>
              <SLATimer task={task} />
            </div>
          )}

          {/* Assignee */}
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Assigned to:</span>
            {task.assigneeName ? (
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-medium text-primary">
                  {getInitials(task.assigneeName)}
                </div>
                <span className="text-sm font-medium">{task.assigneeName}</span>
              </div>
            ) : (
              <span className="text-sm font-medium text-warning">Unassigned</span>
            )}
          </div>

          {/* Zone */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Zone:</span>
            <span className="text-sm font-medium">{task.zone}</span>
          </div>

          {/* Created */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Created:</span>
            <span className="text-sm">{formatRelativeTime(task.createdAt)}</span>
          </div>

          {/* Description if available */}
          {task.description && (
            <div className="pt-3 border-t border-border">
              <p className="text-sm text-muted-foreground mb-1">Description</p>
              <p className="text-sm">{task.description}</p>
            </div>
          )}

          {/* Actions */}
          {!isComplete && (
            <div className="pt-4 border-t border-border space-y-2">
              {!task.assignee && onAssign && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={onAssign}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Assign Task
                </Button>
              )}

              {canStart && task.assignee && (
                <Button
                  className="w-full"
                  onClick={handleStart}
                  disabled={updateTask.isPending}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Task
                </Button>
              )}

              {canComplete && (
                <Button
                  className="w-full"
                  onClick={handleComplete}
                  disabled={updateTask.isPending}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Mark Complete
                </Button>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
