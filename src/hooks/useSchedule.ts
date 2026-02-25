import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { ScheduledShift, AvailableShift } from '@/types'

// Fetch user's schedule
async function fetchSchedule(): Promise<ScheduledShift[]> {
  const res = await fetch('/api/schedule')
  if (!res.ok) {
    throw new Error('Failed to fetch schedule')
  }
  return res.json()
}

// Fetch available shifts for swap
async function fetchAvailableShifts(): Promise<AvailableShift[]> {
  const res = await fetch('/api/schedule/available')
  if (!res.ok) {
    throw new Error('Failed to fetch available shifts')
  }
  return res.json()
}

export function useSchedule() {
  return useQuery({
    queryKey: ['schedule'],
    queryFn: fetchSchedule,
  })
}

export function useAvailableShifts() {
  return useQuery({
    queryKey: ['schedule', 'available'],
    queryFn: fetchAvailableShifts,
  })
}

// Offer shift for swap
async function offerShift(shiftId: string): Promise<void> {
  const res = await fetch(`/api/schedule/offer/${shiftId}`, {
    method: 'POST',
  })
  if (!res.ok) {
    throw new Error('Failed to offer shift')
  }
}

export function useOfferShift() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: offerShift,
    onMutate: async (shiftId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['schedule'] })

      // Snapshot current data
      const previousSchedule = queryClient.getQueryData<ScheduledShift[]>(['schedule'])

      // Optimistically update to pending-swap
      queryClient.setQueryData<ScheduledShift[]>(['schedule'], (old) => {
        if (!old) return old
        return old.map((shift) =>
          shift.id === shiftId ? { ...shift, status: 'pending-swap' as const } : shift
        )
      })

      return { previousSchedule }
    },
    onError: (_err, _shiftId, context) => {
      // Rollback on error
      if (context?.previousSchedule) {
        queryClient.setQueryData(['schedule'], context.previousSchedule)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule'] })
    },
  })
}

// Cancel swap offer
async function cancelOffer(shiftId: string): Promise<void> {
  const res = await fetch(`/api/schedule/offer/${shiftId}`, {
    method: 'DELETE',
  })
  if (!res.ok) {
    throw new Error('Failed to cancel offer')
  }
}

export function useCancelOffer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: cancelOffer,
    onMutate: async (shiftId) => {
      await queryClient.cancelQueries({ queryKey: ['schedule'] })

      const previousSchedule = queryClient.getQueryData<ScheduledShift[]>(['schedule'])

      // Optimistically update back to confirmed
      queryClient.setQueryData<ScheduledShift[]>(['schedule'], (old) => {
        if (!old) return old
        return old.map((shift) =>
          shift.id === shiftId ? { ...shift, status: 'confirmed' as const } : shift
        )
      })

      return { previousSchedule }
    },
    onError: (_err, _shiftId, context) => {
      if (context?.previousSchedule) {
        queryClient.setQueryData(['schedule'], context.previousSchedule)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule'] })
    },
  })
}

// Accept available shift
async function acceptShift(shiftId: string): Promise<void> {
  const res = await fetch(`/api/schedule/accept/${shiftId}`, {
    method: 'POST',
  })
  if (!res.ok) {
    throw new Error('Failed to accept shift')
  }
}

export function useAcceptShift() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: acceptShift,
    onSuccess: () => {
      // Invalidate both queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['schedule'] })
    },
  })
}

// Helper: Get today's shift from schedule
export function getTodayShift(schedule: ScheduledShift[] | undefined): ScheduledShift | null {
  if (!schedule) return null
  const today = new Date().toISOString().split('T')[0]
  return schedule.find((s) => s.date === today) ?? null
}

// Helper: Parse time string (HH:mm) to minutes from midnight
export function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

// Helper: Get current minutes from midnight
export function getCurrentMinutes(): number {
  const now = new Date()
  return now.getHours() * 60 + now.getMinutes()
}

// Helper: Format minutes to display string
export function formatRemainingTime(minutes: number): string {
  if (minutes <= 0) return 'Shift ended'
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

// Helper: Check if currently on break
export function isOnBreak(shift: ScheduledShift): boolean {
  if (!shift.breakStart || !shift.breakDuration) return false
  const now = getCurrentMinutes()
  const breakStart = parseTimeToMinutes(shift.breakStart)
  const breakEnd = breakStart + shift.breakDuration
  return now >= breakStart && now < breakEnd
}

// Helper: Calculate shift progress percentage
export function getShiftProgress(shift: ScheduledShift): number {
  const now = getCurrentMinutes()
  const start = parseTimeToMinutes(shift.startTime)
  const end = parseTimeToMinutes(shift.endTime)

  if (now < start) return 0
  if (now >= end) return 100

  const elapsed = now - start
  const total = end - start
  return Math.round((elapsed / total) * 100)
}
