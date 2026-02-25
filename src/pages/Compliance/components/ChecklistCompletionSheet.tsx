import { useState } from 'react'
import { CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SignaturePad } from './SignaturePad'
import { useCompleteChecklist } from '@/hooks/useChecklists'
import { useAuthStore } from '@/stores/authStore'
import type { Checklist } from '@/types'

interface ChecklistCompletionSheetProps {
  checklist: Checklist | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: () => void
}

export function ChecklistCompletionSheet({
  checklist,
  open,
  onOpenChange,
  onComplete,
}: ChecklistCompletionSheetProps) {
  const [signature, setSignature] = useState<string | null>(null)
  const completeChecklist = useCompleteChecklist()
  const { user } = useAuthStore()

  // Count flagged issues
  const flaggedIssues = checklist?.sections.flatMap(s =>
    s.items.filter(item => item.response?.issue)
  ) ?? []

  const handleSubmit = async () => {
    if (!checklist || !signature) return

    await completeChecklist.mutateAsync({
      checklistId: checklist.id,
      signature: {
        imageData: signature,
        signedAt: new Date().toISOString(),
        signedBy: user?.name ?? 'Staff Member',
        role: user?.role ?? 'Team Member',
      },
    })

    setSignature(null)
    onComplete()
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[85vh] rounded-t-2xl flex flex-col p-0"
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border shrink-0">
          <SheetHeader className="text-left">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#388E3C]/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-[#388E3C]" />
              </div>
              <div>
                <SheetTitle>Complete Checklist</SheetTitle>
                <SheetDescription>{checklist?.name}</SheetDescription>
              </div>
            </div>
          </SheetHeader>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Summary */}
          <Card className="p-4 bg-[#388E3C]/5 border-[#388E3C]/30">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#388E3C]" />
              <div>
                <p className="text-sm font-medium text-[#388E3C]">
                  All items completed
                </p>
                <p className="text-xs text-muted-foreground">
                  {checklist?.totalItems} items checked
                </p>
              </div>
            </div>
          </Card>

          {/* Flagged Issues */}
          {flaggedIssues.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#F57C00]" />
                Flagged Issues ({flaggedIssues.length})
              </h3>
              <div className="space-y-2">
                {flaggedIssues.map((item) => (
                  <Card
                    key={item.id}
                    className="p-3 bg-[#F57C00]/5 border-[#F57C00]/30"
                  >
                    <p className="text-sm font-medium text-foreground">
                      {item.item}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.response?.issue?.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={cn(
                        'text-xs font-medium px-2 py-0.5 rounded-full',
                        item.response?.issue?.severity === 'high' && 'bg-[#D32F2F]/10 text-[#D32F2F]',
                        item.response?.issue?.severity === 'medium' && 'bg-[#F57C00]/10 text-[#F57C00]',
                        item.response?.issue?.severity === 'low' && 'bg-[#388E3C]/10 text-[#388E3C]'
                      )}>
                        {item.response?.issue?.severity?.toUpperCase()}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Signature */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">
              Sign to confirm completion
            </h3>
            <p className="text-xs text-muted-foreground">
              I confirm that this checklist has been completed accurately and all items have been verified.
            </p>
            <SignaturePad onSignatureChange={setSignature} />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border shrink-0 bg-background">
          <Button
            onClick={handleSubmit}
            disabled={!signature || completeChecklist.isPending}
            className="w-full"
          >
            {completeChecklist.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Submit Checklist
              </>
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
