import { Check, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getAcknowledgmentProgress } from '@/hooks/useMessages'
import type { Message } from '@/types'

interface AcknowledgmentProgressProps {
  message: Message
  showDetails?: boolean
  className?: string
}

export function AcknowledgmentProgress({
  message,
  showDetails = false,
  className,
}: AcknowledgmentProgressProps) {
  const { acknowledged, total, percentage } = getAcknowledgmentProgress(message)
  const isComplete = percentage === 100

  return (
    <div className={cn('space-y-2', className)}>
      {/* Progress Bar */}
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            isComplete ? 'bg-[#388E3C]' : 'bg-primary'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>
            {acknowledged} of {total} confirmed
          </span>
        </div>
        <span
          className={cn(
            'font-medium',
            isComplete ? 'text-[#388E3C]' : 'text-foreground'
          )}
        >
          {percentage}%
        </span>
      </div>

      {/* Recent Acknowledgments */}
      {showDetails && message.acknowledgments.length > 0 && (
        <div className="mt-3 space-y-2">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            Recently confirmed
          </p>
          <div className="space-y-1.5">
            {message.acknowledgments.slice(0, 5).map((ack) => (
              <div
                key={ack.userId}
                className="flex items-center gap-2 text-sm"
              >
                <div className="w-6 h-6 rounded-full bg-[#388E3C]/10 flex items-center justify-center">
                  <Check className="w-3 h-3 text-[#388E3C]" />
                </div>
                <span className="text-foreground">{ack.userName}</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {formatAckTime(ack.acknowledgedAt)}
                </span>
              </div>
            ))}
            {message.acknowledgments.length > 5 && (
              <p className="text-xs text-muted-foreground pl-8">
                +{message.acknowledgments.length - 5} more
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function formatAckTime(timestamp: string): string {
  const now = new Date()
  const ack = new Date(timestamp)
  const diffMs = now.getTime() - ack.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  return ack.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}
