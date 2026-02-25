import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'

interface TextNotesInputProps {
  value?: string | null
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function TextNotesInput({
  value,
  onChange,
  placeholder = 'Enter notes...',
  disabled,
  className,
}: TextNotesInputProps) {
  return (
    <Textarea
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={cn(
        'min-h-[100px] resize-none',
        className
      )}
    />
  )
}
