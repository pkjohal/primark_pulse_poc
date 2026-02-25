import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { ChecklistItem } from './ChecklistItem'
import type { ChecklistCategory } from '@/types'

interface ChecklistSectionProps {
  category: ChecklistCategory
  onToggleItem: (id: string, completed: boolean) => void
  defaultExpanded?: boolean
  className?: string
}

export function ChecklistSection({
  category,
  onToggleItem,
  defaultExpanded = true,
  className,
}: ChecklistSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)

  const isComplete = category.completedCount === category.totalCount

  return (
    <Card className={cn('overflow-hidden', className)}>
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className={cn(
          'w-full flex items-center justify-between p-4',
          'text-left transition-colors',
          'hover:bg-muted/50 active:bg-muted',
          'min-h-touch'
        )}
      >
        <div className="flex items-center gap-2">
          {expanded ? (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          )}
          <span className="font-medium text-foreground">{category.name}</span>
        </div>
        <span
          className={cn(
            'text-sm font-medium',
            isComplete ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          {category.completedCount}/{category.totalCount}
        </span>
      </button>

      {/* Expandable Content */}
      {expanded && (
        <div className="border-t border-border">
          {category.items.map((item) => (
            <ChecklistItem
              key={item.id}
              item={item}
              onToggle={onToggleItem}
            />
          ))}
        </div>
      )}
    </Card>
  )
}
