import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'

export interface CurrentShift {
  id: string
  name: string
  zone: string
  shiftStart: string
  shiftEnd: string
  breakTime: string
  status: 'active' | 'break' | 'absent'
}

export interface NextShift {
  date: string
  shiftStart: string
  shiftEnd: string
  breakTime: string | null
  zone: string
}

export function useNextShift() {
  const user = useAuthStore(s => s.user)
  const today = new Date().toISOString().split('T')[0]

  return useQuery({
    queryKey: ['nextShift', user?.id],
    queryFn: async (): Promise<NextShift | null> => {
      const { data, error } = await supabase
        .from('shifts')
        .select('*, zones(name)')
        .eq('user_id', user!.id)
        .gt('date', today)
        .eq('status', 'confirmed')
        .order('date', { ascending: true })
        .limit(1)
        .maybeSingle()
      if (error) throw error
      if (!data) return null
      return {
        date: data.date,
        shiftStart: data.start_time ?? '--:--',
        shiftEnd: data.end_time ?? '--:--',
        breakTime: data.break_start ?? null,
        zone: (data.zones as { name: string } | null)?.name ?? 'Unassigned',
      }
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCurrentShift() {
  const user = useAuthStore(s => s.user)

  return useQuery({
    queryKey: ['currentShift', user?.id],
    queryFn: async (): Promise<CurrentShift> => {
      const today = new Date().toISOString().split('T')[0]

      // Get the user's shift for today
      const { data: shift, error: shiftError } = await supabase
        .from('shifts')
        .select('*, zones(name)')
        .eq('user_id', user!.id)
        .eq('date', today)
        .maybeSingle()
      if (shiftError) throw shiftError

      // Get staff_member record for status
      const { data: staffMember, error: staffError } = await supabase
        .from('staff_members')
        .select('id, status')
        .eq('user_id', user!.id)
        .maybeSingle()
      if (staffError) throw staffError

      return {
        id: staffMember?.id ?? user!.id,
        name: user!.name,
        zone: (shift?.zones as { name: string } | null)?.name ?? 'Unassigned',
        shiftStart: shift?.start_time ?? '--:--',
        shiftEnd: shift?.end_time ?? '--:--',
        breakTime: shift?.break_start ?? '--:--',
        status: (staffMember?.status as CurrentShift['status']) ?? 'active',
      }
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  })
}
