import { useState } from 'react'
import { ChevronDown, ChevronRight, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { EnhancedChecklistItem } from './EnhancedChecklistItem'
import type { ChecklistSectionEnhanced, ChecklistItemResponse } from '@/types'

interface EnhancedChecklistSectionProps {
  section: ChecklistSectionEnhanced
  onItemSubmit: (itemId: string, response: Omit<ChecklistItemResponse, 'completedAt'>) => void
  onItemFlagIssue: (itemId: string) => void
  defaultExpanded?: boolean
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
}

export function EnhancedChecklistSection({
  section,
  onItemSubmit,
  onItemFlagIssue,
  defaultExpanded = false,
  disabled,
  className,
  style,
}: EnhancedChecklistSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)

  const progress = section.totalCount > 0
    ? Math.round((section.completedCount / section.totalCount) * 100)
    : 0
  const isComplete = section.completedCount === section.totalCount

  return (
    <div className={cn('space-y-3', className)} style={style}>
      {/* Section Header */}
      <Card
        className={cn(
          'overflow-hidden bg-white border border-slate-200 rounded',
          isComplete && 'border-[#388E3C]/30'
        )}
      >
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className={cn(
            'w-full flex items-center gap-3 p-4',
            'text-left transition-colors',
            'hover:bg-muted/50 active:bg-muted'
          )}
        >
          {/* Expand/Collapse Icon */}
          {expanded ? (
            <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
          ) : (
            <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
          )}

          {/* Section Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">
                {section.name}
              </h3>
              {isComplete && (
                <CheckCircle2 className="w-4 h-4 text-[#388E3C]" />
              )}
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className={cn(
                'text-xs font-medium',
                isComplete ? 'text-[#388E3C]' : 'text-muted-foreground'
              )}>
                {section.completedCount}/{section.totalCount} items
              </span>
              <Progress
                value={progress}
                className="flex-1 h-1.5 max-w-[100px]"
                indicatorClassName={isComplete ? 'bg-[#388E3C]' : 'bg-primary'}
              />
            </div>
          </div>
        </button>
      </Card>

      {/* Section Items */}
      {expanded && (
        <div className="space-y-3 pl-2">
          {section.items.map((item, index) => (
            <EnhancedChecklistItem
              key={item.id}
              item={item}
              onSubmit={(response) => onItemSubmit(item.id, response)}
              onFlagIssue={() => onItemFlagIssue(item.id)}
              disabled={disabled}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` } as React.CSSProperties}
            />
          ))}
        </div>
      )}
    </div>
  )
}
