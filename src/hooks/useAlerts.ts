import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Alert } from '@/types';

async function fetchAlerts(): Promise<Alert[]> {
  const response = await fetch('/api/alerts');
  if (!response.ok) {
    throw new Error('Failed to fetch alerts');
  }
  return response.json();
}

export function useAlerts() {
  return useQuery({
    queryKey: ['alerts'],
    queryFn: fetchAlerts,
    refetchInterval: 15000, // More frequent for alerts
  });
}

export function useDismissAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (alertId: string) => {
      // In a real app, this would call an API endpoint
      // For now, we'll just optimistically update the UI
      return alertId;
    },
    onMutate: async (alertId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['alerts'] });

      // Snapshot the previous value
      const previousAlerts = queryClient.getQueryData<Alert[]>(['alerts']);

      // Optimistically update
      queryClient.setQueryData<Alert[]>(['alerts'], (old) =>
        old?.filter((alert) => alert.id !== alertId) ?? []
      );

      return { previousAlerts };
    },
    onError: (_err, _alertId, context) => {
      // Rollback on error
      if (context?.previousAlerts) {
        queryClient.setQueryData(['alerts'], context.previousAlerts);
      }
    },
  });
}
