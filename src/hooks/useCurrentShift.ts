import { useQuery } from '@tanstack/react-query'

export interface CurrentShift {
  id: string
  name: string
  zone: string
  shiftStart: string
  shiftEnd: string
  breakTime: string
  status: 'active' | 'break' | 'absent'
}

async function fetchCurrentShift(): Promise<CurrentShift> {
  const response = await fetch('/api/staff/me')
  if (!response.ok) {
    throw new Error('Failed to fetch current shift')
  }
  return response.json()
}

export function useCurrentShift() {
  return useQuery({
    queryKey: ['currentShift'],
    queryFn: fetchCurrentShift,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  })
}
