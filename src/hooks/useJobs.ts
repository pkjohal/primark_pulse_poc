import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import type { Job, JobStatus, JobPriority, JobFilter, EscalationReason } from '@/types'

// ── Row → Job ──────────────────────────────────────────────────────────────

function rowToJob(row: Record<string, unknown>): Job {
  const zone = row.zones as { name: string } | null
  const assignee = row.staff_members as { id: string; users?: { name: string } | null } | null
  return {
    id: row.id as string,
    title: row.title as string,
    priority: row.priority as JobPriority,
    status: row.status as JobStatus,
    zone: zone?.name ?? '',
    assignee: assignee?.id ?? null,
    assigneeName: assignee?.users?.name ?? undefined,
    sla: row.sla_minutes as number,
    aiSuggested: row.ai_suggested as boolean,
    createdAt: row.created_at as string,
    startedAt: row.started_at as string | undefined,
    completedAt: row.completed_at as string | undefined,
    completedIn: row.completed_in as number | undefined,
    whyItMatters: row.why_it_matters as string | undefined,
    successCriteria: (row.success_criteria as string[]) ?? [],
    peerTip: row.peer_tip_store
      ? { storeName: row.peer_tip_store as string, tip: row.peer_tip_text as string }
      : undefined,
  }
}

const JOB_SELECT = '*, zones(name), staff_members(id, users(name))'

// ── Fetch Jobs ─────────────────────────────────────────────────────────────

export function useJobs(filter?: JobFilter) {
  const storeId = useAuthStore(s => s.user?.store_id)
  const userId = useAuthStore(s => s.user?.id)

  return useQuery({
    queryKey: ['jobs', storeId, filter, userId],
    queryFn: async (): Promise<Job[]> => {
      let query = supabase
        .from('jobs')
        .select(JOB_SELECT)
        .eq('store_id', storeId!)
        .order('created_at', { ascending: false })

      if (filter === 'unassigned') {
        query = query.eq('status', 'unassigned')
      } else if (filter === 'done') {
        query = query.eq('status', 'complete')
      } else if (!filter || filter === 'all') {
        query = query.neq('status', 'complete')
      }

      if (filter === 'my-jobs' || filter === 'my-done') {
        const { data: sm } = await supabase
          .from('staff_members')
          .select('id')
          .eq('user_id', userId!)
          .eq('store_id', storeId!)
          .maybeSingle()
        if (sm) {
          query = query.eq('assignee_id', sm.id)
          if (filter === 'my-done') {
            query = query.eq('status', 'complete')
          } else {
            query = query.neq('status', 'complete')
          }
        } else {
          return []
        }
      }

      const { data, error } = await query
      if (error) throw error
      return (data ?? []).map(row => rowToJob(row as Record<string, unknown>))
    },
    enabled: !!storeId && !!userId,
    refetchInterval: 30000,
  })
}

// ── Create Job ─────────────────────────────────────────────────────────────

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

export function useCreateJob() {
  const queryClient = useQueryClient()
  const storeId = useAuthStore(s => s.user?.store_id)

  return useMutation({
    mutationFn: async (params: CreateJobParams): Promise<Job> => {
      // Resolve zone name to zone id
      const { data: zone } = await supabase
        .from('zones')
        .select('id')
        .eq('store_id', storeId!)
        .eq('name', params.zone)
        .maybeSingle()

      const { data, error } = await supabase
        .from('jobs')
        .insert({
          id: crypto.randomUUID(),
          store_id: storeId!,
          title: params.title,
          description: params.description,
          priority: params.priority,
          status: params.assignee ? 'pending' : 'unassigned',
          zone_id: zone?.id ?? null,
          assignee_id: params.assignee ?? null,
          sla_minutes: params.sla,
          ai_suggested: false,
          why_it_matters: params.whyItMatters,
          success_criteria: params.successCriteria ?? [],
        })
        .select(JOB_SELECT)
        .single()
      if (error) throw error
      return rowToJob(data as Record<string, unknown>)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
    },
  })
}

// ── Update Job ─────────────────────────────────────────────────────────────

interface UpdateJobParams {
  id: string
  status?: JobStatus
  assignee?: string | null
  assigneeName?: string
  startedAt?: string
  completedAt?: string
  completedIn?: number
}

