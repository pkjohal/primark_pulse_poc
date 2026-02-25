import { ClipboardList, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { SkeletonCard } from '@/components/ui/skeleton'
import { useChecklists } from '@/hooks/useChecklists'
import { ChecklistCard } from './ChecklistCard'
import type { ChecklistSummary } from '@/types'

interface ChecklistsHomeProps {
  onChecklistSelect: (checklist: ChecklistSummary) => void
  onReportIncident: () => void
  className?: string
}

export function ChecklistsHome({
  onChecklistSelect,
  onReportIncident,
  className,
}: ChecklistsHomeProps) {
  const { data: checklists, isLoading, error } = useChecklists()

  // Separate checklists by status
  const pendingChecklists = checklists?.filter(c => c.status !== 'completed') ?? []
  const completedChecklists = checklists?.filter(c => c.status === 'completed') ?? []

  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )
  }

  if (error) {
    return (
      <Card className="p-6 text-center">
        <AlertTriangle className="w-10 h-10 mx-auto text-[#F57C00] mb-3" />
        <p className="text-sm text-muted-foreground">
          Failed to load checklists. Please try again.
        </p>
      </Card>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Quick Actions */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground px-1">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <Card
            variant="interactive"
            className="p-4 bg-white border border-slate-200 rounded text-center active:scale-[0.98] transition-transform"
            onClick={onReportIncident}
            role="button"
            tabIndex={0}
          >
            <div className="w-10 h-10 rounded-lg bg-[#D32F2F]/10 flex items-center justify-center mx-auto mb-2">
              <AlertTriangle className="w-5 h-5 text-[#D32F2F]" />
            </div>
            <span className="text-sm font-medium text-foreground">Report Incident</span>
          </Card>
          <Card
            variant="interactive"
            className="p-4 bg-white border border-slate-200 rounded text-center active:scale-[0.98] transition-transform opacity-50"
            role="button"
            tabIndex={0}
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
              <ClipboardList className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground">H&S Spot Check</span>
          </Card>
        </div>
      </div>

      {/* Pending Checklists */}
      {pendingChecklists.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground px-1">
            Today's Checklists
          </h2>
          <div className="space-y-3">
            {pendingChecklists.map((checklist, index) => (
              <ChecklistCard
                key={checklist.id}
                checklist={checklist}
                onClick={() => onChecklistSelect(checklist)}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` } as React.CSSProperties}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Checklists */}
      {completedChecklists.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground px-1">
            Completed Today
          </h2>
          <div className="space-y-3">
            {completedChecklists.map((checklist, index) => (
              <ChecklistCard
                key={checklist.id}
                checklist={checklist}
                onClick={() => onChecklistSelect(checklist)}
                className="animate-fade-in-up opacity-70"
                style={{ animationDelay: `${(pendingChecklists.length + index) * 50}ms` } as React.CSSProperties}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!checklists || checklists.length === 0) && (
        <Card className="p-6 text-center">
          <ClipboardList className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">
            No checklists scheduled for today.
          </p>
        </Card>
      )}
    </div>
  )
}
