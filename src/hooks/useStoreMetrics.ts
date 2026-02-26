import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import type { StoreMetrics } from '@/types';

export function useStoreMetrics() {
  const storeId = useAuthStore(s => s.user?.store_id)

  return useQuery({
    queryKey: ['storeMetrics', storeId],
    queryFn: async (): Promise<StoreMetrics> => {
      const { data, error } = await supabase
        .from('store_metrics')
        .select('*')
        .eq('store_id', storeId!)
        .order('recorded_at', { ascending: false })
        .limit(1)
        .single()
      if (error) throw error
      return {
        storeStatus: data.store_status as StoreMetrics['storeStatus'],
        staffActive: data.staff_active,
        staffTotal: data.staff_total,
        tillsOpen: data.tills_open,
        tillsTotal: data.tills_total,
        openTasks: data.open_tasks,
        criticalTasks: data.critical_tasks,
        complianceProgress: data.compliance_progress,
      }
    },
    enabled: !!storeId,
    refetchInterval: 30000,
  });
}