export function useUpdateJob() {
  const queryClient = useQueryClient()
  const storeId = useAuthStore(s => s.user?.store_id)

  return useMutation({
    mutationFn: async ({ id, assigneeName: _name, ...updates }: UpdateJobParams): Promise<Job> => {
      const patch: Record<string, unknown> = {}
      if (updates.status !== undefined)    patch.status       = updates.status
      if (updates.assignee !== undefined)  patch.assignee_id  = updates.assignee
      if (updates.startedAt !== undefined) patch.started_at   = updates.startedAt
      if (updates.completedAt !== undefined) patch.completed_at = updates.completedAt
      if (updates.completedIn !== undefined) patch.completed_in = updates.completedIn
      patch.updated_at = new Date().toISOString()

      const { data, error } = await supabase
        .from('jobs')
        .update(patch)
        .eq('id', id)
        .select(JOB_SELECT)
        .single()
      if (error) throw error
      return rowToJob(data as Record<string, unknown>)
    },
    onMutate: async (updatedJob) => {
      await queryClient.cancelQueries({ queryKey: ['jobs', storeId] })
      const previousJobs = queryClient.getQueryData<Job[]>(['jobs', storeId])
      queryClient.setQueriesData<Job[]>(
        { queryKey: ['jobs', storeId] },
        (old) => old?.map(job => job.id === updatedJob.id ? { ...job, ...updatedJob } : job)
      )
      return { previousJobs }
    },
    onError: (_err, _vars, context) => {
      if (context?.previousJobs) queryClient.setQueryData(['jobs', storeId], context.previousJobs)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs', storeId] })
    },
  })
}

// ── Complete Job ───────────────────────────────────────────────────────────

interface CompleteJobParams { id: string; completedIn: number }

export function useCompleteJob() {
  const queryClient = useQueryClient()
  const storeId = useAuthStore(s => s.user?.store_id)

  return useMutation({
    mutationFn: async ({ id, completedIn }: CompleteJobParams) => {
      const { data, error } = await supabase
        .from('jobs')
        .update({ status: 'complete', completed_at: new Date().toISOString(), completed_in: completedIn, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select(JOB_SELECT)
        .single()
      if (error) throw error
      return rowToJob(data as Record<string, unknown>)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs', storeId] })
    },
  })
}

// ── Escalate Job ───────────────────────────────────────────────────────────

interface EscalateJobParams {
  id: string
  reason: EscalationReason
  notes?: string
  escalatedTo: 'store-manager' | 'regional-manager'
}

export function useEscalateJob() {
  const queryClient = useQueryClient()
  const storeId = useAuthStore(s => s.user?.store_id)
  const userId = useAuthStore(s => s.user?.id)

  return useMutation({
    mutationFn: async ({ id, reason, notes, escalatedTo }: EscalateJobParams) => {
      const { error: escError } = await supabase
        .from('escalations')
        .insert({ id: `esc-${id}-${Date.now()}`, job_id: id, escalated_by: userId, reason, notes, escalated_to: escalatedTo, status: 'open' })
      if (escError) throw escError

      const { data, error } = await supabase
        .from('jobs')
        .update({ status: 'escalated', updated_at: new Date().toISOString() })
        .eq('id', id)
        .select(JOB_SELECT)
        .single()
      if (error) throw error
      return rowToJob(data as Record<string, unknown>)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs', storeId] })
    },
  })
}

// ── Top Jobs ───────────────────────────────────────────────────────────────

export function useTopJobs() {
  const { data: jobs, ...rest } = useJobs()

  const calculatePriorityScore = (job: Job): number => {
    let score = 0
    const hour = new Date().getHours()
    const priorityWeight: Record<JobPriority, number> = { CRITICAL: 100, HIGH: 75, MEDIUM: 50, LOW: 25 }
    score += priorityWeight[job.priority] * 0.4

    const remainingMinutes = calculateRemainingTime(job)
    const slaPercent = Math.max(0, Math.min(100, (remainingMinutes / job.sla) * 100))
    score += (100 - slaPercent) * 0.4

    const restockZones = ['Stockroom', 'Menswear', 'Womenswear', 'Kidswear']
    const customerZones = ['Fitting Rooms', 'Main Tills', 'Entrance']
    if (hour >= 6 && hour < 12 && restockZones.includes(job.zone)) score += 20
    else if (hour >= 12 && hour < 18 && customerZones.includes(job.zone)) score += 20
    else score += 10
    return score
  }

  const topJobs = jobs
    ?.filter(job => job.status !== 'complete' && job.status !== 'escalated')
    .map(job => ({ job, score: calculatePriorityScore(job) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ job }) => job) ?? []

  return { ...rest, data: topJobs }
}

// ── Helpers ────────────────────────────────────────────────────────────────

export function calculateRemainingTime(job: Job): number {
  const startTime = job.startedAt ? new Date(job.startedAt) : new Date(job.createdAt)
  const deadline = new Date(startTime.getTime() + job.sla * 60 * 1000)
  return Math.floor((deadline.getTime() - Date.now()) / 60000)
}

export function getSLAUrgency(remainingMinutes: number, totalMinutes: number): 'normal' | 'warning' | 'critical' {
  if (remainingMinutes <= 0) return 'critical'
  const pct = (remainingMinutes / totalMinutes) * 100
  if (pct <= 10) return 'critical'
  if (pct <= 25) return 'warning'
  return 'normal'
}

export function useJobsCompletedToday() {
  const { data: jobs } = useJobs()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return jobs?.filter(j => j.status === 'complete' && j.completedAt && new Date(j.completedAt) >= today).length ?? 0
}
