import { useState, useMemo } from 'react'
import { CalendarPlus, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'
import { useToast } from '@/components/ui/toast'
import {
  useSchedule,
  useAvailableShifts,
  useOfferShift,
  useCancelOffer,
  useAcceptShift,
  getTodayShift,
} from '@/hooks/useSchedule'
import { ShiftProgressCard } from './components/ShiftProgressCard'
import { ShiftListItem, DayOffCard } from './components/ShiftListItem'
import { SwapShiftCard } from './components/SwapShiftCard'

function formatDateKey(date: Date): string {
  return date.toISOString().split('T')[0]
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

// Returns the Monday of the week containing `base`, offset by `weekOffset` weeks
function getWeekMonday(base: Date, weekOffset: number): Date {
  const d = new Date(base)
  d.setHours(0, 0, 0, 0)
  const day = d.getDay()
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1) + weekOffset * 7)
  return d
}

export default function SchedulePage() {
  const toast = useToast()
  const [weekOffset, setWeekOffset] = useState(0)

  const { data: schedule, isLoading: scheduleLoading } = useSchedule()
  const { data: availableShifts, isLoading: availableLoading } = useAvailableShifts()

  const offerShift = useOfferShift()
  const cancelOffer = useCancelOffer()
  const acceptShift = useAcceptShift()

  const today = new Date()
  const todayKey = formatDateKey(today)
  const todayShift = getTodayShift(schedule)
  const isCurrentWeek = weekOffset === 0

  // Monday of the selected week
  const weekStart = useMemo(() => getWeekMonday(today, weekOffset), [weekOffset])

  // All 7 days of the selected week
  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => formatDateKey(addDays(weekStart, i))),
    [weekStart]
  )

  // "3 Feb – 9 Feb" label
  const weekLabel = useMemo(() => {
    const end = addDays(weekStart, 6)
    const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }
    return `${weekStart.toLocaleDateString('en-GB', opts)} – ${end.toLocaleDateString('en-GB', opts)}`
  }, [weekStart])

  const handleOfferSwap = (shiftId: string) => {
    offerShift.mutate(shiftId, {
      onSuccess: () => toast.success('Shift offered for swap'),
      onError: () => toast.error('Failed to offer shift'),
    })
  }

  const handleCancelOffer = (shiftId: string) => {
    cancelOffer.mutate(shiftId, {
      onSuccess: () => toast.info('Swap offer cancelled'),
      onError: () => toast.error('Failed to cancel offer'),
    })
  }

  const handleAcceptShift = (shiftId: string) => {
    acceptShift.mutate(shiftId, {
      onSuccess: () => toast.success('Shift accepted!'),
      onError: () => toast.error('Failed to accept shift'),
    })
  }

  const isLoading = scheduleLoading || availableLoading

  return (
    <div className="p-4 space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <h1 className="text-xl font-semibold text-foreground">Schedule</h1>
        <Button size="sm" className="gap-1.5">
          <CalendarPlus className="w-4 h-4" />
          Request Time Off
        </Button>
      </div>

      {/* Today's shift hero — only shown on current week */}
      {isCurrentWeek && (
        isLoading ? (
          <Card className="p-4 space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-8 w-full" />
          </Card>
        ) : todayShift ? (
          <div className="animate-fade-in-up animation-delay-100">
            <ShiftProgressCard shift={todayShift} />
          </div>
        ) : (
          <Card className="p-4 text-center animate-fade-in-up animation-delay-100">
            <p className="text-sm text-muted-foreground">No shift scheduled today</p>
          </Card>
        )
      )}

      {/* Week navigator */}
      <div className="flex items-center justify-between animate-fade-in-up animation-delay-150">
        <button
          onClick={() => setWeekOffset(w => w - 1)}
          disabled={weekOffset === 0}
          className="p-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-30 disabled:pointer-events-none"
          aria-label="Previous week"
        >
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">{weekLabel}</p>
          {isCurrentWeek && (
            <p className="text-xs text-primary font-medium">This week</p>
          )}
        </div>
        <button
          onClick={() => setWeekOffset(w => w + 1)}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
          aria-label="Next week"
        >
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Upcoming Schedule */}
      <div className="space-y-3 animate-fade-in-up animation-delay-200">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Upcoming Schedule
        </h2>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        ) : (
          <div className="space-y-3">
            {weekDays
              // Exclude today (shown in hero) and any past days
              .filter(date => date > todayKey)
              .map((date, index) => {
                const shift = schedule?.find(s => s.date === date)
                const available = availableShifts?.filter(s => s.date === date) ?? []

                if (shift) {
                  return (
                    <div key={date} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                      <ShiftListItem
                        shift={shift}
                        onOfferSwap={handleOfferSwap}
                        onCancelOffer={handleCancelOffer}
                        isPending={offerShift.isPending || cancelOffer.isPending}
                      />
                    </div>
                  )
                }

                if (available.length > 0) {
                  return available.map(avail => (
                    <div key={avail.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                      <SwapShiftCard
                        shift={avail}
                        onAccept={handleAcceptShift}
                        isPending={acceptShift.isPending}
                      />
                    </div>
                  ))
                }

                return (
                  <div key={date} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                    <DayOffCard date={date} />
                  </div>
                )
              })}
          </div>
        )}
      </div>

    </div>
  )
}
