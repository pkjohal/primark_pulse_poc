import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import type { Alert } from '@/types';

function rowToAlert(row: Record<string, unknown>): Alert {
  return {
    id: row.id as string,
    type: row.type as Alert['type'],
    message: row.message as string,
    zone: (row.zone_name as string | undefined) ?? '',
    timestamp: row.created_at as string,
    aiGenerated: row.ai_generated as boolean,
  }
}

export function useAlerts() {
  const storeId = useAuthStore(s => s.user?.store_id)

  return useQuery({
    queryKey: ['alerts', storeId],
    queryFn: async (): Promise<Alert[]> => {
      const { data, error } = await supabase
        .from('alerts')
        .select('*, zones(name)')
        .eq('store_id', storeId!)
        .eq('dismissed', false)
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data ?? []).map(row => rowToAlert({ ...row, zone_name: (row.zones as { name: string } | null)?.name }))
    },
    enabled: !!storeId,
    refetchInterval: 15000,
  });
}

export function useDismissAlert() {
  const queryClient = useQueryClient();
  const storeId = useAuthStore(s => s.user?.store_id)
  const userId = useAuthStore(s => s.user?.id)

  return useMutation({
    mutationFn: async (alertId: string) => {
      const { error } = await supabase
        .from('alerts')
        .update({ dismissed: true, dismissed_by: userId })
        .eq('id', alertId)
      if (error) throw error
      return alertId
    },
    onMutate: async (alertId) => {
      await queryClient.cancelQueries({ queryKey: ['alerts', storeId] });
      const previousAlerts = queryClient.getQueryData<Alert[]>(['alerts', storeId]);
      queryClient.setQueryData<Alert[]>(['alerts', storeId], (old) =>
        old?.filter((alert) => alert.id !== alertId) ?? []
      );
      return { previousAlerts };
    },
    onError: (_err, _alertId, context) => {
      if (context?.previousAlerts) {
        queryClient.setQueryData(['alerts', storeId], context.previousAlerts);
      }
    },
  });
}
