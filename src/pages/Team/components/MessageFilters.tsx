import { cn } from '@/lib/utils'
import type { MessageFilter } from '@/types'

interface MessageFiltersProps {
  activeFilter: MessageFilter
  onFilterChange: (filter: MessageFilter) => void
  className?: string
}

const filters: { value: MessageFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'announcements', label: 'Announcements' },
  { value: 'my-zone', label: 'My Zone' },
]

export function MessageFilters({
  activeFilter,
  onFilterChange,
  className,
}: MessageFiltersProps) {
  return (
    <div className={cn('flex gap-2', className)}>
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-full transition-all',
            'active:scale-[0.98]',
            activeFilter === filter.value
              ? 'bg-primary text-white shadow-sm'
              : 'bg-slate-100 text-muted-foreground hover:bg-slate-200'
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}
