import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { ChecklistItem, ChecklistCategory } from '@/types'

// Helper to group items by category
function groupByCategory(items: ChecklistItem[]): ChecklistCategory[] {
  const grouped = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
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

// Fetch checklist items grouped by category
async function fetchChecklist(): Promise<ChecklistCategory[]> {
  const res = await fetch('/api/compliance/checklist')
  if (!res.ok) throw new Error('Failed to fetch checklist')
  const items: ChecklistItem[] = await res.json()
  return groupByCategory(items)
}

export function useChecklist() {
  return useQuery({
    queryKey: ['checklist'],
    queryFn: fetchChecklist,
  })
}

// Toggle checklist item completion
export function useToggleChecklistItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const res = await fetch(`/api/compliance/checklist/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed, completedBy: 'Current User' }),
      })
      if (!res.ok) throw new Error('Failed to update checklist item')
      return res.json()
    },
    onMutate: async ({ id, completed }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['checklist'] })

      // Snapshot previous value
      const previous = queryClient.getQueryData<ChecklistCategory[]>(['checklist'])

      // Optimistically update the cache
      if (previous) {
        const updated = previous.map(category => ({
          ...category,
          items: category.items.map(item =>
            item.id === id
              ? {
                  ...item,
                  completed,
                  completedAt: completed ? new Date().toISOString() : null,
                  completedBy: completed ? 'Current User' : null,
                }
              : item
          ),
          completedCount: category.items.reduce(
            (count, item) =>
              count + (item.id === id ? (completed ? 1 : 0) : item.completed ? 1 : 0),
            0
          ),
        }))
        queryClient.setQueryData(['checklist'], updated)
      }

      return { previous }
    },
    onError: (_err, _vars, context) => {
      // Rollback on error
      if (context?.previous) {
        queryClient.setQueryData(['checklist'], context.previous)
      }
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: ['checklist'] })
    },
  })
}
