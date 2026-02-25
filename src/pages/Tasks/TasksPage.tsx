import { useState } from 'react'
import { ListTodo, Plus } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SkeletonCard } from '@/components/ui/skeleton'
import { useTasks, useUpdateTask, type TaskFilter } from '@/hooks/useTasks'
import { useStaff } from '@/hooks/useStaff'
import { useAuthStore } from '@/stores/authStore'
import { TaskFilters } from './components/TaskFilters'
import { TaskListItem } from './components/TaskListItem'
import { TaskDetailSheet } from './components/TaskDetailSheet'
import { AssignTaskDialog } from './components/AssignTaskDialog'
import { CreateTaskSheet } from './components/CreateTaskSheet'
import type { Task, TaskPriority } from '@/types'

export default function TasksPage() {
  const [filter, setFilter] = useState<TaskFilter>('all')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [assignOpen, setAssignOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)

  const { data: tasks, isLoading } = useTasks(filter)
  const { data: staff } = useStaff()
  const updateTask = useUpdateTask()
  const { user } = useAuthStore()

  // Sort tasks: CRITICAL first, then by SLA urgency
  const sortedTasks = tasks
    ? [...tasks].sort((a, b) => {
        // Priority order: CRITICAL > HIGH > MEDIUM > LOW
        const priorityOrder: Record<TaskPriority, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
        if (priorityDiff !== 0) return priorityDiff

        // Then by created time (older first = more urgent)
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      })
    : []

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setDetailOpen(true)
  }

  const handleAssignClick = () => {
    setDetailOpen(false)
    setAssignOpen(true)
  }

  const handleAssigned = () => {
    setDetailOpen(true)
  }

  const handleQuickComplete = (taskId: string) => {
    updateTask.mutate({ id: taskId, status: 'complete' })
  }

  const handleAssignToMe = (taskId: string) => {
    updateTask.mutate({
      id: taskId,
      assignee: 'current-user',
      assigneeName: user?.name?.split(' ')[0] || 'You',
    })
  }

  // Calculate staggered animation delay for each task card
  const getAnimationDelay = (index: number) => {
    const baseDelay = 100 // Start after filter animation
    const stagger = 50 // 50ms between each card
    const maxDelay = 500 // Cap the delay so later items don't wait too long
    return Math.min(baseDelay + index * stagger, maxDelay)
  }

  return (
    <div className="p-4 space-y-4">

      {/* Filters - centered */}
      <div className="flex justify-center animate-fade-in-scale">
        <TaskFilters
          activeFilter={filter}
          onFilterChange={setFilter}
        />
      </div>

      {/* Task List */}
      {isLoading ? (
        <div className="space-y-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : sortedTasks.length === 0 ? (
        <Card className="p-6 text-center animate-fade-in-up animation-delay-150">
          <ListTodo className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">
            {filter === 'unassigned'
              ? 'No unassigned tasks'
              : filter === 'my-tasks'
                ? 'No tasks assigned to you'
                : 'No tasks found'}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {sortedTasks.map((task, index) => (
            <TaskListItem
              key={task.id}
              task={task}
              onClick={() => handleTaskClick(task)}
              onQuickComplete={handleQuickComplete}
              onAssignToMe={handleAssignToMe}
              className="animate-fade-in-up"
              style={{ animationDelay: `${getAnimationDelay(index)}ms` }}
            />
          ))}
        </div>
      )}

      {/* Task Detail Sheet */}
      <TaskDetailSheet
        task={selectedTask}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onAssign={handleAssignClick}
      />

      {/* Assign Task Dialog */}
      <AssignTaskDialog
        task={selectedTask}
        staff={staff ?? []}
        open={assignOpen}
        onOpenChange={setAssignOpen}
        onAssigned={handleAssigned}
      />

      {/* Create Task Sheet */}
      <CreateTaskSheet
        open={createOpen}
        onOpenChange={setCreateOpen}
      />

      {/* FAB - Create Task Button */}
      <Button
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full shadow-lg z-40"
        onClick={() => setCreateOpen(true)}
      >
        <Plus className="w-6 h-6" />
      </Button>
    </div>
  )
}
