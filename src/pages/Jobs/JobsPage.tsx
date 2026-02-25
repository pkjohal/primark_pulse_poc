import { useState } from 'react'
import { Briefcase, Plus } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SkeletonCard } from '@/components/ui/skeleton'
import { useJobs, useUpdateJob } from '@/hooks/useJobs'
import { useStaff } from '@/hooks/useStaff'
import { useAuthStore } from '@/stores/authStore'
import { JobFilters } from './components/JobFilters'
import { JobListItem } from './components/JobListItem'
import { JobDetailSheet } from './components/JobDetailSheet'
import { AssignJobDialog } from './components/AssignJobDialog'
import { CreateJobSheet } from './components/CreateJobSheet'
import { PriorityJobs } from './components/TodaysTopJobs'
import { JobCompletionSheet } from './components/JobCompletionSheet'
import { EscalationSheet } from './components/EscalationSheet'
import type { Job, JobFilter } from '@/types'

export default function JobsPage() {
  const [filter, setFilter] = useState<JobFilter>('all')
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [assignOpen, setAssignOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [escalateOpen, setEscalateOpen] = useState(false)
  const [completionOpen, setCompletionOpen] = useState(false)
  const [completedJob, setCompletedJob] = useState<Job | null>(null)
  const [completionTime, setCompletionTime] = useState(0)

  // Animation state for filter transitions
  const [listKey, setListKey] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const { data: jobs, isLoading } = useJobs(filter)
  const { data: staff } = useStaff()
  const updateJob = useUpdateJob()
  const { user } = useAuthStore()

  // Handle filter change with animation
  const handleFilterChange = (newFilter: JobFilter) => {
    if (newFilter === filter) return

    setIsTransitioning(true)

    // After fade out, update filter and trigger stagger in
    setTimeout(() => {
      setFilter(newFilter)
      setListKey(prev => prev + 1)
      setIsTransitioning(false)
    }, 150)
  }

  // Sort jobs: CRITICAL first, then by SLA urgency
  const sortedJobs = jobs
    ? [...jobs].sort((a, b) => {
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
    setDetailOpen(true)
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
      assignee: 'current-user',
      assigneeName: user?.name?.split(' ')[0] || 'You',
      status: 'pending',
    })
  }

  const handleStartJob = (jobId: string) => {
    updateJob.mutate({
      id: jobId,
      status: 'in-progress',
      startedAt: new Date().toISOString(),
      assignee: 'current-user',
      assigneeName: user?.name?.split(' ')[0] || 'You',
    })
  }

  const handleJobComplete = (job: Job, timeTaken: number) => {
    setCompletedJob(job)
    setCompletionTime(timeTaken)
    setCompletionOpen(true)
  }

  const getAnimationDelay = (index: number) => {
    const baseDelay = 50
    const stagger = 50
    const maxDelay = 400
    return Math.min(baseDelay + index * stagger, maxDelay)
  }

  return (
    <div className="p-4 space-y-4">
      {/* Priority Jobs */}
      <PriorityJobs
        onJobClick={handleJobClick}
        onStartJob={handleStartJob}
        className="animate-fade-in-up"
      />

      {/* Filters - centered */}
      <div className="flex justify-center animate-fade-in-scale">
        <JobFilters
          activeFilter={filter}
          onFilterChange={handleFilterChange}
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
      <CreateJobSheet
        open={createOpen}
        onOpenChange={setCreateOpen}
      />

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

      {/* FAB - Create Job Button with press animation */}
      <Button
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full shadow-lg z-40 active:scale-95 transition-transform duration-150"
        onClick={() => setCreateOpen(true)}
      >
        <Plus className="w-6 h-6" />
      </Button>
    </div>
  )
}
