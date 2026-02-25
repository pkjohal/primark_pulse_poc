import { Checkbox } from '@/components/ui/checkbox'
import { cn, formatRelativeTime } from '@/lib/utils'
import type { ChecklistItem as ChecklistItemType } from '@/types'

interface ChecklistItemProps {
  item: ChecklistItemType
  onToggle: (id: string, completed: boolean) => void
  className?: string
}

export function ChecklistItem({ item, onToggle, className }: ChecklistItemProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 py-3 px-4',
        'border-b border-border last:border-b-0',
        className
      )}
    >
      <Checkbox
        id={item.id}
        checked={item.completed}
        onCheckedChange={(checked) => onToggle(item.id, checked === true)}
        className="mt-0.5"
      />
      <div className="flex-1 min-w-0">
        <label
          htmlFor={item.id}
          className={cn(
            'text-sm cursor-pointer',
            item.completed ? 'text-muted-foreground line-through' : 'text-foreground'
          )}
        >
          {item.item}
        </label>
        {item.completed && item.completedAt && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {item.completedBy} • {formatRelativeTime(item.completedAt)}
          </p>
        )}
      </div>
    </div>
  )
}
