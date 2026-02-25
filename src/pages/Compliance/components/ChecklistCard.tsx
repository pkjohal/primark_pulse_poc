import { CheckCircle2, Clock, AlertTriangle, ChevronRight, Play } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type { ChecklistSummary } from '@/types'

interface ChecklistCardProps {
  checklist: ChecklistSummary
  onClick?: () => void
  className?: string
  style?: React.CSSProperties
}

const statusConfig = {
  'not-started': {
    icon: Clock,
    label: 'Not started',
    iconColor: 'text-muted-foreground',
    bgColor: 'bg-muted/50',
  },
  'in-progress': {
    icon: Play,
    label: 'In progress',
    iconColor: 'text-[#F57C00]',
    bgColor: 'bg-[#F57C00]/10',
  },
  'completed': {
    icon: CheckCircle2,
    label: 'Completed',
    iconColor: 'text-[#388E3C]',
    bgColor: 'bg-[#388E3C]/10',
  },
}

export function ChecklistCard({ checklist, onClick, className, style }: ChecklistCardProps) {
  const config = statusConfig[checklist.status]
  const StatusIcon = config.icon
  const progress = checklist.totalItems > 0
    ? Math.round((checklist.completedItems / checklist.totalItems) * 100)
    : 0

  return (
    <Card
      variant="interactive"
      className={cn(
        'p-4 bg-white border border-slate-200 rounded',
        'hover:border-slate-300 active:scale-[0.99] transition-all',
        className
      )}
      style={style}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-start gap-3">
        {/* Status Icon */}
        <div className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
          config.bgColor
        )}>
          <StatusIcon className={cn('w-5 h-5', config.iconColor)} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-medium text-foreground">
                {checklist.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {checklist.scheduledTime && `Due by ${checklist.dueBy}`}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
          </div>

          {/* Progress */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className={cn(
                'font-medium',
                checklist.status === 'completed' ? 'text-[#388E3C]' : 'text-muted-foreground'
              )}>
                {checklist.completedItems} of {checklist.totalItems} items
              </span>
              <span className="text-muted-foreground">{progress}%</span>
            </div>
            <Progress
              value={progress}
              className="h-1.5"
              indicatorClassName={checklist.status === 'completed' ? 'bg-[#388E3C]' : 'bg-primary'}
            />
          </div>

          {/* Flagged Issues Warning */}
          {checklist.flaggedIssues > 0 && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-[#F57C00]">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{checklist.flaggedIssues} issue{checklist.flaggedIssues > 1 ? 's' : ''} flagged</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
