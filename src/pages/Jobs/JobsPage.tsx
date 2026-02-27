import { useState } from 'react'
import { Briefcase, Plus } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SkeletonCard } from '@/components/ui/skeleton'
import { useJobs, useUpdateJob } from '@/hooks/useJobs'
import { useStaff } from '@/hooks/useStaff'
import { useCurrentShift } from '@/hooks/useCurrentShift'
import { useAuthStore } from '@/stores/authStore'
import { JobFilters } from './components/JobFilters'
import { JobListItem } from './components/JobListItem'
import { JobDetailSheet } from './components/JobDetailSheet'
import { AssignJobDialog } from './components/AssignJobDialog'
import { CreateJobSheet } from './components/CreateJobSheet'
import { JobCompletionSheet } from './components/JobCompletionSheet'
import { EscalationSheet } from './components/EscalationSheet'
import type { Job, JobFilter } from '@/types'

const MANAGER_FILTERS: { value: JobFilter; label: string }[] = [
  { value: 'all',        label: 'All'        },
  { value: 'my-jobs',    label: 'My Jobs'    },
  { value: 'unassigned', label: 'Unassigned' },
  { value: 'done',       label: 'Done'       },
]

const STAFF_FILTERS: { value: JobFilter; label: string }[] = [
  { value: 'my-jobs',    label: 'My Jobs'    },
  { value: 'unassigned', label: 'Unassigned' },
  { value: 'my-done',    label: 'Done'       },
]

export default function JobsPage() {
  const { user } = useAuthStore()
  const isStaff = user?.role === 'staff'

  const [filter, setFilter] = useState<JobFilter>(isStaff ? 'my-jobs' : 'all')
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [assignOpen, setAssignOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [escalateOpen, setEscalateOpen] = useState(false)
  const [completionOpen, setCompletionOpen] = useState(false)
  const [completedJob, setCompletedJob] = useState<Job | null>(null)
  const [completionTime, setCompletionTime] = useState(0)

  const [listKey, setListKey] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const { data: jobs, isLoading } = useJobs(filter)
  const { data: staff } = useStaff()
  const { data: currentShift } = useCurrentShift()
  const updateJob = useUpdateJob()

  // Staff member ID for the current user (needed for assignment)
  const myStaffMemberId = currentShift?.id

  const handleFilterChange = (newFilter: JobFilter) => {
    if (newFilter === filter) return
    setIsTransitioning(true)
    setTimeout(() => {
      setFilter(newFilter)
      setListKey(prev => prev + 1)
      setIsTransitioning(false)
    }, 150)
  }

  // Sort: critical first → priority → SLA urgency; completed at bottom
  const sortedJobs = jobs
    ? [...jobs].sort((a, b) => {
        if (a.status === 'complete' && b.status !== 'complete') return 1
        if (b.status === 'complete' && a.status !== 'complete') return -1
        const priorityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
        if (priorityDiff !== 0) return priorityDiff
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      })
    : []

  const handleJobClick = (job: Job) => {
    setSelectedJob(job)
    setDetailOpen(true)
  }

  const handleAssignClick = () => {
    setDetailOpen(false)
    setAssignOpen(true)
  }

  const handleEscalateClick = () => {
    setDetailOpen(false)
    setEscalateOpen(true)
  }

  const handleAssigned = () => {
    // AssignJobDialog already closes itself; keep detail closed
  }

  const handleQuickComplete = (jobId: string) => {
    const job = jobs?.find(j => j.id === jobId)
    if (job) {
      const startTime = job.startedAt ? new Date(job.startedAt) : new Date(job.createdAt)
      const timeTaken = Math.round((Date.now() - startTime.getTime()) / (60 * 1000))
      updateJob.mutate(
        { id: jobId, status: 'complete', completedAt: new Date().toISOString(), completedIn: timeTaken },
        {
          onSuccess: () => {
            setCompletedJob(job)
            setCompletionTime(timeTaken)
            setCompletionOpen(true)
          },
        }
      )
    }
  }

  const handleAssignToMe = (jobId: string) => {
    updateJob.mutate({
      id: jobId,
      assignee: myStaffMemberId ?? user?.id ?? null,
      assigneeName: user?.name?.split(' ')[0] || 'You',
      status: 'pending',
    })
  }

  const handleJobComplete = (job: Job, timeTaken: number) => {
    setCompletedJob(job)
    setCompletionTime(timeTaken)
    setCompletionOpen(true)
  }

  const getAnimationDelay = (index: number) =>
    Math.min(50 + index * 50, 400)

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <h1 className="text-xl font-semibold text-foreground">Jobs</h1>
        {!isStaff && (
          <Button size="sm" onClick={() => setCreateOpen(true)} className="gap-1.5">
            <Plus className="w-4 h-4" />
            New Job
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="animate-fade-in-scale">
        <JobFilters
          activeFilter={filter}
          onFilterChange={handleFilterChange}
          filters={isStaff ? STAFF_FILTERS : MANAGER_FILTERS}
        />
      </div>

      {/* Job List */}
      {isLoading ? (
        <div className="space-y-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : sortedJobs.length === 0 ? (
        <Card className="p-6 text-center animate-fade-in-up animation-delay-150">
          <Briefcase className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">
            {filter === 'unassigned'
              ? 'No unassigned jobs'
              : filter === 'my-jobs'
                ? 'No jobs assigned to you'
                : filter === 'done' || filter === 'my-done'
                  ? 'No completed jobs yet'
                  : 'No jobs found'}
          </p>
        </Card>
      ) : (
        <div
          key={listKey}
          className={`space-y-3 transition-opacity duration-150 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
        >
          {sortedJobs.map((job, index) => (
            <JobListItem
              key={job.id}
              job={job}
              onClick={() => handleJobClick(job)}
              onQuickComplete={handleQuickComplete}
              onAssignToMe={handleAssignToMe}
              className="animate-stagger-in"
              style={{ animationDelay: `${getAnimationDelay(index)}ms` }}
            />
          ))}
        </div>
      )}

      {/* Job Detail Sheet */}
      <JobDetailSheet
        job={selectedJob}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onAssign={handleAssignClick}
        onEscalate={handleEscalateClick}
        onComplete={handleJobComplete}
      />

      {/* Assign Job Dialog */}
      <AssignJobDialog
        job={selectedJob}
        staff={staff ?? []}
        open={assignOpen}
        onOpenChange={setAssignOpen}
        onAssigned={handleAssigned}
      />

      {/* Create Job Sheet */}
      <CreateJobSheet open={createOpen} onOpenChange={setCreateOpen} />

      {/* Escalation Sheet */}
      <EscalationSheet
        job={selectedJob}
        open={escalateOpen}
        onOpenChange={setEscalateOpen}
      />

      {/* Job Completion Sheet */}
      <JobCompletionSheet
        job={completedJob}
        open={completionOpen}
        onOpenChange={setCompletionOpen}
        timeTaken={completionTime}
      />
    </div>
  )
}
