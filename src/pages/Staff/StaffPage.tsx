import { useState } from 'react'
import { Users } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { SkeletonCard } from '@/components/ui/skeleton'
import { useStaff } from '@/hooks/useStaff'
import { mockZones } from '@/mocks/data/staff'
import { StaffCard } from './components/StaffCard'
import { StaffDetailSheet } from './components/StaffDetailSheet'
import { ReallocateDialog } from './components/ReallocateDialog'
import { cn } from '@/lib/utils'
import type { StaffMember, StaffStatus } from '@/types'

type StatusFilter = 'all' | StaffStatus

const statusFilters: { id: StatusFilter; label: string }[] = [
  { id: 'all',    label: 'All'      },
  { id: 'active', label: 'Active'   },
  { id: 'break',  label: 'On Break' },
  { id: 'absent', label: 'Absent'   },
]

export default function StaffPage() {
  const [activeStatus, setActiveStatus] = useState<StatusFilter>('all')
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [reallocateOpen, setReallocateOpen] = useState(false)

  const { data: staff, isLoading } = useStaff()

  const statusOrder: Record<StaffStatus, number> = { active: 0, break: 1, absent: 2 }

  // Filter staff by status, then sort: active (by zone) → break → absent
  const filteredStaff = (staff ?? [])
    .filter(s => activeStatus === 'all' || s.status === activeStatus)
    .sort((a, b) => {
      const statusDiff = statusOrder[a.status] - statusOrder[b.status]
      if (statusDiff !== 0) return statusDiff
      // Within active, sort by zone name
      if (a.status === 'active') return a.zone.localeCompare(b.zone)
      return 0
    })

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
    setDetailOpen(false)
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <h1 className="text-xl font-semibold text-foreground animate-fade-in-up">Staff Overview</h1>

      {/* Summary Stats */}
      <div className="flex items-center gap-4 text-sm animate-fade-in-up animation-delay-100">
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

      {/* Status Filters */}
      <div className="flex gap-2">
        {statusFilters.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveStatus(id)}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-full transition-colors shrink-0 min-h-[44px]',
              activeStatus === id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            {label}
          </button>
        ))}
      </div>

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
            {activeStatus === 'all'
              ? 'No staff members found'
              : `No staff currently ${activeStatus === 'break' ? 'on break' : activeStatus}`}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredStaff.map((staffMember, index) => (
            <div
              key={staffMember.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <StaffCard
                staff={staffMember}
                onClick={() => handleStaffClick(staffMember)}
              />
            </div>
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
