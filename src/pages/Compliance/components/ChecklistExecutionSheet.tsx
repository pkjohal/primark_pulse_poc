import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { SkeletonCard } from '@/components/ui/skeleton'
import { useChecklistDetail, useStartChecklist, useSubmitChecklistItem } from '@/hooks/useChecklists'
import { EnhancedChecklistSection } from './EnhancedChecklistSection'
import { IssueFlagSheet } from './IssueFlagSheet'
import type { ChecklistSummary, ChecklistItemResponse } from '@/types'

interface ChecklistExecutionSheetProps {
  checklist: ChecklistSummary | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: (checklistId: string) => void
}

export function ChecklistExecutionSheet({
  checklist,
  open,
  onOpenChange,
  onComplete,
}: ChecklistExecutionSheetProps) {
  const [issueFlagOpen, setIssueFlagOpen] = useState(false)
  const [flaggingItemId, setFlaggingItemId] = useState<string | null>(null)

  const { data: checklistDetail, isLoading } = useChecklistDetail(
    open && checklist ? checklist.id : null
  )
  const startChecklist = useStartChecklist()
  const submitItem = useSubmitChecklistItem()

  // Start checklist if not started
  useEffect(() => {
    if (checklistDetail && checklistDetail.status === 'not-started') {
      startChecklist.mutate(checklistDetail.id)
    }
  }, [checklistDetail?.id, checklistDetail?.status])

  const handleItemSubmit = (itemId: string, response: Omit<ChecklistItemResponse, 'completedAt'>) => {
    if (!checklistDetail) return

    submitItem.mutate({
      checklistId: checklistDetail.id,
      itemId,
      response,
    })
  }

  const handleItemFlagIssue = (itemId: string) => {
    setFlaggingItemId(itemId)
    setIssueFlagOpen(true)
  }

  const handleIssueFlagged = (response: Omit<ChecklistItemResponse, 'completedAt'>) => {
    if (!checklistDetail || !flaggingItemId) return

    submitItem.mutate({
      checklistId: checklistDetail.id,
      itemId: flaggingItemId,
      response,
    })

    setIssueFlagOpen(false)
    setFlaggingItemId(null)
  }

  const progress = checklistDetail
    ? Math.round((checklistDetail.completedItems / checklistDetail.totalItems) * 100)
    : 0

  const allComplete = checklistDetail?.completedItems === checklistDetail?.totalItems

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="h-[90vh] rounded-t-2xl flex flex-col p-0"
        >
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-border shrink-0">
            <SheetHeader className="text-left">
              <SheetTitle>{checklist?.name ?? 'Checklist'}</SheetTitle>
              {checklistDetail?.description && (
                <SheetDescription>{checklistDetail.description}</SheetDescription>
              )}
            </SheetHeader>

            {/* Progress */}
            {checklistDetail && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progress</span>
                  <span className={cn(
                    'font-medium',
                    allComplete ? 'text-[#388E3C]' : 'text-foreground'
                  )}>
                    {checklistDetail.completedItems} of {checklistDetail.totalItems} items
                  </span>
                </div>
                <Progress
                  value={progress}
                  className="h-2"
                  indicatorClassName={allComplete ? 'bg-[#388E3C]' : 'bg-primary'}
                />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {isLoading ? (
              <div className="space-y-4">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ) : checklistDetail ? (
              <div className="space-y-6">
                {checklistDetail.sections.map((section, index) => (
                  <EnhancedChecklistSection
                    key={section.id}
                    section={section}
                    onItemSubmit={handleItemSubmit}
                    onItemFlagIssue={handleItemFlagIssue}
                    defaultExpanded={index === 0 || section.completedCount < section.totalCount}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Failed to load checklist
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border shrink-0 bg-background">
            <Button
              onClick={() => checklistDetail && onComplete(checklistDetail.id)}
              disabled={!allComplete || submitItem.isPending}
              className="w-full"
            >
              {submitItem.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : allComplete ? (
                'Complete & Sign'
              ) : (
                `${checklistDetail ? checklistDetail.totalItems - checklistDetail.completedItems : 0} items remaining`
              )}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Issue Flag Sheet */}
      <IssueFlagSheet
        open={issueFlagOpen}
        onOpenChange={setIssueFlagOpen}
        itemId={flaggingItemId}
        onSubmit={handleIssueFlagged}
      />
    </>
  )
}
