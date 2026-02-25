import { useState } from 'react'
import { CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { BooleanInput, NumericInput, TextNotesInput, PhotoCaptureInput } from './inputs'
import type { EnhancedChecklistItem as EnhancedChecklistItemType, ChecklistItemResponse } from '@/types'

interface EnhancedChecklistItemProps {
  item: EnhancedChecklistItemType
  onSubmit: (response: Omit<ChecklistItemResponse, 'completedAt'>) => void
  onFlagIssue: (value: boolean) => void
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
}

export function EnhancedChecklistItem({
  item,
  onSubmit,
  onFlagIssue,
  disabled,
  className,
  style,
}: EnhancedChecklistItemProps) {
  const [localValue, setLocalValue] = useState<boolean | number | string | null>(
    item.response?.value ?? null
  )

  const isCompleted = item.response !== undefined
  const hasIssue = item.response?.issue !== undefined

  const handleBooleanChange = (value: boolean) => {
    setLocalValue(value)

    if (value === false) {
      // Trigger issue flagging when "No" is selected
      onFlagIssue(false)
    } else {
      // Submit positive response
      onSubmit({
        value: true,
        completedBy: 'Current User',
      })
    }
  }

  const handleNumericChange = (value: number) => {
    setLocalValue(value)
    onSubmit({
      value,
      completedBy: 'Current User',
    })
  }

  const handleTextChange = (value: string) => {
    setLocalValue(value)
    // For text, we'll submit on blur or explicit action
  }

  const handleTextSubmit = () => {
    if (localValue !== null && localValue !== '') {
      onSubmit({
        value: localValue,
        completedBy: 'Current User',
      })
    }
  }

  const handlePhotoCapture = (photoUrl: string) => {
    setLocalValue(photoUrl)
    onSubmit({
      value: 'Photo captured',
      photoUrl,
      completedBy: 'Current User',
    })
  }

  const renderInput = () => {
    switch (item.inputType) {
      case 'boolean':
        return (
          <BooleanInput
            value={localValue as boolean | null}
            onChange={handleBooleanChange}
            disabled={disabled || isCompleted}
          />
        )
      case 'numeric':
        return (
          <NumericInput
            value={localValue as number | null}
            onChange={handleNumericChange}
            config={item.numericConfig}
            disabled={disabled || isCompleted}
          />
        )
      case 'text':
        return (
          <div className="space-y-2">
            <TextNotesInput
              value={localValue as string | null}
              onChange={handleTextChange}
              placeholder={item.description || 'Enter notes...'}
              disabled={disabled || isCompleted}
            />
            {!isCompleted && localValue && (
              <button
                type="button"
                onClick={handleTextSubmit}
                className="text-sm text-primary font-medium hover:underline"
              >
                Save notes
              </button>
            )}
          </div>
        )
      case 'photo':
        return (
          <PhotoCaptureInput
            value={item.response?.photoUrl ?? null}
            onChange={handlePhotoCapture}
            onClear={() => setLocalValue(null)}
            disabled={disabled || isCompleted}
          />
        )
      default:
        return null
    }
  }

  return (
    <Card className={cn(
      'p-4 bg-white border border-slate-200 rounded',
      isCompleted && !hasIssue && 'border-[#388E3C]/30 bg-[#388E3C]/5',
      hasIssue && 'border-[#F57C00]/30 bg-[#F57C00]/5',
      className
    )} style={style}>
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        {isCompleted ? (
          hasIssue ? (
            <div className="w-6 h-6 rounded-full bg-[#F57C00]/10 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-4 h-4 text-[#F57C00]" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-[#388E3C]/10 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-4 h-4 text-[#388E3C]" />
            </div>
          )
        ) : (
          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-xs font-medium text-muted-foreground">
              {item.order}
            </span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h4 className={cn(
            'text-sm font-medium',
            isCompleted && !hasIssue && 'text-[#388E3C]',
            hasIssue && 'text-[#F57C00]'
          )}>
            {item.item}
            {item.required && <span className="text-[#D32F2F] ml-0.5">*</span>}
          </h4>
          {item.description && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {item.description}
            </p>
          )}
        </div>

        {/* Help icon for items with description */}
        {item.description && !isCompleted && (
          <HelpCircle className="w-4 h-4 text-muted-foreground shrink-0" />
        )}
      </div>

      {/* Input */}
      {!isCompleted && (
        <div className="mt-3">
          {renderInput()}
        </div>
      )}

      {/* Completed state */}
      {isCompleted && (
        <div className="mt-2 text-xs text-muted-foreground">
          {hasIssue ? (
            <span className="text-[#F57C00]">
              Issue flagged: {item.response?.issue?.description}
            </span>
          ) : (
            <span>
              Completed by {item.response?.completedBy}
              {item.response?.value !== true && item.response?.value !== null && (
                <> &middot; {typeof item.response?.value === 'number'
                  ? `${item.response.value}${item.numericConfig?.unit ? ` ${item.numericConfig.unit}` : ''}`
                  : item.response?.value === 'Photo captured'
                    ? 'Photo attached'
                    : item.response?.value}
                </>
              )}
            </span>
          )}
        </div>
      )}
    </Card>
  )
}
