import { useState } from 'react'
import { Search } from 'lucide-react'
import { cn, getInitials } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useUpdateJob } from '@/hooks/useJobs'
import type { Job, StaffMember } from '@/types'

interface AssignJobDialogProps {
  job: Job | null
  staff: StaffMember[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onAssigned?: () => void
}

const statusColors: Record<string, string> = {
  active: 'text-success',
  break: 'text-warning',
  absent: 'text-muted-foreground',
}

export function AssignJobDialog({
  job,
  staff,
  open,
  onOpenChange,
  onAssigned,
}: AssignJobDialogProps) {
  const [search, setSearch] = useState('')
  const updateJob = useUpdateJob()

  if (!job) return null

  const availableStaff = staff.filter(
    (s) =>
      s.status === 'active' &&
      s.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleAssign = (staffMember: StaffMember) => {
    updateJob.mutate(
      {
        id: job.id,
        assignee: staffMember.id,
        assigneeName: staffMember.name,
        status: 'pending',
      },
      {
        onSuccess: () => {
          onOpenChange(false)
          setSearch('')
          onAssigned?.()
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Job</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Job info */}
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium">{job.title}</p>
            <p className="text-xs text-muted-foreground mt-1">Zone: {job.zone}</p>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search staff..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Staff List */}
          <div className="max-h-64 overflow-y-auto space-y-2">
            {availableStaff.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No available staff found
              </p>
            ) : (
              availableStaff.map((staffMember) => (
                <Button
                  key={staffMember.id}
                  variant="outline"
                  className="w-full justify-start h-auto py-3"
                  onClick={() => handleAssign(staffMember)}
                  disabled={updateJob.isPending}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                      {getInitials(staffMember.name)}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {staffMember.name}
                        </span>
                        <span className={cn('text-xs', statusColors[staffMember.status])}>
                          {staffMember.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {staffMember.zone}
                      </p>
                    </div>
                    {staffMember.skills.slice(0, 2).map((skill) => (
                      <Badge key={skill} variant="outline" size="sm" className="shrink-0">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </Button>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
