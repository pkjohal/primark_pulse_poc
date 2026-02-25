import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { formatTime } from '@/lib/utils'
import type { AvailableShift } from '@/types'

interface SwapShiftCardProps {
  shift: AvailableShift
  onAccept?: (shiftId: string) => void
  isPending?: boolean
  className?: string
}

// Format date for display
function formatShiftDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  const today = new Date()
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  ) {
    return 'Today'
  }

  if (
    date.getFullYear() === tomorrow.getFullYear() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getDate() === tomorrow.getDate()
  ) {
    return 'Tomorrow'
  }

  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  })
}

// Get initials from name
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function SwapShiftCard({
  shift,
  onAccept,
  isPending = false,
  className,
}: SwapShiftCardProps) {
  return (
    <Card
      className={cn(
        'p-4 transition-all overflow-hidden',
        // Solid thin gold border with cream background - premium "opportunity" look
        'border border-amber-400/60 bg-[#FFFEF5]',
        className
      )}
    >
      {/* Date header with badge */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-foreground">
          {formatShiftDate(shift.date)}
        </p>
        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
          Open Shift
        </span>
      </div>

      {/* Time - Hero element */}
      <p className="text-lg font-bold text-foreground">
        {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
      </p>

      {/* Role + Zone */}
      <p className="text-sm text-muted-foreground mt-1">
        {shift.role} · {shift.zone}
      </p>

      {/* Who offered + reason - Avatar style, no inner border */}
      <div className="mt-3 flex items-center gap-3">
        {/* Avatar with initials */}
        <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center shrink-0">
          <span className="text-white text-xs font-bold">
            {getInitials(shift.offeredByName)}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm">
            <span className="font-semibold text-foreground">{shift.offeredByName}</span>
            <span className="text-muted-foreground"> needs cover</span>
          </p>
          {shift.reason && (
            <p className="text-xs text-muted-foreground truncate">{shift.reason}</p>
          )}
        </div>
      </div>

      {/* Accept button - Pill shaped */}
      {onAccept && (
        <button
          type="button"
          onClick={() => onAccept(shift.id)}
          disabled={isPending}
          className={cn(
            'w-full mt-4 py-2.5 rounded-full text-sm font-semibold',
            'bg-amber-500 hover:bg-amber-600 text-white',
            'transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {isPending ? 'Claiming...' : 'Claim Shift'}
        </button>
      )}
    </Card>
  )
}
