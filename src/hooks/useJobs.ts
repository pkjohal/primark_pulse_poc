import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Job, JobStatus, JobPriority, JobFilter, EscalationReason } from '@/types'

// ============================================
// Create Job
// ============================================
export interface CreateJobParams {
  title: string
  priority: JobPriority
  zone: string
  sla: number
  description?: string
  assignee?: string | null
  assigneeName?: string
  whyItMatters?: string
  successCriteria?: string[]
}

async function createJob(params: CreateJobParams): Promise<Job> {
  const res = await fetch('/api/jobs', {
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
    throw new Error('Failed to create job')
  }
  return res.json()
}

export function useCreateJob() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createJob,
    onSuccess: (newJob) => {
      queryClient.setQueriesData<Job[]>(
        { queryKey: ['jobs'] },
        (old) => {
          if (!old) return [newJob]
          return [newJob, ...old]
        }
      )
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
    },
  })
}

// ============================================
// Fetch Jobs
// ============================================
async function fetchJobs(filter?: JobFilter): Promise<Job[]> {
  const url = filter && filter !== 'all'
    ? `/api/jobs?filter=${filter}`
    : '/api/jobs'
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('Failed to fetch jobs')
  }
  return res.json()
}

export function useJobs(filter?: JobFilter) {
  return useQuery({
    queryKey: ['jobs', filter],
    queryFn: () => fetchJobs(filter),
    refetchInterval: 30000,
  })
}

// ============================================
// Update Job
// ============================================
interface UpdateJobParams {
  id: string
  status?: JobStatus
  assignee?: string | null
  assigneeName?: string
  startedAt?: string
  completedAt?: string
  completedIn?: number
}

async function updateJob(params: UpdateJobParams): Promise<Job> {
  const { id, ...updates } = params
  const res = await fetch(`/api/jobs/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
  if (!res.ok) {
    throw new Error('Failed to update job')
  }
  return res.json()
}

export function useUpdateJob() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateJob,
    onMutate: async (updatedJob) => {
      await queryClient.cancelQueries({ queryKey: ['jobs'] })
      const previousJobs = queryClient.getQueryData<Job[]>(['jobs'])

      queryClient.setQueriesData<Job[]>(
        { queryKey: ['jobs'] },
        (old) => {
          if (!old) return old
          return old.map((job) =>
            job.id === updatedJob.id
              ? { ...job, ...updatedJob }
              : job
          )
        }
      )

      return { previousJobs }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousJobs) {
        queryClient.setQueryData(['jobs'], context.previousJobs)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
    },
  })
}

// ============================================
// Complete Job
// ============================================
interface CompleteJobParams {
  id: string
  completedIn: number
}

export function useCompleteJob() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, completedIn }: CompleteJobParams) => {
      const res = await fetch(`/api/jobs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'complete',
          completedAt: new Date().toISOString(),
          completedIn,
        }),
      })
      if (!res.ok) throw new Error('Failed to complete job')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
    },
  })
}

// ============================================
// Escalate Job
// ============================================
interface EscalateJobParams {
  id: string
  reason: EscalationReason
  notes?: string
  escalatedTo: 'store-manager' | 'regional-manager'
}

export function useEscalateJob() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, reason, notes, escalatedTo }: EscalateJobParams) => {
      const res = await fetch(`/api/jobs/${id}/escalate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason,
          notes,
          escalatedTo,
          escalatedAt: new Date().toISOString(),
          escalatedBy: 'current-user',
        }),
      })
      if (!res.ok) throw new Error('Failed to escalate job')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
    },
  })
}

// ============================================
// Today's Top 3 Jobs (AI-simulated prioritization)
// ============================================
export function useTopJobs() {
  const { data: jobs, ...rest } = useJobs()

  // Calculate priority score for smart prioritization
  const calculatePriorityScore = (job: Job): number => {
    let score = 0
    const now = new Date()
    const hour = now.getHours()

    // Priority level weight (40%)
    const priorityWeight: Record<JobPriority, number> = {
      CRITICAL: 100,
      HIGH: 75,
      MEDIUM: 50,
      LOW: 25,
    }
    score += priorityWeight[job.priority] * 0.4

    // SLA urgency weight (40%)
    const remainingMinutes = calculateRemainingTime(job)
    const slaPercent = Math.max(0, Math.min(100, (remainingMinutes / job.sla) * 100))
    const slaScore = 100 - slaPercent // Lower remaining = higher score
    score += slaScore * 0.4

    // Time of day weight (20%)
    // Morning (6-11): prioritize restocking
    // Afternoon (12-17): prioritize customer-facing
    // Evening (18-21): prioritize closing tasks
    const restockZones = ['Stockroom', 'Menswear', 'Womenswear', 'Kidswear']
    const customerZones = ['Fitting Rooms', 'Main Tills', 'Entrance']

    if (hour >= 6 && hour < 12 && restockZones.includes(job.zone)) {
      score += 20
    } else if (hour >= 12 && hour < 18 && customerZones.includes(job.zone)) {
      score += 20
    } else {
      score += 10
    }

    return score
  }

  // Filter to actionable jobs and sort by score
  const topJobs = jobs
    ?.filter(job => job.status !== 'complete' && job.status !== 'escalated')
    .map(job => ({ job, score: calculatePriorityScore(job) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ job }) => job) ?? []

  return {
    ...rest,
    data: topJobs,
  }
}

// ============================================
// Helpers
// ============================================
export function calculateRemainingTime(job: Job): number {
  const createdAt = new Date(job.createdAt)
  const deadline = new Date(createdAt.getTime() + job.sla * 60 * 1000)
  const now = new Date()
  const remainingMs = deadline.getTime() - now.getTime()
  return Math.floor(remainingMs / (60 * 1000))
}

export function getSLAUrgency(remainingMinutes: number, totalMinutes: number): 'normal' | 'warning' | 'critical' {
  if (remainingMinutes <= 0) return 'critical'
  const percentRemaining = (remainingMinutes / totalMinutes) * 100
  if (percentRemaining <= 10) return 'critical'
  if (percentRemaining <= 25) return 'warning'
  return 'normal'
}

// Get count of jobs completed today
export function useJobsCompletedToday() {
  const { data: jobs } = useJobs()

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const completedToday = jobs?.filter(job => {
    if (job.status !== 'complete' || !job.completedAt) return false
    const completedDate = new Date(job.completedAt)
    return completedDate >= today
  }).length ?? 0

  return completedToday
}
