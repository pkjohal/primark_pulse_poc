import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import type { ScheduledShift, AvailableShift } from '@/types'

interface WeekStripProps {
  schedule: ScheduledShift[]
  availableShifts: AvailableShift[]
  selectedDate: string | null
  onSelectDate: (date: string | null) => void
  className?: string
}

// Helper to format date as YYYY-MM-DD
function formatDateKey(date: Date): string {
  return date.toISOString().split('T')[0]
}

// Helper to add days
function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

// Format day name (Mon, Tue, etc.)
function formatDayName(date: Date): string {
  return date.toLocaleDateString('en-GB', { weekday: 'short' })
}

// Format day number
function formatDayNum(date: Date): string {
  return date.getDate().toString()
}

// Check if two dates are the same day
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

export function WeekStrip({
  schedule,
  availableShifts,
  selectedDate,
  onSelectDate,
  className,
}: WeekStripProps) {
  const today = new Date()

  // Generate 7 days starting from today
  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(today, i)
      const dateKey = formatDateKey(date)

      const hasShift = schedule.some((s) => s.date === dateKey)
      const hasPendingSwap = schedule.some(
        (s) => s.date === dateKey && s.status === 'pending-swap'
      )
      const hasAvailableShift = availableShifts.some((s) => s.date === dateKey)

      return {
        date,
        dateKey,
        dayName: formatDayName(date),
        dayNum: formatDayNum(date),
        isToday: isSameDay(date, today),
        hasShift,
        hasPendingSwap,
        hasAvailableShift,
      }
    })
  }, [schedule, availableShifts])

  const handleSelect = (dateKey: string) => {
    // Toggle selection - if already selected, deselect (show all)
    onSelectDate(selectedDate === dateKey ? null : dateKey)
  }

  return (
    <div className={cn('overflow-x-auto scrollbar-hide -mx-4 px-4', className)}>
      <div className="flex gap-1.5 min-w-max">
        {days.map((day) => {
          const isSelected = selectedDate === day.dateKey

          return (
            <button
              key={day.dateKey}
              type="button"
              onClick={() => handleSelect(day.dateKey)}
              className={cn(
                'flex flex-col items-center px-3 py-2 rounded-xl transition-all min-w-[48px]',
                isSelected
                  ? 'bg-primary shadow-md'
                  : day.isToday
                    ? 'bg-primary/10'
                    : 'bg-slate-100 hover:bg-slate-200'
              )}
            >
              {/* Day name */}
              <span
                className={cn(
                  'text-[10px] font-medium uppercase tracking-wide',
                  isSelected
                    ? 'text-white/90'
                    : day.isToday
                      ? 'text-primary'
                      : 'text-muted-foreground'
                )}
              >
                {day.isToday ? 'Today' : day.dayName}
              </span>

              {/* Day number */}
              <span
                className={cn(
                  'text-lg font-bold leading-tight',
                  isSelected ? 'text-white' : 'text-foreground'
                )}
              >
                {day.dayNum}
              </span>

              {/* Status dot - matches card states exactly */}
              <div className="h-2 flex items-center justify-center mt-0.5">
                {day.hasAvailableShift ? (
                  // Orange dot = Open shift available (matches dashed amber cards)
                  <div
                    className={cn(
                      'w-1.5 h-1.5 rounded-full',
                      isSelected ? 'bg-white' : 'bg-amber-500'
                    )}
                  />
                ) : day.hasPendingSwap ? (
                  // Amber dot = Swap pending (matches amber background cards)
                  <div
                    className={cn(
                      'w-1.5 h-1.5 rounded-full',
                      isSelected ? 'bg-amber-200' : 'bg-amber-400'
                    )}
                  />
                ) : day.hasShift ? (
                  // Cyan dot = Confirmed shift (matches primary color)
                  <div
                    className={cn(
                      'w-1.5 h-1.5 rounded-full',
                      isSelected ? 'bg-white' : 'bg-primary'
                    )}
                  />
                ) : (
                  // Faint dot = Day off
                  <div
                    className={cn(
                      'w-1.5 h-1.5 rounded-full',
                      isSelected ? 'bg-white/40' : 'bg-slate-300'
                    )}
                  />
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
