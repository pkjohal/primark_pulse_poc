import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AISuggestion } from '@/types';

async function fetchAISuggestion(): Promise<AISuggestion | null> {
  const response = await fetch('/api/ai/suggestion');
  if (!response.ok) {
    throw new Error('Failed to fetch AI suggestion');
  }
  return response.json();
}

export function useAISuggestion() {
  return useQuery({
    queryKey: ['aiSuggestion'],
    queryFn: fetchAISuggestion,
    refetchInterval: 60000, // Refresh every minute
  });
}

export function useDismissAISuggestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (suggestionId: string) => {
      const response = await fetch(`/api/ai/suggestion/${suggestionId}/dismiss`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to dismiss suggestion');
      }
      return response.json();
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['aiSuggestion'] });
      const previousSuggestion = queryClient.getQueryData(['aiSuggestion']);

      // Optimistically remove the suggestion
      queryClient.setQueryData(['aiSuggestion'], null);

      return { previousSuggestion };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousSuggestion) {
        queryClient.setQueryData(['aiSuggestion'], context.previousSuggestion);
      }
    },
  });
}
