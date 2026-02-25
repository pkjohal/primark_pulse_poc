import { ArrowRightLeft, X, Palmtree } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { formatTime } from '@/lib/utils'
import type { ScheduledShift } from '@/types'

interface ShiftListItemProps {
  shift: ScheduledShift
  isToday?: boolean
  onOfferSwap?: (shiftId: string) => void
  onCancelOffer?: (shiftId: string) => void
  isPending?: boolean
  className?: string
}

// Format date for display
function formatShiftDate(dateStr: string, isToday: boolean): string {
  if (isToday) return 'Today'

  const date = new Date(dateStr + 'T00:00:00')
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (
    date.getFullYear() === tomorrow.getFullYear() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getDate() === tomorrow.getDate()
  ) {
    return 'Tomorrow'
  }

  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export function ShiftListItem({
  shift,
  isToday = false,
  onOfferSwap,
  onCancelOffer,
  isPending = false,
  className,
}: ShiftListItemProps) {
  const isPendingSwap = shift.status === 'pending-swap'

  return (
    <Card
      className={cn(
        'p-3 transition-all overflow-hidden',
        // Amber styling for pending swap
        isPendingSwap && 'bg-amber-50/50 border-amber-200',
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left: Date + Time + Details */}
        <div className="flex-1 min-w-0">
          {/* Date row with status */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-muted-foreground">
              {formatShiftDate(shift.date, isToday)}
            </span>
            {isPendingSwap && (
              <span className="px-1.5 py-0.5 rounded bg-amber-200 text-amber-800 text-[10px] font-semibold uppercase">
                Swap Pending
              </span>
            )}
          </div>

          {/* Time - Hero element */}
          <p className="text-lg font-bold text-foreground">
            {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
          </p>

          {/* Role + Zone - Secondary info */}
          <p className="text-sm text-muted-foreground truncate">
            {shift.role} · {shift.zone}
          </p>
        </div>

        {/* Right: Action - Ghost button style */}
        {shift.status === 'confirmed' && onOfferSwap && (
          <button
            type="button"
            onClick={() => onOfferSwap(shift.id)}
            disabled={isPending}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium',
              'border border-slate-300 text-slate-500 bg-transparent',
              'hover:border-primary hover:text-primary hover:bg-primary/5',
              'transition-all whitespace-nowrap',
              'disabled:opacity-50'
            )}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            {isPending ? 'Offering...' : 'Offer Swap'}
          </button>
        )}

        {isPendingSwap && onCancelOffer && (
          <button
            type="button"
            onClick={() => onCancelOffer(shift.id)}
            disabled={isPending}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium',
              'border border-amber-400 text-amber-700 bg-amber-100',
              'hover:bg-amber-200',
              'transition-all whitespace-nowrap',
              'disabled:opacity-50'
            )}
          >
            <X className="w-3.5 h-3.5" />
            {isPending ? 'Cancelling...' : 'Cancel'}
          </button>
        )}
      </div>
    </Card>
  )
}

// Day off card
interface DayOffCardProps {
  date: string
  className?: string
}

export function DayOffCard({ date, className }: DayOffCardProps) {
  const dateObj = new Date(date + 'T00:00:00')
  const formattedDate = dateObj.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  })

  return (
    <Card className={cn('p-4 bg-muted/30', className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{formattedDate}</p>
        <Palmtree className="w-5 h-5 text-muted-foreground/50" />
      </div>
      <p className="text-sm text-muted-foreground mt-2">Day Off</p>
    </Card>
  )
}
