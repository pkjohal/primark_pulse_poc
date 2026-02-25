import { useState } from 'react'
import { Search } from 'lucide-react'
import { cn, getInitials } from '@/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useCreateTask, type CreateTaskParams } from '@/hooks/useTasks'
import { useStaff } from '@/hooks/useStaff'
import { useToast } from '@/components/ui/toast'
import type { TaskPriority, StaffMember } from '@/types'

interface CreateTaskSheetProps {
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

const PRIORITIES: { value: TaskPriority; label: string; color: string }[] = [
  { value: 'CRITICAL', label: 'Critical', color: 'bg-red-100 text-red-700 border-red-200' },
  { value: 'HIGH', label: 'High', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 'MEDIUM', label: 'Medium', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { value: 'LOW', label: 'Low', color: 'bg-slate-100 text-slate-700 border-slate-200' },
]

export function CreateTaskSheet({
  open,
  onOpenChange,
  onCreated,
}: CreateTaskSheetProps) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM')
  const [zone, setZone] = useState('')
  const [sla, setSla] = useState(30)
  const [assignee, setAssignee] = useState<StaffMember | null>(null)
  const [showStaffPicker, setShowStaffPicker] = useState(false)
  const [staffSearch, setStaffSearch] = useState('')

  const { data: staff } = useStaff()
  const createTask = useCreateTask()
  const toast = useToast()

  const availableStaff = staff?.filter(
    (s) =>
      s.status === 'active' &&
      s.name.toLowerCase().includes(staffSearch.toLowerCase())
  ) ?? []

  const isValid = title.trim() && zone && sla

  const handleSubmit = () => {
    if (!isValid) return

    const params: CreateTaskParams = {
      title: title.trim(),
      priority,
      zone,
      sla,
      assignee: assignee?.id ?? null,
      assigneeName: assignee?.name,
    }

    createTask.mutate(params, {
      onSuccess: () => {
        toast.success(
          assignee
            ? `Task pushed to ${assignee.name}`
            : 'Task created successfully'
        )
        resetForm()
        onOpenChange(false)
        onCreated?.()
      },
      onError: () => {
        toast.error('Failed to create task')
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
          <SheetTitle>Create Task</SheetTitle>
        </SheetHeader>

        <div className="space-y-5">
          {/* Task Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Task Title <span className="text-critical">*</span>
            </label>
            <Input
              placeholder="e.g., Restock jeans wall"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
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
                  {/* Option to leave unassigned */}
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
            disabled={!isValid || createTask.isPending}
          >
            {createTask.isPending ? 'Creating...' : 'Push Task'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
