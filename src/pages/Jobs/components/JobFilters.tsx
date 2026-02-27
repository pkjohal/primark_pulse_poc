import { cn } from '@/lib/utils'
import type { JobFilter } from '@/types'

interface JobFiltersProps {
  activeFilter: JobFilter
  onFilterChange: (filter: JobFilter) => void
  filters: { value: JobFilter; label: string }[]
  className?: string
}

export function JobFilters({
  activeFilter,
  onFilterChange,
  filters,
  className,
}: JobFiltersProps) {
  return (
    <div className={cn('flex gap-2', className)}>
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-full transition-colors shrink-0 min-h-[44px]',
            activeFilter === filter.value
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}
