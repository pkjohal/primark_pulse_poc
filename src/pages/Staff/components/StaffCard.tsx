import { cn, getInitials } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { StaffMember, StaffStatus } from '@/types'

interface StaffCardProps {
  staff: StaffMember
  onClick?: () => void
  className?: string
}

const statusConfig: Record<
  StaffStatus,
  { color: string; label: string }
> = {
  active: { color: 'bg-success', label: 'Active' },
  break: { color: 'bg-warning', label: 'On Break' },
  absent: { color: 'bg-muted-foreground', label: 'Absent' },
}

export function StaffCard({ staff, onClick, className }: StaffCardProps) {
  const status = statusConfig[staff.status]

  return (
    <Card
      variant="interactive"
      className={cn('p-4', className)}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary shrink-0">
          {getInitials(staff.name)}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-foreground truncate">
              {staff.name}
            </h3>
            {/* Status Dot */}
            <span
              className={cn(
                'w-2 h-2 rounded-full shrink-0',
                status.color
              )}
              title={status.label}
            />
          </div>

          <p className="text-xs text-muted-foreground mt-0.5">
            {staff.zone}
          </p>

          <p className="text-xs text-muted-foreground">
            {staff.shiftStart} - {staff.shiftEnd}
          </p>

          {/* Skills */}
          <div className="flex flex-wrap gap-1 mt-2">
            {staff.skills.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="outline" size="sm">
                {skill}
              </Badge>
            ))}
            {staff.skills.length > 3 && (
              <Badge variant="outline" size="sm">
                +{staff.skills.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
