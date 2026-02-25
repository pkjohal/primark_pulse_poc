import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useEscalateJob } from '@/hooks/useJobs'
import { useToast } from '@/components/ui/toast'
import type { Job, EscalationReason } from '@/types'

interface EscalationSheetProps {
  job: Job | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ESCALATION_REASONS: { value: EscalationReason; label: string }[] = [
  { value: 'cant-complete', label: "Can't complete" },
  { value: 'need-help', label: 'Need help' },
  { value: 'equipment-issue', label: 'Equipment issue' },
  { value: 'stock-issue', label: 'Stock issue' },
  { value: 'other', label: 'Other' },
]

const ESCALATE_TO: { value: 'store-manager' | 'regional-manager'; label: string }[] = [
  { value: 'store-manager', label: 'Store Manager' },
  { value: 'regional-manager', label: 'Regional Manager' },
]

export function EscalationSheet({ job, open, onOpenChange }: EscalationSheetProps) {
  const [reason, setReason] = useState<EscalationReason | null>(null)
  const [notes, setNotes] = useState('')
  const [escalateTo, setEscalateTo] = useState<'store-manager' | 'regional-manager'>('store-manager')

  const escalateJob = useEscalateJob()
  const toast = useToast()

  if (!job) return null

  const handleEscalate = () => {
    if (!reason) return

    escalateJob.mutate(
      {
        id: job.id,
        reason,
        notes: notes.trim() || undefined,
        escalatedTo: escalateTo,
      },
      {
        onSuccess: () => {
          toast.success(`Issue flagged to ${escalateTo === 'store-manager' ? 'Store Manager' : 'Regional Manager'}`)
          resetForm()
          onOpenChange(false)
        },
        onError: () => {
          toast.error('Failed to flag issue')
        },
      }
    )
  }

  const resetForm = () => {
    setReason(null)
    setNotes('')
    setEscalateTo('store-manager')
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm()
    }
    onOpenChange(newOpen)
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl overflow-y-auto">
        <SheetHeader className="pb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <SheetTitle>Flag an Issue</SheetTitle>
          </div>
        </SheetHeader>

        <div className="space-y-5">
          {/* Job context */}
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium">{job.title}</p>
            <p className="text-xs text-muted-foreground mt-1">Zone: {job.zone}</p>
          </div>

          {/* Reason selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              What's the issue? <span className="text-critical">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {ESCALATION_REASONS.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setReason(r.value)}
                  className={cn(
                    'px-3 py-2 text-sm rounded-lg border transition-all',
                    reason === r.value
                      ? 'bg-warning/10 text-warning border-warning/30 font-medium'
                      : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted'
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Details <span className="text-muted-foreground text-xs">(optional)</span>
            </label>
            <Textarea
              placeholder="Any extra details that might help..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Escalate to */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Flag to
            </label>
            <div className="flex gap-2">
              {ESCALATE_TO.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setEscalateTo(option.value)}
                  className={cn(
                    'flex-1 px-3 py-2 text-sm rounded-lg border transition-all',
                    escalateTo === option.value
                      ? 'bg-primary/10 text-primary border-primary/30 font-medium'
                      : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Info text */}
          <p className="text-xs text-muted-foreground">
            This will notify the {escalateTo === 'store-manager' ? 'Store Manager' : 'Regional Manager'} immediately.
          </p>

          {/* Submit button */}
          <Button
            className="w-full h-12 text-base"
            variant="warning"
            onClick={handleEscalate}
            disabled={!reason || escalateJob.isPending}
          >
            {escalateJob.isPending ? 'Flagging...' : 'Flag Issue'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
