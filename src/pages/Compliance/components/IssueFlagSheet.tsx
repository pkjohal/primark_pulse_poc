import { useState } from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { PhotoCaptureInput } from './inputs/PhotoCaptureInput'
import type { IssueSeverity, ChecklistItemResponse, FlaggedIssue } from '@/types'

interface IssueFlagSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  itemId: string | null
  onSubmit: (response: Omit<ChecklistItemResponse, 'completedAt'>) => void
}

const severityOptions: { value: IssueSeverity; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'text-[#388E3C] bg-[#388E3C]/10 border-[#388E3C]/30' },
  { value: 'medium', label: 'Medium', color: 'text-[#F57C00] bg-[#F57C00]/10 border-[#F57C00]/30' },
  { value: 'high', label: 'High', color: 'text-[#D32F2F] bg-[#D32F2F]/10 border-[#D32F2F]/30' },
]

export function IssueFlagSheet({
  open,
  onOpenChange,
  itemId,
  onSubmit,
}: IssueFlagSheetProps) {
  const [description, setDescription] = useState('')
  const [severity, setSeverity] = useState<IssueSeverity>('medium')
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!itemId || !description.trim()) return

    setIsSubmitting(true)

    // Simulate brief delay
    await new Promise(resolve => setTimeout(resolve, 300))

    const issue: FlaggedIssue = {
      id: `issue-${Date.now()}`,
      itemId,
      description: description.trim(),
      severity,
      photoUrl: photoUrl ?? undefined,
      flaggedAt: new Date().toISOString(),
      flaggedBy: 'Current User',
      status: 'open',
    }

    onSubmit({
      value: false,
      completedBy: 'Current User',
      issue,
      photoUrl: photoUrl ?? undefined,
    })

    // Reset form
    setDescription('')
    setSeverity('medium')
    setPhotoUrl(null)
    setIsSubmitting(false)
  }

  const handleClose = () => {
    // Reset form on close
    setDescription('')
    setSeverity('medium')
    setPhotoUrl(null)
    onOpenChange(false)
  }

  const isValid = description.trim().length > 0

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent
        side="bottom"
        className="h-[85vh] rounded-t-2xl flex flex-col p-0"
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border shrink-0">
          <SheetHeader className="text-left">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#F57C00]/10 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-[#F57C00]" />
              </div>
              <SheetTitle>Flag Issue</SheetTitle>
            </div>
            <SheetDescription>
              Describe the issue you've identified so it can be addressed.
            </SheetDescription>
          </SheetHeader>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              What's the problem? <span className="text-[#D32F2F]">*</span>
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue in detail..."
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* Severity */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Severity
            </label>
            <div className="flex gap-2">
              {severityOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSeverity(option.value)}
                  className={cn(
                    'flex-1 py-2.5 px-4 rounded-lg border-2 text-sm font-medium transition-all',
                    'active:scale-[0.98]',
                    severity === option.value
                      ? option.color
                      : 'bg-white border-slate-200 text-foreground hover:border-slate-300'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Photo Evidence */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Photo evidence <span className="text-muted-foreground">(optional)</span>
            </label>
            <PhotoCaptureInput
              value={photoUrl}
              onChange={setPhotoUrl}
              onClear={() => setPhotoUrl(null)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border shrink-0 bg-background">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isValid || isSubmitting}
              className="flex-1 bg-[#F57C00] hover:bg-[#E65100]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Flagging...
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Flag Issue
                </>
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
