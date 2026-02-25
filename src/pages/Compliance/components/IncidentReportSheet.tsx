import { useState } from 'react'
import { AlertTriangle, Loader2, Clock, MapPin } from 'lucide-react'
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
import { IncidentTypeSelector } from './IncidentTypeSelector'
import { PhotoCaptureInput } from './inputs/PhotoCaptureInput'
import { useSubmitIncidentReport } from '@/hooks/useChecklists'
import { useAuthStore } from '@/stores/authStore'
import { storeZones } from '@/mocks/data/compliance'
import type { IncidentType, IssueSeverity } from '@/types'

interface IncidentReportSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

const severityOptions: { value: IssueSeverity; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'text-[#388E3C] bg-[#388E3C]/10 border-[#388E3C]/30' },
  { value: 'medium', label: 'Medium', color: 'text-[#F57C00] bg-[#F57C00]/10 border-[#F57C00]/30' },
  { value: 'high', label: 'High', color: 'text-[#D32F2F] bg-[#D32F2F]/10 border-[#D32F2F]/30' },
]

export function IncidentReportSheet({
  open,
  onOpenChange,
  onSuccess,
}: IncidentReportSheetProps) {
  const [incidentType, setIncidentType] = useState<IncidentType | null>(null)
  const [location, setLocation] = useState<string>('')
  const [description, setDescription] = useState('')
  const [severity, setSeverity] = useState<IssueSeverity>('medium')
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [followUpRequired, setFollowUpRequired] = useState(false)

  const submitReport = useSubmitIncidentReport()
  const { user } = useAuthStore()

  const handleSubmit = async () => {
    if (!incidentType || !location || !description.trim()) return

    await submitReport.mutateAsync({
      type: incidentType,
      location,
      occurredAt: new Date().toISOString(),
      reportedBy: user?.name ?? 'Staff Member',
      description: description.trim(),
      photoUrl: photoUrl ?? undefined,
      severity,
      followUpRequired,
    })

    // Reset form
    resetForm()
    onOpenChange(false)
    onSuccess?.()
  }

  const resetForm = () => {
    setIncidentType(null)
    setLocation('')
    setDescription('')
    setSeverity('medium')
    setPhotoUrl(null)
    setFollowUpRequired(false)
  }

  const handleClose = () => {
    resetForm()
    onOpenChange(false)
  }

  const isValid = incidentType && location && description.trim().length > 0

  // Get current time for display
  const now = new Date()
  const timeString = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent
        side="bottom"
        className="h-[90vh] rounded-t-2xl flex flex-col p-0"
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border shrink-0">
          <SheetHeader className="text-left">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#D32F2F]/10 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-[#D32F2F]" />
              </div>
              <SheetTitle>Report Incident</SheetTitle>
            </div>
            <SheetDescription>
              Document the incident for safety records and follow-up.
            </SheetDescription>
          </SheetHeader>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Incident Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Incident type <span className="text-[#D32F2F]">*</span>
            </label>
            <IncidentTypeSelector
              value={incidentType}
              onChange={setIncidentType}
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-1">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              Location <span className="text-[#D32F2F]">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {storeZones.map((zone) => (
                <button
                  key={zone}
                  type="button"
                  onClick={() => setLocation(zone)}
                  className={cn(
                    'px-3 py-2 text-sm rounded-lg border transition-all',
                    'active:scale-[0.98]',
                    location === zone
                      ? 'bg-primary/10 text-primary border-primary/30 font-medium'
                      : 'bg-white border-slate-200 text-foreground hover:border-slate-300'
                  )}
                >
                  {zone}
                </button>
              ))}
            </div>
          </div>

          {/* Time */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Reporting at {timeString}</span>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Description <span className="text-[#D32F2F]">*</span>
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what happened in detail..."
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

          {/* Follow-up Required */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setFollowUpRequired(!followUpRequired)}
              className={cn(
                'w-6 h-6 rounded border-2 flex items-center justify-center transition-all',
                followUpRequired
                  ? 'bg-primary border-primary text-white'
                  : 'border-slate-300 hover:border-slate-400'
              )}
            >
              {followUpRequired && (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            <label className="text-sm text-foreground">
              Follow-up action required
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border shrink-0 bg-background">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={submitReport.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isValid || submitReport.isPending}
              className="flex-1 bg-[#D32F2F] hover:bg-[#B71C1C]"
            >
              {submitReport.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Report'
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
