import type { CSSProperties } from 'react'
import { MapPin, Clock, Plus, Check } from 'lucide-react'
import { cn, getInitials } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { formatSLATime } from '@/lib/utils'
import { calculateRemainingTime } from '@/hooks/useTasks'
import type { Task } from '@/types'

interface TaskListItemProps {
  task: Task
  onClick?: () => void
  onQuickComplete?: (taskId: string) => void
  onAssignToMe?: (taskId: string) => void
  className?: string
  style?: CSSProperties
}


export function TaskListItem({
  task,
  onClick,
  onQuickComplete,
  onAssignToMe,
  className,
  style,
}: TaskListItemProps) {
  const remainingMinutes = calculateRemainingTime(task)
  const isOverdue = remainingMinutes <= 0 && task.status !== 'complete'
  const isComplete = task.status === 'complete'

  return (
    <Card
      variant="interactive"
      className={cn(
        'p-4 hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200',
        isComplete && 'opacity-60',
        className
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      style={style}
    >
      {/* Row 1: Title + Status Chip */}
      <div className="flex items-start justify-between gap-3">
        <h3 className={cn(
          'text-sm font-medium text-foreground leading-snug flex-1',
          isComplete && 'line-through text-muted-foreground'
        )}>
          {task.title}
        </h3>
      </div>

      {/* Row 2: Location • Time (red if overdue) */}
      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" />
          {task.zone}
        </span>
        <span className="text-muted-foreground/40">•</span>
        <span className={cn('flex items-center gap-1', isOverdue && 'text-[#991B1B] font-medium')}>
          <Clock className="w-3.5 h-3.5" />
          {isComplete ? 'Done' : isOverdue ? 'Overdue' : formatSLATime(remainingMinutes)}
        </span>
      </div>

      {/* Row 3: Footer with hairline divider */}
      <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
        {/* Left: Assignee */}
        <div className="flex items-center gap-2 text-xs">
          {task.assigneeName ? (
            <>
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-medium text-primary">
                {getInitials(task.assigneeName)}
              </div>
              <span className="text-foreground/70">{task.assigneeName}</span>
            </>
          ) : (
            <span className="text-foreground/50">Unassigned</span>
          )}
        </div>

        {/* Right: Action button - Primark cyan with white text */}
        {task.status !== 'complete' && (
          task.assigneeName ? (
            <button
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary text-white text-xs font-medium hover:bg-primary/90 transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                onQuickComplete?.(task.id)
              }}
            >
              <Check className="w-3.5 h-3.5" />
              Complete
            </button>
          ) : (
            <button
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary text-white text-xs font-medium hover:bg-primary/90 transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                onAssignToMe?.(task.id)
              }}
            >
              <Plus className="w-3.5 h-3.5" />
              Claim
            </button>
          )
        )}
      </div>
    </Card>
  )
}
