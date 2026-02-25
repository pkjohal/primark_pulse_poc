import { useEffect } from 'react'
import { CheckCircle2 } from 'lucide-react'
import {
  Sheet,
  SheetContent,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

interface CompletionSuccessSheetProps {
  checklistName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CompletionSuccessSheet({
  checklistName,
  open,
  onOpenChange,
}: CompletionSuccessSheetProps) {
  // Auto-close after 3 seconds
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onOpenChange(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [open, onOpenChange])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-auto rounded-t-2xl flex flex-col items-center justify-center p-8"
      >
        {/* Success Animation */}
        <div className="w-20 h-20 rounded-full bg-[#388E3C]/10 flex items-center justify-center mb-4 animate-scale-in">
          <CheckCircle2 className="w-10 h-10 text-[#388E3C]" />
        </div>

        <h2 className="text-xl font-semibold text-foreground text-center mb-2 animate-fade-in-up animation-delay-100">
          Checklist Complete
        </h2>

        <p className="text-sm text-muted-foreground text-center mb-6 animate-fade-in-up animation-delay-200">
          {checklistName} has been submitted successfully.
        </p>

        <Button
          onClick={() => onOpenChange(false)}
          className="w-full max-w-xs animate-fade-in-up animation-delay-300"
        >
          Done
        </Button>
      </SheetContent>
    </Sheet>
  )
}
