import { useQuery } from '@tanstack/react-query';
import type { StoreMetrics } from '@/types';

async function fetchStoreMetrics(): Promise<StoreMetrics> {
  const response = await fetch('/api/store/metrics');
  if (!response.ok) {
    throw new Error('Failed to fetch store metrics');
  }
  return response.json();
}

export function useStoreMetrics() {
  return useQuery({
    queryKey: ['storeMetrics'],
    queryFn: fetchStoreMetrics,
    refetchInterval: 30000, // Refetch every 30 seconds for "live" feel
  });
}
