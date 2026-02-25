import { MapPin } from 'lucide-react'
import { cn, getInitials } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useUpdateStaffZone } from '@/hooks/useStaff'
import type { StaffMember } from '@/types'

interface Zone {
  id: string
  name: string
}

interface ReallocateDialogProps {
  staff: StaffMember | null
  zones: Zone[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onReallocated?: () => void
}

export function ReallocateDialog({
  staff,
  zones,
  open,
  onOpenChange,
  onReallocated,
}: ReallocateDialogProps) {
  const updateZone = useUpdateStaffZone()

  if (!staff) return null

  // Filter out "All Zones" and current zone
  const availableZones = zones.filter(
    (z) => z.id !== 'all' && z.name !== staff.zone
  )

  const handleReallocate = (zone: Zone) => {
    updateZone.mutate(
      {
        id: staff.id,
        zone: zone.name,
      },
      {
        onSuccess: () => {
          onOpenChange(false)
          onReallocated?.()
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Reallocate Staff</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Staff info */}
          <div className="p-3 bg-muted rounded-lg flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
              {getInitials(staff.name)}
            </div>
            <div>
              <p className="text-sm font-medium">{staff.name}</p>
              <p className="text-xs text-muted-foreground">
                Currently in: {staff.zone}
              </p>
            </div>
          </div>

          {/* Zone List */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Select new zone:</p>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {availableZones.map((zone) => (
                <Button
                  key={zone.id}
                  variant="outline"
                  className="w-full justify-start h-auto py-3"
                  onClick={() => handleReallocate(zone)}
                  disabled={updateZone.isPending}
                >
                  <MapPin className={cn(
                    'w-4 h-4 mr-2',
                    'text-primary'
                  )} />
                  <span className="text-sm font-medium">{zone.name}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
