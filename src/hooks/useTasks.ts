import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import type { Task, TaskStatus, TaskPriority } from '@/types'

export type TaskFilter = 'all' | 'my-tasks' | 'unassigned'

const TASK_SELECT = '*, zones(name), staff_members(id, users(name))'

function rowToTask(row: Record<string, unknown>): Task {
  const zone = row.zones as { name: string } | null
  const assignee = row.staff_members as { id: string; users?: { name: string } | null } | null
  return {
    id: row.id as string,
    title: row.title as string,
    priority: row.priority as TaskPriority,
    status: row.status as TaskStatus,
    zone: zone?.name ?? '',
    assignee: assignee?.id ?? null,
    assigneeName: assignee?.users?.name ?? undefined,
    sla: row.sla_minutes as number,
    aiSuggested: row.ai_suggested as boolean,
    createdAt: row.created_at as string,
    completedAt: row.completed_at as string | undefined,
    completedIn: row.completed_in as number | undefined,
  }
}

// ── Fetch Tasks ────────────────────────────────────────────────────────────

export function useTasks(filter?: TaskFilter) {
  const storeId = useAuthStore(s => s.user?.store_id)
  const userId = useAuthStore(s => s.user?.id)

  return useQuery({
    queryKey: ['tasks', storeId, filter],
    queryFn: async (): Promise<Task[]> => {
      let query = supabase
        .from('tasks')
        .select(TASK_SELECT)
        .eq('store_id', storeId!)
        .order('created_at', { ascending: false })

      if (filter === 'unassigned') {
        query = query.is('assignee_id', null)
      } else if (filter === 'my-tasks' && userId) {
        // Find staff_member id for current user
        const { data: sm } = await supabase
          .from('staff_members')
          .select('id')
          .eq('user_id', userId)
          .maybeSingle()
        if (sm) query = query.eq('assignee_id', sm.id)
      }

      const { data, error } = await query
      if (error) throw error
      return (data ?? []).map(row => rowToTask(row as Record<string, unknown>))
    },
    enabled: !!storeId,
    refetchInterval: 30000,
  })
}

// ── Create Task ────────────────────────────────────────────────────────────

export interface CreateTaskParams {
  title: string
  priority: TaskPriority
  zone: string
  sla: number
  description?: string
  assignee?: string | null
  assigneeName?: string
}

export function useCreateTask() {
  const queryClient = useQueryClient()
  const storeId = useAuthStore(s => s.user?.store_id)

  return useMutation({
    mutationFn: async (params: CreateTaskParams): Promise<Task> => {
      const { data: zone } = await supabase
        .from('zones')
        .select('id')
        .eq('store_id', storeId!)
        .eq('name', params.zone)
        .maybeSingle()

      const { data, error } = await supabase
        .from('tasks')
        .insert({
          store_id: storeId!,
          title: params.title,
          description: params.description,
          priority: params.priority,
          status: params.assignee ? 'pending' : 'unassigned',
          zone_id: zone?.id ?? null,
          assignee_id: params.assignee ?? null,
          sla_minutes: params.sla,
          ai_suggested: false,
        })
        .select(TASK_SELECT)
        .single()
      if (error) throw error
      return rowToTask(data as Record<string, unknown>)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', storeId] })
    },
  })
}

// ── Update Task ────────────────────────────────────────────────────────────

interface UpdateTaskParams {
  id: string
  status?: TaskStatus
  assignee?: string | null
  assigneeName?: string
}

export function useUpdateTask() {
  const queryClient = useQueryClient()
  const storeId = useAuthStore(s => s.user?.store_id)

  return useMutation({
    mutationFn: async ({ id, assigneeName: _name, ...updates }: UpdateTaskParams): Promise<Task> => {
      const patch: Record<string, unknown> = {}
      if (updates.status !== undefined)   patch.status      = updates.status
      if (updates.assignee !== undefined) patch.assignee_id = updates.assignee

      const { data, error } = await supabase
        .from('tasks')
        .update(patch)
        .eq('id', id)
        .select(TASK_SELECT)
        .single()
      if (error) throw error
      return rowToTask(data as Record<string, unknown>)
    },
    onMutate: async (updatedTask) => {
      await queryClient.cancelQueries({ queryKey: ['tasks', storeId] })
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks', storeId])
      queryClient.setQueriesData<Task[]>(
        { queryKey: ['tasks', storeId] },
        (old) => old?.map(t => t.id === updatedTask.id ? { ...t, ...updatedTask } : t)
      )
      return { previousTasks }
    },
    onError: (_err, _vars, context) => {
      if (context?.previousTasks) queryClient.setQueryData(['tasks', storeId], context.previousTasks)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', storeId] })
    },
  })
}

// ── Helpers ────────────────────────────────────────────────────────────────

export function calculateRemainingTime(task: Task): number {
  const deadline = new Date(new Date(task.createdAt).getTime() + task.sla * 60 * 1000)
  return Math.floor((deadline.getTime() - Date.now()) / 60000)
}

export function getSLAUrgency(remainingMinutes: number, totalMinutes: number): 'normal' | 'warning' | 'critical' {
  if (remainingMinutes <= 0) return 'critical'
  const pct = (remainingMinutes / totalMinutes) * 100
  if (pct <= 10) return 'critical'
  if (pct <= 25) return 'warning'
  return 'normal'
}
