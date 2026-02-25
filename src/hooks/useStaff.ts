import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { StaffMember } from '@/types'

async function fetchStaff(zone?: string): Promise<StaffMember[]> {
  const url = zone && zone !== 'all'
    ? `/api/staff?zone=${encodeURIComponent(zone)}`
    : '/api/staff'
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('Failed to fetch staff')
  }
  return res.json()
}

export function useStaff(zone?: string) {
  return useQuery({
    queryKey: ['staff', zone],
    queryFn: () => fetchStaff(zone),
  })
}

interface UpdateStaffZoneParams {
  id: string
  zone: string
}

async function updateStaffZone(params: UpdateStaffZoneParams): Promise<StaffMember> {
  const { id, zone } = params
  const res = await fetch(`/api/staff/${id}/zone`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ zone }),
  })
  if (!res.ok) {
    throw new Error('Failed to update staff zone')
  }
  return res.json()
}

export function useUpdateStaffZone() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateStaffZone,
    onMutate: async (updatedStaff) => {
      await queryClient.cancelQueries({ queryKey: ['staff'] })

      const previousStaff = queryClient.getQueryData<StaffMember[]>(['staff'])

      queryClient.setQueriesData<StaffMember[]>(
        { queryKey: ['staff'] },
        (old) => {
          if (!old) return old
          return old.map((staff) =>
            staff.id === updatedStaff.id
              ? { ...staff, zone: updatedStaff.zone }
              : staff
          )
        }
      )

      return { previousStaff }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousStaff) {
        queryClient.setQueryData(['staff'], context.previousStaff)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] })
    },
  })
}
