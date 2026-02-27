import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import type { AISuggestion } from '@/types';

export function useAISuggestion() {
  const storeId = useAuthStore(s => s.user?.store_id)

  return useQuery({
    queryKey: ['aiSuggestion', storeId],
    queryFn: async (): Promise<AISuggestion | null> => {
      const { data, error } = await supabase
        .from('ai_suggestions')
        .select('*')
        .eq('store_id', storeId!)
        .is('dismissed_by', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (error) throw error
      if (!data) return null
      return {
        id: data.id,
        suggestionText: data.suggestion_text,
        explanation: data.explanation ?? '',
        primaryAction: data.primary_action ?? '',
        actionPath: data.action_path ?? '',
        dismissible: data.dismissible,
        timestamp: data.created_at,
      }
    },
    enabled: !!storeId,
    refetchInterval: 60000,
  });
}

export function useDismissAISuggestion() {
  const queryClient = useQueryClient();
  const storeId = useAuthStore(s => s.user?.store_id)
  const userId = useAuthStore(s => s.user?.id)

  return useMutation({
    mutationFn: async (suggestionId: string) => {
      const { error } = await supabase
        .from('ai_suggestions')
        .update({ dismissed_by: userId })
        .eq('id', suggestionId)
      if (error) throw error
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['aiSuggestion', storeId] });
      const previousSuggestion = queryClient.getQueryData(['aiSuggestion', storeId]);
      queryClient.setQueryData(['aiSuggestion', storeId], null);
      return { previousSuggestion };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousSuggestion) {
        queryClient.setQueryData(['aiSuggestion', storeId], context.previousSuggestion);
      }
    },
  });
}
