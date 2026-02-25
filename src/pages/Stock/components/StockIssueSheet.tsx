import { useState } from 'react'
import { AlertTriangle, Package } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/toast'
import type { Product, StockIssueType } from '@/types'

interface StockIssueSheetProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ISSUE_TYPES: { value: StockIssueType; label: string }[] = [
  { value: 'wrong-location', label: 'Wrong location' },
  { value: 'damaged', label: 'Damaged stock' },
  { value: 'count-mismatch', label: 'Count mismatch' },
  { value: 'missing-tag', label: 'Missing tag/label' },
  { value: 'display-issue', label: 'Display issue' },
  { value: 'other', label: 'Other' },
]

export function StockIssueSheet({ product, open, onOpenChange }: StockIssueSheetProps) {
  const [issueType, setIssueType] = useState<StockIssueType | null>(null)
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const toast = useToast()

  if (!product) return null

  const handleSubmit = async () => {
    if (!issueType) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))

    toast.success('Issue reported successfully')
    resetForm()
    onOpenChange(false)
    setIsSubmitting(false)
  }

  const resetForm = () => {
    setIssueType(null)
    setNotes('')
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm()
    }
    onOpenChange(newOpen)
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="bottom" className="h-[80vh] rounded-t-2xl overflow-y-auto">
        <SheetHeader className="pb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#F57C00]" />
            <SheetTitle>Report Stock Issue</SheetTitle>
          </div>
        </SheetHeader>

        <div className="space-y-5">
          {/* Product context */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded">
            <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center shrink-0">
              <Package className="w-5 h-5 text-slate-500" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{product.name}</p>
              <p className="text-xs text-slate-500">Barcode: {product.barcode}</p>
            </div>
          </div>

          {/* Issue type selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900">
              What's the issue? <span className="text-[#D32F2F]">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {ISSUE_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setIssueType(type.value)}
                  className={cn(
                    'px-3 py-2 text-sm rounded border transition-all',
                    issueType === type.value
                      ? 'bg-[#F57C00]/10 text-[#F57C00] border-[#F57C00]/30 font-medium'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  )}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900">
              Details <span className="text-slate-400 text-xs font-normal">(optional)</span>
            </label>
            <Textarea
              placeholder="Any extra details that might help..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Info text */}
          <p className="text-xs text-slate-500">
            This will be logged and sent to the stock team for review.
          </p>

          {/* Submit button */}
          <Button
            className="w-full h-12 text-base bg-[#F57C00] hover:bg-[#E65100] text-white"
            onClick={handleSubmit}
            disabled={!issueType || isSubmitting}
          >
            {isSubmitting ? 'Reporting...' : 'Report Issue'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
