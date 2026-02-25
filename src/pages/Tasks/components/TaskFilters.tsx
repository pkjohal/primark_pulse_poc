import { useRef, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import type { TaskFilter } from '@/hooks/useTasks'

interface TaskFiltersProps {
  activeFilter: TaskFilter
  onFilterChange: (filter: TaskFilter) => void
  className?: string
}

const filters: { value: TaskFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'my-tasks', label: 'My Tasks' },
  { value: 'unassigned', label: 'Unassigned' },
]

export function TaskFilters({
  activeFilter,
  onFilterChange,
  className,
}: TaskFiltersProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [thumbStyle, setThumbStyle] = useState<{ width: number; transform: string }>({
    width: 0,
    transform: 'translateX(0)',
  })

  // Calculate thumb position based on active filter
  useEffect(() => {
    if (!containerRef.current) return

    const updateThumbPosition = () => {
      const buttons = containerRef.current?.querySelectorAll('button')
      if (!buttons) return

      const activeIndex = filters.findIndex((f) => f.value === activeFilter)
      const activeButton = buttons[activeIndex] as HTMLButtonElement

      if (activeButton) {
        setThumbStyle({
          width: activeButton.offsetWidth,
          transform: `translateX(${activeButton.offsetLeft - 4}px)`, // -4 for container padding
        })
      }
    }

    // Initial calculation
    updateThumbPosition()

    // Recalculate on window resize
    window.addEventListener('resize', updateThumbPosition)
    return () => window.removeEventListener('resize', updateThumbPosition)
  }, [activeFilter])

  return (
    <div
      ref={containerRef}
      className={cn('relative inline-flex bg-muted rounded-full p-1', className)}
    >
      {/* Sliding thumb */}
      <div
        className="absolute top-1 bottom-1 bg-white rounded-full shadow-sm transition-all duration-200 ease-out"
        style={thumbStyle}
      />

      {/* Filter buttons */}
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={cn(
            'relative z-10 px-4 py-1.5 text-sm rounded-full transition-colors min-h-[36px]',
            activeFilter === filter.value
              ? 'font-semibold text-foreground'
              : 'font-medium text-muted-foreground hover:text-foreground'
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}
