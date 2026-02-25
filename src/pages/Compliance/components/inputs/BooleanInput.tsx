import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BooleanInputProps {
  value?: boolean | null
  onChange: (value: boolean) => void
  disabled?: boolean
  className?: string
}

export function BooleanInput({ value, onChange, disabled, className }: BooleanInputProps) {
  return (
    <div className={cn('flex gap-3', className)}>
      <button
        type="button"
        onClick={() => onChange(true)}
        disabled={disabled}
        className={cn(
          'flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 transition-all',
          'text-sm font-medium',
          'active:scale-[0.98]',
          value === true
            ? 'bg-[#388E3C]/10 border-[#388E3C] text-[#388E3C]'
            : 'bg-white border-slate-200 text-foreground hover:border-slate-300',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <Check className="w-4 h-4" />
        Yes
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        disabled={disabled}
        className={cn(
          'flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 transition-all',
          'text-sm font-medium',
          'active:scale-[0.98]',
          value === false
            ? 'bg-[#D32F2F]/10 border-[#D32F2F] text-[#D32F2F]'
            : 'bg-white border-slate-200 text-foreground hover:border-slate-300',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <X className="w-4 h-4" />
        No
      </button>
    </div>
  )
}
