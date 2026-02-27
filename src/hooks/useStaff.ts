import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import type { StaffMember } from '@/types'

function rowToStaffMember(row: Record<string, unknown>): StaffMember {
  const zone = row.zones as { id: string; name: string } | null
  return {
    id: row.id as string,
    name: (row.users as { name: string } | null)?.name ?? 'Unknown',
    zone: zone?.name ?? 'Unassigned',
    status: row.status as StaffMember['status'],
    skills: (row.skills as string[]) ?? [],
    shiftStart: row.shift_start as string,
    shiftEnd: row.shift_end as string,
  }
}

export function useStaff(zoneName?: string) {
  const storeId = useAuthStore(s => s.user?.store_id)

  return useQuery({
    queryKey: ['staff', storeId, zoneName],
    queryFn: async (): Promise<StaffMember[]> => {
      let query = supabase
        .from('staff_members')
        .select('*, users(name), zones(id, name)')
        .eq('store_id', storeId!)

      if (zoneName && zoneName !== 'all') {
        // Filter by zone name via the zones join
        const { data: zone } = await supabase
          .from('zones')
          .select('id')
          .eq('store_id', storeId!)
          .eq('name', zoneName)
          .maybeSingle()
        if (zone) {
          query = query.eq('zone_id', zone.id)
        }
      }

      const { data, error } = await query
      if (error) throw error
      return (data ?? []).map(row => rowToStaffMember(row as Record<string, unknown>))
    },
    enabled: !!storeId,
  })
}

interface UpdateStaffZoneParams {
  id: string
  zone: string
}

export function useUpdateStaffZone() {
  const queryClient = useQueryClient()
  const storeId = useAuthStore(s => s.user?.store_id)

  return useMutation({
    mutationFn: async ({ id, zone }: UpdateStaffZoneParams) => {
      // Resolve zone name to zone id
      const { data: zoneRow, error: zoneError } = await supabase
        .from('zones')
        .select('id')
        .eq('store_id', storeId!)
        .eq('name', zone)
        .maybeSingle()
      if (zoneError) throw zoneError

      const { data, error } = await supabase
        .from('staff_members')
        .update({ zone_id: zoneRow?.id ?? null })
        .eq('id', id)
        .select('*, users(name), zones(id, name)')
        .single()
      if (error) throw error
      return rowToStaffMember(data as Record<string, unknown>)
    },
    onMutate: async (updatedStaff) => {
      await queryClient.cancelQueries({ queryKey: ['staff', storeId] })
      const previousStaff = queryClient.getQueryData<StaffMember[]>(['staff', storeId])
      queryClient.setQueriesData<StaffMember[]>(
        { queryKey: ['staff', storeId] },
        (old) => {
          if (!old) return old
          return old.map(s => s.id === updatedStaff.id ? { ...s, zone: updatedStaff.zone } : s)
        }
      )
      return { previousStaff }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousStaff) {
        queryClient.setQueryData(['staff', storeId], context.previousStaff)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['staff', storeId] })
    },
  })
}
