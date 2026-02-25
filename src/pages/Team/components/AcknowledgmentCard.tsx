import { useState } from 'react'
import { AlertTriangle, Bell, Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AcknowledgmentProgress } from './AcknowledgmentProgress'
import {
  formatMessageTime,
  hasUserAcknowledged,
  useAcknowledgeMessage,
} from '@/hooks/useMessages'
import type { Message } from '@/types'

interface AcknowledgmentCardProps {
  message: Message
  currentUserId: string
  currentUserName: string
  onViewDetails?: () => void
  className?: string
}

export function AcknowledgmentCard({
  message,
  currentUserId,
  currentUserName,
  onViewDetails,
  className,
}: AcknowledgmentCardProps) {
  const [isConfirming, setIsConfirming] = useState(false)
  const acknowledgeMessage = useAcknowledgeMessage()
  const userAcknowledged = hasUserAcknowledged(message, currentUserId)

  const handleAcknowledge = async () => {
    if (userAcknowledged) return

    setIsConfirming(true)
    try {
      await acknowledgeMessage.mutateAsync({
        messageId: message.id,
        userId: currentUserId,
        userName: currentUserName,
      })
    } finally {
      setIsConfirming(false)
    }
  }

  const Icon = message.type === 'alert' ? AlertTriangle : Bell

  return (
    <Card
      className={cn(
        'p-4 border-[#D32F2F]/30',
        !userAcknowledged && 'bg-[#D32F2F]/5',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-[#D32F2F]/10 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-[#D32F2F]" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge
              variant="outline"
              className="text-[10px] uppercase tracking-wide bg-[#D32F2F]/10 text-[#D32F2F] border-[#D32F2F]/30"
            >
              URGENT
            </Badge>
            <span className="text-xs text-muted-foreground ml-auto">
              {formatMessageTime(message.sentAt)}
            </span>
          </div>

          {message.title && (
            <h3 className="text-sm font-semibold text-foreground mb-1">
              {message.title}
            </h3>
          )}

          <p className="text-sm text-muted-foreground">{message.body}</p>
        </div>
      </div>

      {/* Sender */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3 pl-[52px]">
        <span className="font-medium text-foreground">{message.sender.name}</span>
        <span>·</span>
        <span>{message.sender.role}</span>
      </div>

      {/* Acknowledgment Progress */}
      <div className="mb-4">
        <AcknowledgmentProgress message={message} />
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {userAcknowledged ? (
          <Button
            variant="outline"
            className="flex-1 text-[#388E3C] border-[#388E3C]/30 bg-[#388E3C]/10"
            disabled
          >
            <Check className="w-4 h-4 mr-2" />
            Confirmed
          </Button>
        ) : (
          <Button
            onClick={handleAcknowledge}
            disabled={isConfirming}
            className="flex-1 bg-[#D32F2F] hover:bg-[#B71C1C]"
          >
            {isConfirming ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Confirming...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Confirm Receipt
              </>
            )}
          </Button>
        )}

        {onViewDetails && (
          <Button variant="outline" onClick={onViewDetails}>
            Details
          </Button>
        )}
      </div>
    </Card>
  )
}
