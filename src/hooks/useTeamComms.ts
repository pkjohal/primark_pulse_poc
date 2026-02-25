import { useQuery } from '@tanstack/react-query'
import type { TeamMessage } from '@/types'

async function fetchTeamMessages(): Promise<TeamMessage[]> {
  const response = await fetch('/api/comms')
  if (!response.ok) {
    throw new Error('Failed to fetch team messages')
  }
  return response.json()
}

export function useTeamComms() {
  return useQuery({
    queryKey: ['teamComms'],
    queryFn: fetchTeamMessages,
    staleTime: 30 * 1000, // 30 seconds
  })
}
