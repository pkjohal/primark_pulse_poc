import { useState } from 'react'
import { Users } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { SkeletonCard } from '@/components/ui/skeleton'
import { useStaff } from '@/hooks/useStaff'
import { mockZones } from '@/mocks/data/staff'
import { ZoneFilters } from './components/ZoneFilters'
import { StaffCard } from './components/StaffCard'
import { StaffDetailSheet } from './components/StaffDetailSheet'
import { ReallocateDialog } from './components/ReallocateDialog'
import type { StaffMember, StaffStatus } from '@/types'

export default function StaffPage() {
  const [activeZone, setActiveZone] = useState('all')
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [reallocateOpen, setReallocateOpen] = useState(false)

  const { data: staff, isLoading } = useStaff()

  // Filter staff by zone
  const filteredStaff = staff
    ? activeZone === 'all'
      ? staff
      : staff.filter((s) => {
          const zone = mockZones.find((z) => z.id === activeZone)
          return zone && s.zone === zone.name
        })
    : []

  // Count staff by status
  const statusCounts = staff?.reduce(
    (acc, s) => {
      acc[s.status] = (acc[s.status] || 0) + 1
      return acc
    },
    {} as Record<StaffStatus, number>
  ) || { active: 0, break: 0, absent: 0 }

  const handleStaffClick = (staffMember: StaffMember) => {
    setSelectedStaff(staffMember)
    setDetailOpen(true)
  }

  const handleReallocateClick = () => {
    setDetailOpen(false)
    setReallocateOpen(true)
  }

  const handleReallocated = () => {
    setDetailOpen(true)
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <h1 className="text-xl font-semibold text-foreground">Staff Overview</h1>

      {/* Summary Stats */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-success" />
          <span className="text-muted-foreground">
            {statusCounts.active || 0} Active
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-warning" />
          <span className="text-muted-foreground">
            {statusCounts.break || 0} On Break
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-muted-foreground" />
          <span className="text-muted-foreground">
            {statusCounts.absent || 0} Absent
          </span>
        </div>
      </div>

      {/* Zone Filters */}
      <ZoneFilters
        zones={mockZones}
        activeZone={activeZone}
        onZoneChange={setActiveZone}
      />

      {/* Staff List */}
      {isLoading ? (
        <div className="space-y-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : filteredStaff.length === 0 ? (
        <Card className="p-6 text-center">
          <Users className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">
            {activeZone === 'all'
              ? 'No staff members found'
              : 'No staff in this zone'}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredStaff.map((staffMember) => (
            <StaffCard
              key={staffMember.id}
              staff={staffMember}
              onClick={() => handleStaffClick(staffMember)}
            />
          ))}
        </div>
      )}

      {/* Staff Detail Sheet */}
      <StaffDetailSheet
        staff={selectedStaff}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onReallocate={handleReallocateClick}
      />

      {/* Reallocate Dialog */}
      <ReallocateDialog
        staff={selectedStaff}
        zones={mockZones}
        open={reallocateOpen}
        onOpenChange={setReallocateOpen}
        onReallocated={handleReallocated}
      />
    </div>
  )
}
