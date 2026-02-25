import { useState } from 'react'
import { Search, Plus, X } from 'lucide-react'
import { cn, getInitials } from '@/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useCreateJob, type CreateJobParams } from '@/hooks/useJobs'
import { useStaff } from '@/hooks/useStaff'
import { useToast } from '@/components/ui/toast'
import type { JobPriority, StaffMember } from '@/types'

interface CreateJobSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated?: () => void
}

const STORE_ZONES = [
  'Menswear',
  'Womenswear',
  'Kidswear',
  'Fitting Rooms',
  'Main Tills',
  'Stockroom',
  'Entrance',
  'Home & Beauty',
]

const SLA_OPTIONS = [
  { value: 15, label: '15 min' },
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '1 hr' },
  { value: 120, label: '2 hr' },
]

const PRIORITIES: { value: JobPriority; label: string; color: string }[] = [
  { value: 'CRITICAL', label: 'Critical', color: 'bg-red-100 text-red-700 border-red-200' },
  { value: 'HIGH', label: 'High', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 'MEDIUM', label: 'Medium', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { value: 'LOW', label: 'Low', color: 'bg-slate-100 text-slate-700 border-slate-200' },
]

export function CreateJobSheet({
  open,
  onOpenChange,
  onCreated,
}: CreateJobSheetProps) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<JobPriority>('MEDIUM')
  const [zone, setZone] = useState('')
  const [sla, setSla] = useState(30)
  const [assignee, setAssignee] = useState<StaffMember | null>(null)
  const [showStaffPicker, setShowStaffPicker] = useState(false)
  const [staffSearch, setStaffSearch] = useState('')
  const [whyItMatters, setWhyItMatters] = useState('')
  const [successCriteria, setSuccessCriteria] = useState<string[]>([])
  const [newCriteria, setNewCriteria] = useState('')

  const { data: staff } = useStaff()
  const createJob = useCreateJob()
  const toast = useToast()

  const availableStaff = staff?.filter(
    (s) =>
      s.status === 'active' &&
      s.name.toLowerCase().includes(staffSearch.toLowerCase())
  ) ?? []

  const isValid = title.trim() && zone && sla

  const handleAddCriteria = () => {
    if (newCriteria.trim()) {
      setSuccessCriteria([...successCriteria, newCriteria.trim()])
      setNewCriteria('')
    }
  }

  const handleRemoveCriteria = (index: number) => {
    setSuccessCriteria(successCriteria.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    if (!isValid) return

    const params: CreateJobParams = {
      title: title.trim(),
      priority,
      zone,
      sla,
      assignee: assignee?.id ?? null,
      assigneeName: assignee?.name,
      whyItMatters: whyItMatters.trim() || undefined,
      successCriteria: successCriteria.length > 0 ? successCriteria : undefined,
    }

    createJob.mutate(params, {
      onSuccess: () => {
        toast.success(
          assignee
            ? `Job pushed to ${assignee.name}`
            : 'Job created successfully'
        )
        resetForm()
        onOpenChange(false)
        onCreated?.()
      },
      onError: () => {
        toast.error('Failed to create job')
      },
    })
  }

  const resetForm = () => {
    setTitle('')
    setPriority('MEDIUM')
    setZone('')
    setSla(30)
    setAssignee(null)
    setShowStaffPicker(false)
    setStaffSearch('')
    setWhyItMatters('')
    setSuccessCriteria([])
    setNewCriteria('')
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
          <SheetTitle>Create Job</SheetTitle>
        </SheetHeader>

        <div className="space-y-5">
          {/* Job Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Job Title <span className="text-critical">*</span>
            </label>
            <Input
              placeholder="e.g., Restock jeans wall"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Why It Matters */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Why does this need doing? <span className="text-muted-foreground text-xs">(optional)</span>
            </label>
            <Textarea
              placeholder="e.g., Customers keep asking for these sizes"
              value={whyItMatters}
              onChange={(e) => setWhyItMatters(e.target.value)}
              rows={2}
            />
            <p className="text-xs text-muted-foreground">
              Focus on the human/practical reason, not business metrics
            </p>
          </div>

          {/* Success Criteria */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              How will they know it's done? <span className="text-muted-foreground text-xs">(optional)</span>
            </label>

            {successCriteria.length > 0 && (
              <div className="space-y-2 mb-2">
                {successCriteria.map((criteria, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-muted rounded-lg text-sm"
                  >
                    <span className="flex-1">{criteria}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCriteria(index)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <Input
                placeholder="e.g., All sizes back on wall"
                value={newCriteria}
                onChange={(e) => setNewCriteria(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddCriteria()
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleAddCriteria}
                disabled={!newCriteria.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Priority <span className="text-critical">*</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {PRIORITIES.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value)}
                  className={cn(
                    'px-3 py-2 text-xs font-medium rounded-lg border transition-all',
                    priority === p.value
                      ? p.color
                      : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted'
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Zone */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Zone <span className="text-critical">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {STORE_ZONES.map((z) => (
                <button
                  key={z}
                  type="button"
                  onClick={() => setZone(z)}
                  className={cn(
                    'px-3 py-2 text-sm rounded-lg border transition-all text-left',
                    zone === z
                      ? 'bg-primary/10 text-primary border-primary/30 font-medium'
                      : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted'
                  )}
                >
                  {z}
                </button>
              ))}
            </div>
          </div>

          {/* SLA / Time to Complete */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Time to Complete <span className="text-critical">*</span>
            </label>
            <div className="flex gap-2">
              {SLA_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSla(option.value)}
                  className={cn(
                    'flex-1 px-3 py-2 text-sm rounded-lg border transition-all',
                    sla === option.value
                      ? 'bg-primary/10 text-primary border-primary/30 font-medium'
                      : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Assign to (optional) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Assign to <span className="text-muted-foreground text-xs">(optional)</span>
            </label>

            {!showStaffPicker ? (
              <Button
                variant="outline"
                className="w-full justify-start h-12"
                onClick={() => setShowStaffPicker(true)}
              >
                {assignee ? (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                      {getInitials(assignee.name)}
                    </div>
                    <span>{assignee.name}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">
                    Leave unassigned or select staff...
                  </span>
                )}
              </Button>
            ) : (
              <Card className="p-3 space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search staff..."
                    value={staffSearch}
                    onChange={(e) => setStaffSearch(e.target.value)}
                    className="pl-9"
                    autoFocus
                  />
                </div>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setAssignee(null)
                      setShowStaffPicker(false)
                      setStaffSearch('')
                    }}
                    className="w-full p-2 text-left text-sm text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                  >
                    Leave unassigned
                  </button>
                  {availableStaff.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setAssignee(s)
                        setShowStaffPicker(false)
                        setStaffSearch('')
                      }}
                      className="w-full p-2 text-left hover:bg-muted rounded-lg transition-colors flex items-center gap-2"
                    >
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                        {getInitials(s.name)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{s.name}</p>
                        <p className="text-xs text-muted-foreground">{s.zone}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Submit Button */}
          <Button
            className="w-full h-12 text-base"
            onClick={handleSubmit}
            disabled={!isValid || createJob.isPending}
          >
            {createJob.isPending ? 'Creating...' : 'Push Job'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
