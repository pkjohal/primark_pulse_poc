import { MapPin, Clock, UserCog } from 'lucide-react'
import { cn, getInitials } from '@/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { StaffMember, StaffStatus } from '@/types'

interface StaffDetailSheetProps {
  staff: StaffMember | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onReallocate?: () => void
}

const statusConfig: Record<
  StaffStatus,
  { color: string; dotColor: string; label: string }
> = {
  active: { color: 'text-success', dotColor: 'bg-success', label: 'Active' },
  break: { color: 'text-warning', dotColor: 'bg-warning', label: 'On Break' },
  absent: { color: 'text-muted-foreground', dotColor: 'bg-muted-foreground', label: 'Absent' },
}

export function StaffDetailSheet({
  staff,
  open,
  onOpenChange,
  onReallocate,
}: StaffDetailSheetProps) {
  if (!staff) return null

  const status = statusConfig[staff.status]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-auto max-h-[85vh]">
        <SheetHeader className="text-left">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-base font-medium text-primary">
              {getInitials(staff.name)}
            </div>
            <div>
              <SheetTitle className="text-lg">{staff.name}</SheetTitle>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={cn(
                    'w-2 h-2 rounded-full',
                    status.dotColor
                  )}
                />
                <span className={cn('text-sm', status.color)}>
                  {status.label}
                </span>
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          {/* Zone */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Zone:</span>
            <span className="text-sm font-medium">{staff.zone}</span>
          </div>

          {/* Shift */}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Shift:</span>
            <span className="text-sm font-medium">
              {staff.shiftStart} - {staff.shiftEnd}
            </span>
          </div>

          {/* Skills */}
          <div className="pt-3 border-t border-border">
            <p className="text-sm text-muted-foreground mb-2">Skills</p>
            <div className="flex flex-wrap gap-2">
              {staff.skills.map((skill) => (
                <Badge key={skill} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Actions */}
          {staff.status === 'active' && onReallocate && (
            <div className="pt-4 border-t border-border">
              <Button
                variant="outline"
                className="w-full"
                onClick={onReallocate}
              >
                <UserCog className="w-4 h-4 mr-2" />
                Reallocate to Zone
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
