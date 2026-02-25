import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Sheet,
  SheetContent,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useJobsCompletedToday } from '@/hooks/useJobs'
import type { Job } from '@/types'

interface JobCompletionSheetProps {
  job: Job | null
  open: boolean
  onOpenChange: (open: boolean) => void
  timeTaken: number // minutes
}

export function JobCompletionSheet({
  job,
  open,
  onOpenChange,
  timeTaken,
}: JobCompletionSheetProps) {
  const [showCheckmark, setShowCheckmark] = useState(false)
  const jobsCompletedToday = useJobsCompletedToday()

  // Animate checkmark on open
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => setShowCheckmark(true), 100)
      return () => clearTimeout(timer)
    } else {
      setShowCheckmark(false)
    }
  }, [open])

  if (!job) return null

  const isUnderTarget = timeTaken <= job.sla
  const timeDisplay = timeTaken < 60
    ? `${timeTaken} mins`
    : `${Math.floor(timeTaken / 60)}h ${timeTaken % 60}m`

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-auto rounded-t-2xl">
        <div className="py-6 text-center">
          {/* Checkmark animation */}
          <div className="flex justify-center mb-4">
            <div
              className={cn(
                'w-16 h-16 rounded-full bg-success/10 flex items-center justify-center transition-all duration-300',
                showCheckmark ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
              )}
            >
              <Check className="w-8 h-8 text-success" strokeWidth={3} />
            </div>
          </div>

          {/* Done header */}
          <h2 className="text-xl font-semibold text-foreground mb-6">Done</h2>

          {/* Job summary */}
          <div className="space-y-1 mb-6">
            <p className="text-sm text-foreground font-medium">{job.title}</p>
            <p className="text-sm text-muted-foreground">
              {timeDisplay}
              <span className="mx-2">·</span>
              <span className={isUnderTarget ? 'text-success' : 'text-muted-foreground'}>
                {isUnderTarget ? 'Under target' : 'Over target'}
              </span>
            </p>
          </div>

          {/* Divider */}
          <div className="w-24 h-px bg-border mx-auto mb-6" />

          {/* Today's count */}
          <p className="text-sm text-muted-foreground mb-8">
            Today: <span className="font-medium text-foreground">{jobsCompletedToday} jobs done</span>
          </p>

          {/* Nice one button */}
          <Button
            className="w-full max-w-xs mx-auto"
            onClick={() => onOpenChange(false)}
          >
            Nice one
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
