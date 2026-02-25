import { useQuery } from '@tanstack/react-query'
import type { QueueStatus, PressureIndicator } from '@/types'

async function fetchQueues(): Promise<QueueStatus[]> {
  const res = await fetch('/api/queues')
  if (!res.ok) {
    throw new Error('Failed to fetch queues')
  }
  return res.json()
}

export function useQueues() {
  return useQuery({
    queryKey: ['queues'],
    queryFn: fetchQueues,
    refetchInterval: 30000, // Refresh every 30 seconds
  })
}

async function fetchStorePressure(): Promise<PressureIndicator> {
  const res = await fetch('/api/store/pressure')
  if (!res.ok) {
    throw new Error('Failed to fetch store pressure')
  }
  return res.json()
}

export function useStorePressure() {
  return useQuery({
    queryKey: ['store-pressure'],
    queryFn: fetchStorePressure,
    refetchInterval: 30000, // Refresh every 30 seconds
  })
}
