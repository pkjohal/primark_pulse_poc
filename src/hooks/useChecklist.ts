import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import type { ChecklistItem, ChecklistCategory } from '@/types'

function groupByCategory(items: ChecklistItem[]): ChecklistCategory[] {
  const grouped = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, ChecklistItem[]>)

  return Object.entries(grouped).map(([name, categoryItems]) => ({
    name,
    items: categoryItems.sort((a, b) => a.order - b.order),
    completedCount: categoryItems.filter(i => i.completed).length,
    totalCount: categoryItems.length,
  }))
}

export function useChecklist() {
  const storeId = useAuthStore(s => s.user?.store_id)

  return useQuery({
    queryKey: ['checklist', storeId],
    queryFn: async (): Promise<ChecklistCategory[]> => {
      // Get today's closing checklist items (legacy simple view)
      const { data: checklist } = await supabase
        .from('checklists')
        .select('id')
        .eq('store_id', storeId!)
        .eq('type', 'closing')
        .maybeSingle()

      if (!checklist) return []

      const { data: sections } = await supabase
        .from('checklist_sections')
        .select('id, name')
        .eq('checklist_id', checklist.id)

      if (!sections?.length) return []

      const sectionIds = sections.map(s => s.id)

      const { data: items, error } = await supabase
        .from('checklist_items')
        .select('*, checklist_responses(value_bool, completed_at, user_id)')
        .in('section_id', sectionIds)
        .order('sort_order')
      if (error) throw error

      const mapped: ChecklistItem[] = (items ?? []).map(row => {
        const resp = (row.checklist_responses as Array<{ value_bool: boolean | null; completed_at: string; user_id: string }> | null)?.[0]
        return {
          id: row.id as string,
          category: row.category as string,
          item: row.item as string,
          completed: resp?.value_bool === true,
          completedAt: resp?.completed_at ?? null,
          completedBy: null,
          order: row.sort_order as number,
        }
      })

      return groupByCategory(mapped)
    },
    enabled: !!storeId,
  })
}

export function useToggleChecklistItem() {
  const queryClient = useQueryClient()
  const storeId = useAuthStore(s => s.user?.store_id)
  const userId = useAuthStore(s => s.user?.id)

  return useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      if (completed) {
        const { error } = await supabase
          .from('checklist_responses')
          .upsert({
            id: `resp-${id}-${userId}`,
            item_id: id,
            user_id: userId,
            value_bool: true,
            completed_at: new Date().toISOString(),
          })
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('checklist_responses')
          .delete()
          .eq('item_id', id)
          .eq('user_id', userId!)
        if (error) throw error
      }
    },
    onMutate: async ({ id, completed }) => {
      await queryClient.cancelQueries({ queryKey: ['checklist', storeId] })
      const previous = queryClient.getQueryData<ChecklistCategory[]>(['checklist', storeId])
      if (previous) {
        const updated = previous.map(category => ({
          ...category,
          items: category.items.map(item =>
            item.id === id
              ? { ...item, completed, completedAt: completed ? new Date().toISOString() : null, completedBy: completed ? 'Current User' : null }
              : item
          ),
          completedCount: category.items.reduce(
            (count, item) => count + (item.id === id ? (completed ? 1 : 0) : item.completed ? 1 : 0),
            0
          ),
        }))
        queryClient.setQueryData(['checklist', storeId], updated)
      }
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(['checklist', storeId], context.previous)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['checklist', storeId] })
    },
  })
}
