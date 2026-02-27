import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import type { ScheduledShift, AvailableShift } from '@/types'

function rowToScheduledShift(row: Record<string, unknown>): ScheduledShift {
  const zone = row.zones as { name: string } | null
  return {
    id: row.id as string,
    date: row.date as string,
    startTime: row.start_time as string,
    endTime: row.end_time as string,
    breakStart: row.break_start as string | undefined,
    breakDuration: row.break_duration_mins as number | undefined,
    zone: zone?.name ?? '',
    role: row.role as string,
    status: row.status as ScheduledShift['status'],
  }
}

function rowToAvailableShift(row: Record<string, unknown>): AvailableShift {
  const zone = row.zones as { name: string } | null
  const offerer = row.users as { id: string; name: string } | null
  return {
    id: row.id as string,
    date: row.date as string,
    startTime: row.start_time as string,
    endTime: row.end_time as string,
    zone: zone?.name ?? '',
    role: row.role as string,
    status: 'available',
    offeredBy: offerer?.id ?? '',
    offeredByName: offerer?.name ?? 'Unknown',
  }
}

const SHIFT_SELECT = '*, zones(name)'

export function useSchedule() {
  const user = useAuthStore(s => s.user)

  return useQuery({
    queryKey: ['schedule', user?.id],
    queryFn: async (): Promise<ScheduledShift[]> => {
      const today = new Date().toISOString().split('T')[0]
      const weekEnd = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]

      const { data, error } = await supabase
        .from('shifts')
        .select(SHIFT_SELECT)
        .eq('user_id', user!.id)
        .gte('date', today)
        .lte('date', weekEnd)
        .neq('status', 'available')
        .order('date')
      if (error) throw error
      return (data ?? []).map(row => rowToScheduledShift(row as Record<string, unknown>))
    },
    enabled: !!user?.id,
  })
}

export function useAvailableShifts() {
  const user = useAuthStore(s => s.user)

  return useQuery({
    queryKey: ['schedule', 'available', user?.store_id],
    queryFn: async (): Promise<AvailableShift[]> => {
      const today = new Date().toISOString().split('T')[0]

      const { data, error } = await supabase
        .from('shifts')
        .select(`${SHIFT_SELECT}, users!shifts_offered_by_fkey(id, name)`)
        .eq('store_id', user!.store_id)
        .eq('status', 'available')
        .gte('date', today)
        .neq('user_id', user!.id)
        .order('date')
      if (error) throw error
      return (data ?? []).map(row => rowToAvailableShift(row as Record<string, unknown>))
    },
    enabled: !!user?.id,
  })
}

export function useOfferShift() {
  const queryClient = useQueryClient()
  const user = useAuthStore(s => s.user)

  return useMutation({
    mutationFn: async (shiftId: string) => {
      const { error } = await supabase
        .from('shifts')
        .update({ status: 'available', offered_by: user!.id })
        .eq('id', shiftId)
      if (error) throw error
    },
    onMutate: async (shiftId) => {
      await queryClient.cancelQueries({ queryKey: ['schedule', user?.id] })
      const previousSchedule = queryClient.getQueryData<ScheduledShift[]>(['schedule', user?.id])
      queryClient.setQueryData<ScheduledShift[]>(['schedule', user?.id], (old) =>
        old?.map(s => s.id === shiftId ? { ...s, status: 'pending-swap' as const } : s)
      )
      return { previousSchedule }
    },
    onError: (_err, _shiftId, context) => {
      if (context?.previousSchedule) queryClient.setQueryData(['schedule', user?.id], context.previousSchedule)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule', user?.id] })
    },
  })
}

export function useCancelOffer() {
  const queryClient = useQueryClient()
  const user = useAuthStore(s => s.user)

  return useMutation({
    mutationFn: async (shiftId: string) => {
      const { error } = await supabase
        .from('shifts')
        .update({ status: 'confirmed', offered_by: null })
        .eq('id', shiftId)
      if (error) throw error
    },
    onMutate: async (shiftId) => {
      await queryClient.cancelQueries({ queryKey: ['schedule', user?.id] })
      const previousSchedule = queryClient.getQueryData<ScheduledShift[]>(['schedule', user?.id])
      queryClient.setQueryData<ScheduledShift[]>(['schedule', user?.id], (old) =>
        old?.map(s => s.id === shiftId ? { ...s, status: 'confirmed' as const } : s)
      )
      return { previousSchedule }
    },
    onError: (_err, _shiftId, context) => {
      if (context?.previousSchedule) queryClient.setQueryData(['schedule', user?.id], context.previousSchedule)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule', user?.id] })
    },
  })
}

export function useAcceptShift() {
  const queryClient = useQueryClient()
  const user = useAuthStore(s => s.user)

  return useMutation({
    mutationFn: async (shiftId: string) => {
      const { error } = await supabase
        .from('shifts')
        .update({ user_id: user!.id, status: 'confirmed', offered_by: null })
        .eq('id', shiftId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['schedule', 'available', user?.store_id] })
    },
  })
}

// ── Helpers ────────────────────────────────────────────────────────────────

export function getTodayShift(schedule: ScheduledShift[] | undefined): ScheduledShift | null {
  if (!schedule) return null
  const today = new Date().toISOString().split('T')[0]
  return schedule.find(s => s.date === today) ?? null
}

export function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

export function getCurrentMinutes(): number {
  const now = new Date()
  return now.getHours() * 60 + now.getMinutes()
}

export function formatRemainingTime(minutes: number): string {
  if (minutes <= 0) return 'Shift ended'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

export function isOnBreak(shift: ScheduledShift): boolean {
  if (!shift.breakStart || !shift.breakDuration) return false
  const now = getCurrentMinutes()
  const start = parseTimeToMinutes(shift.breakStart)
  return now >= start && now < start + shift.breakDuration
}

export function getShiftProgress(shift: ScheduledShift): number {
  const now = getCurrentMinutes()
  const start = parseTimeToMinutes(shift.startTime)
  const end = parseTimeToMinutes(shift.endTime)
  if (now < start) return 0
  if (now >= end) return 100
  return Math.round(((now - start) / (end - start)) * 100)
}
