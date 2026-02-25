import { useState, useMemo } from 'react'
import { ChevronLeft, CalendarPlus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
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
import { WeekStrip } from './components/WeekStrip'
import { ShiftListItem, DayOffCard } from './components/ShiftListItem'
import { SwapShiftCard } from './components/SwapShiftCard'

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

export default function SchedulePage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const { data: schedule, isLoading: scheduleLoading } = useSchedule()
  const { data: availableShifts, isLoading: availableLoading } = useAvailableShifts()

  const offerShift = useOfferShift()
  const cancelOffer = useCancelOffer()
  const acceptShift = useAcceptShift()

  const today = new Date()
  const todayKey = formatDateKey(today)
  const todayShift = getTodayShift(schedule)

  // Generate all 7 days for the list
  const allDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(today, i)
      return formatDateKey(date)
    })
  }, [])

  // Filter shifts based on selected date
  const filteredSchedule = useMemo(() => {
    if (!schedule) return []
    if (!selectedDate) return schedule
    return schedule.filter((s) => s.date === selectedDate)
  }, [schedule, selectedDate])

  // Filter available shifts based on selected date
  const filteredAvailable = useMemo(() => {
    if (!availableShifts) return []
    if (!selectedDate) return availableShifts
    return availableShifts.filter((s) => s.date === selectedDate)
  }, [availableShifts, selectedDate])

  // Get days without shifts (for day off cards)
  const daysOff = useMemo(() => {
    if (!schedule) return []
    const shiftDates = new Set(schedule.map((s) => s.date))
    const availableDates = new Set(availableShifts?.map((s) => s.date) ?? [])

    return allDays.filter((date) => {
      // Skip if there's a shift or available shift on this day
      if (shiftDates.has(date) || availableDates.has(date)) return false
      // If filtering by date, only show if it matches
      if (selectedDate && date !== selectedDate) return false
      return true
    })
  }, [schedule, availableShifts, allDays, selectedDate])

  const handleOfferSwap = (shiftId: string) => {
    offerShift.mutate(shiftId, {
      onSuccess: () => {
        toast.success('Shift offered for swap')
      },
      onError: () => {
        toast.error('Failed to offer shift')
      },
    })
  }

  const handleCancelOffer = (shiftId: string) => {
    cancelOffer.mutate(shiftId, {
      onSuccess: () => {
        toast.info('Swap offer cancelled')
      },
      onError: () => {
        toast.error('Failed to cancel offer')
      },
    })
  }

  const handleAcceptShift = (shiftId: string) => {
    acceptShift.mutate(shiftId, {
      onSuccess: () => {
        toast.success('Shift accepted!')
      },
      onError: () => {
        toast.error('Failed to accept shift')
      },
    })
  }

  const isLoading = scheduleLoading || availableLoading

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-lg font-semibold">Schedule</h1>
          <Button variant="ghost" size="sm" className="gap-1 text-primary">
            <CalendarPlus className="w-4 h-4" />
            <span className="sr-only sm:not-sr-only">Time Off</span>
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4 pb-24">
        {/* Today's Shift Hero Card */}
        {isLoading ? (
          <Card className="p-4 space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-8 w-full" />
          </Card>
        ) : todayShift ? (
          <div className="animate-fade-in-up">
            <ShiftProgressCard shift={todayShift} />
          </div>
        ) : (
          <Card className="p-4 text-center animate-fade-in-up">
            <p className="text-sm text-muted-foreground">No shift scheduled today</p>
          </Card>
        )}

        {/* Week Strip */}
        <div className="animate-fade-in-up animation-delay-100">
          <WeekStrip
            schedule={schedule ?? []}
            availableShifts={availableShifts ?? []}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        </div>

        {/* Upcoming Shifts Section */}
        <div className="space-y-3 animate-fade-in-up animation-delay-200">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {selectedDate ? 'Selected Day' : 'Upcoming Shifts'}
          </h2>

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-28 w-full rounded-xl" />
              <Skeleton className="h-28 w-full rounded-xl" />
            </div>
          ) : (
            <div className="space-y-3">
              {/* User's scheduled shifts */}
              {filteredSchedule
                .filter((s) => s.date !== todayKey) // Exclude today (shown in hero)
                .map((shift) => (
                  <ShiftListItem
                    key={shift.id}
                    shift={shift}
                    onOfferSwap={handleOfferSwap}
                    onCancelOffer={handleCancelOffer}
                    isPending={offerShift.isPending || cancelOffer.isPending}
                  />
                ))}

              {/* Days off */}
              {daysOff
                .filter((date) => date !== todayKey)
                .map((date) => (
                  <DayOffCard key={date} date={date} />
                ))}

              {filteredSchedule.filter((s) => s.date !== todayKey).length === 0 &&
                daysOff.filter((d) => d !== todayKey).length === 0 &&
                filteredAvailable.length === 0 && (
                  <Card className="p-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      {selectedDate
                        ? 'No shifts on this day'
                        : 'No upcoming shifts scheduled'}
                    </p>
                  </Card>
                )}
            </div>
          )}
        </div>

        {/* Open Shifts / Marketplace Section */}
        {filteredAvailable.length > 0 && (
          <div className="space-y-3 animate-fade-in-up animation-delay-300">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Open Shifts
            </h2>
            <div className="space-y-3">
              {filteredAvailable.map((shift) => (
                <SwapShiftCard
                  key={shift.id}
                  shift={shift}
                  onAccept={handleAcceptShift}
                  isPending={acceptShift.isPending}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
