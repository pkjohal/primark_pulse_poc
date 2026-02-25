import { useState, useEffect } from 'react'
import { Coffee, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import {
  parseTimeToMinutes,
  getCurrentMinutes,
  formatRemainingTime,
  isOnBreak,
} from '@/hooks/useSchedule'
import { formatTime } from '@/lib/utils'
import type { ScheduledShift } from '@/types'

interface ShiftProgressCardProps {
  shift: ScheduledShift
  className?: string
}

export function ShiftProgressCard({ shift, className }: ShiftProgressCardProps) {
  const [now, setNow] = useState(getCurrentMinutes())

  // Update every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(getCurrentMinutes())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  const shiftStart = parseTimeToMinutes(shift.startTime)
  const shiftEnd = parseTimeToMinutes(shift.endTime)
  const totalDuration = shiftEnd - shiftStart

  // Calculate progress
  const elapsed = Math.max(0, now - shiftStart)
  const remaining = Math.max(0, shiftEnd - now)
  const progressPercent = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100))

  // Break zone calculations
  const breakStart = shift.breakStart ? parseTimeToMinutes(shift.breakStart) : null
  const breakDuration = shift.breakDuration ?? 0
  const breakStartPercent = breakStart
    ? ((breakStart - shiftStart) / totalDuration) * 100
    : 0
  const breakWidthPercent = breakStart
    ? (breakDuration / totalDuration) * 100
    : 0

  // Status checks
  const onBreak = isOnBreak(shift)
  const shiftEnded = now >= shiftEnd
  const shiftNotStarted = now < shiftStart
  const isOvertime = now > shiftEnd

  // Time until break
  const minutesUntilBreak = breakStart ? breakStart - now : null
  const showBreakReminder =
    minutesUntilBreak !== null &&
    minutesUntilBreak > 0 &&
    minutesUntilBreak <= 30 &&
    !onBreak

  return (
    <Card className={cn('p-4 space-y-3', className)}>
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Current Shift</p>
          <p className="text-sm font-medium text-foreground">{shift.zone}</p>
        </div>
        <div
          className={cn(
            'px-2.5 py-1 rounded-full text-xs font-semibold',
            onBreak
              ? 'bg-amber-100 text-amber-700'
              : isOvertime
                ? 'bg-red-100 text-red-700'
                : shiftEnded
                  ? 'bg-muted text-muted-foreground'
                  : 'bg-emerald-100 text-emerald-700 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
          )}
        >
          {onBreak ? 'On Break' : isOvertime ? 'Overtime' : shiftEnded ? 'Ended' : 'Active'}
        </div>
      </div>

      {/* Big remaining time - THE HERO */}
      {!shiftEnded && !shiftNotStarted && (
        <div className="text-center py-1">
          <p
            className={cn(
              'text-5xl font-extrabold tracking-tight',
              isOvertime ? 'text-red-600' : 'text-foreground'
            )}
          >
            {isOvertime ? '+' : ''}
            {formatRemainingTime(isOvertime ? now - shiftEnd : remaining)}
          </p>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isOvertime ? 'overtime' : 'remaining'}
          </p>
        </div>
      )}

      {shiftNotStarted && (
        <div className="text-center py-1">
          <p className="text-5xl font-extrabold tracking-tight text-foreground">
            {formatRemainingTime(shiftStart - now)}
          </p>
          <p className="text-sm text-muted-foreground mt-0.5">until shift starts</p>
        </div>
      )}

      {/* Progress bar with gradient */}
      <div className="space-y-1.5">
        <div className="relative h-2.5 bg-slate-100 rounded-full overflow-hidden">
          {/* Progress fill with gradient */}
          <div
            className={cn(
              'absolute inset-y-0 left-0 rounded-full transition-all duration-1000',
              onBreak
                ? 'bg-gradient-to-r from-amber-400 to-amber-300'
                : isOvertime
                  ? 'bg-gradient-to-r from-red-500 to-red-400'
                  : 'bg-gradient-to-r from-primary to-cyan-400'
            )}
            style={{ width: `${progressPercent}%` }}
          />

          {/* Break zone overlay */}
          {breakStart && (
            <div
              className="absolute inset-y-0 bg-slate-300/60 rounded-sm"
              style={{
                left: `${breakStartPercent}%`,
                width: `${breakWidthPercent}%`,
              }}
            >
              {/* Diagonal stripes */}
              <div
                className="w-full h-full opacity-50"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 4px)',
                }}
              />
            </div>
          )}

          {/* Now marker */}
          {!shiftEnded && !shiftNotStarted && (
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-foreground rounded-full shadow-md"
              style={{ left: `calc(${progressPercent}% - 6px)` }}
            />
          )}
        </div>

        {/* Time labels */}
        <div className="flex justify-between text-[11px] text-muted-foreground">
          <span>{formatTime(shift.startTime)}</span>
          <span>{formatTime(shift.endTime)}</span>
        </div>
      </div>

      {/* Break reminder */}
      {showBreakReminder && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200">
          <Coffee className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="text-sm text-amber-800 font-medium">
            Break at {formatTime(shift.breakStart!)} · in {minutesUntilBreak}m
          </span>
        </div>
      )}

      {onBreak && shift.breakStart && shift.breakDuration && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200">
          <Coffee className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="text-sm text-amber-800 font-medium">
            Break ends at{' '}
            {formatTime(
              `${Math.floor((breakStart! + breakDuration) / 60)
                .toString()
                .padStart(2, '0')}:${((breakStart! + breakDuration) % 60).toString().padStart(2, '0')}`
            )}
          </span>
        </div>
      )}

      {isOvertime && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span className="text-sm text-red-800 font-medium">
            You're working overtime
          </span>
        </div>
      )}

      {/* Role at bottom */}
      <p className="text-xs text-muted-foreground text-center pt-1 border-t">
        {shift.role}
      </p>
    </Card>
  )
}
