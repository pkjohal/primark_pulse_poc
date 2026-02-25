import { cn } from '@/lib/utils'

type StatusColor = 'green' | 'amber' | 'red' | 'ai'

interface StatusDotProps {
  status: StatusColor
  pulse?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const colorStyles: Record<StatusColor, string> = {
  green: 'bg-success',
  amber: 'bg-warning',
  red: 'bg-critical',
  ai: 'bg-ai',
}

const pulseColorStyles: Record<StatusColor, string> = {
  green: 'bg-success/50',
  amber: 'bg-warning/50',
  red: 'bg-critical/50',
  ai: 'bg-ai/50',
}

const sizeStyles = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
  lg: 'w-4 h-4',
}

export function StatusDot({
  status,
  pulse = false,
  size = 'md',
  className,
}: StatusDotProps) {
  return (
    <span className={cn('relative inline-flex', className)}>
      {pulse && (
        <span
          className={cn(
            'absolute inline-flex h-full w-full rounded-full animate-ping opacity-75',
            pulseColorStyles[status]
          )}
        />
      )}
      <span
        className={cn(
          'relative inline-flex rounded-full',
          colorStyles[status],
          sizeStyles[size]
        )}
      />
    </span>
  )
}
