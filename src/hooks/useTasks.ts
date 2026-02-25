import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Task, TaskStatus, TaskPriority } from '@/types'

export type TaskFilter = 'all' | 'my-tasks' | 'unassigned'

// ============================================
// Create Task
// ============================================
export interface CreateTaskParams {
  title: string
  priority: TaskPriority
  zone: string
  sla: number
  description?: string
  assignee?: string | null
  assigneeName?: string
}

async function createTask(params: CreateTaskParams): Promise<Task> {
  const res = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...params,
      status: params.assignee ? 'pending' : 'unassigned',
      aiSuggested: false,
      createdAt: new Date().toISOString(),
    }),
  })
  if (!res.ok) {
    throw new Error('Failed to create task')
  }
  return res.json()
}

export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTask,
    onSuccess: (newTask) => {
      // Add the new task to the cache optimistically
      queryClient.setQueriesData<Task[]>(
        { queryKey: ['tasks'] },
        (old) => {
          if (!old) return [newTask]
          return [newTask, ...old]
        }
      )
      // Then invalidate to ensure sync
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

async function fetchTasks(filter?: TaskFilter): Promise<Task[]> {
  const url = filter && filter !== 'all'
    ? `/api/tasks?filter=${filter}`
    : '/api/tasks'
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('Failed to fetch tasks')
  }
  return res.json()
}

export function useTasks(filter?: TaskFilter) {
  return useQuery({
    queryKey: ['tasks', filter],
    queryFn: () => fetchTasks(filter),
    refetchInterval: 30000, // Refresh every 30 seconds
  })
}

interface UpdateTaskParams {
  id: string
  status?: TaskStatus
  assignee?: string | null
  assigneeName?: string
}

async function updateTask(params: UpdateTaskParams): Promise<Task> {
  const { id, ...updates } = params
  const res = await fetch(`/api/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
  if (!res.ok) {
    throw new Error('Failed to update task')
  }
  return res.json()
}

export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateTask,
    onMutate: async (updatedTask) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks'] })

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks'])

      // Optimistically update to the new value
      queryClient.setQueriesData<Task[]>(
        { queryKey: ['tasks'] },
        (old) => {
          if (!old) return old
          return old.map((task) =>
            task.id === updatedTask.id
              ? { ...task, ...updatedTask }
              : task
          )
        }
      )

      return { previousTasks }
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks)
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

// Helper to calculate remaining SLA time in minutes
export function calculateRemainingTime(task: Task): number {
  const createdAt = new Date(task.createdAt)
  const deadline = new Date(createdAt.getTime() + task.sla * 60 * 1000)
  const now = new Date()
  const remainingMs = deadline.getTime() - now.getTime()
  return Math.floor(remainingMs / (60 * 1000))
}

// Helper to determine SLA urgency level
export function getSLAUrgency(remainingMinutes: number, totalMinutes: number): 'normal' | 'warning' | 'critical' {
  if (remainingMinutes <= 0) return 'critical'
  const percentRemaining = (remainingMinutes / totalMinutes) * 100
  if (percentRemaining <= 10) return 'critical'
  if (percentRemaining <= 25) return 'warning'
  return 'normal'
}
