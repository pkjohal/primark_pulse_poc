import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import type { QueueStatus, PressureIndicator } from '@/types'

export function useQueues() {
  const storeId = useAuthStore(s => s.user?.store_id)

  return useQuery({
    queryKey: ['queues', storeId],
    queryFn: async (): Promise<QueueStatus[]> => {
      const { data, error } = await supabase
        .from('queue_statuses')
        .select('*')
        .eq('store_id', storeId!)
        .order('name')
      if (error) throw error
      return (data ?? []).map(row => ({
        id: row.id as string,
        name: row.name as string,
        current: row.current_count as number,
        threshold: row.threshold as number,
        max: row.max_count as number,
        status: row.status as QueueStatus['status'],
      }))
    },
    enabled: !!storeId,
    refetchInterval: 30000,
  })
}

export function useStorePressure() {
  const storeId = useAuthStore(s => s.user?.store_id)

  return useQuery({
    queryKey: ['store-pressure', storeId],
    queryFn: async (): Promise<PressureIndicator> => {
      const { data, error } = await supabase
        .from('store_pressure')
        .select('*')
        .eq('store_id', storeId!)
        .order('recorded_at', { ascending: false })
        .limit(1)
        .single()
      if (error) throw error
      return {
        level: data.level as PressureIndicator['level'],
        peakForecast: data.peak_forecast as string,
        suggestedTask: data.suggested_task as string,
      }
    },
    enabled: !!storeId,
    refetchInterval: 30000,
  })
}
