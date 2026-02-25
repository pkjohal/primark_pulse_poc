import { MessageSquare, AlertTriangle, Bell, Users, MapPin, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  formatMessageTime,
  getPriorityInfo,
  getAcknowledgmentProgress,
  hasUserAcknowledged,
} from '@/hooks/useMessages'
import type { Message } from '@/types'

interface MessageCardProps {
  message: Message
  currentUserId: string
  onClick?: () => void
  className?: string
}

export function MessageCard({
  message,
  currentUserId,
  onClick,
  className,
}: MessageCardProps) {
  const priorityInfo = getPriorityInfo(message.priority)
  const acknowledgmentProgress = getAcknowledgmentProgress(message)
  const userAcknowledged = hasUserAcknowledged(message, currentUserId)

  // Get icon based on message type
  const getTypeIcon = () => {
    switch (message.type) {
      case 'announcement':
        return Bell
      case 'alert':
        return AlertTriangle
      case 'update':
        return MessageSquare
      case 'chat':
        return Users
      default:
        return MessageSquare
    }
  }

  const TypeIcon = getTypeIcon()

  return (
    <Card
      variant="interactive"
      className={cn(
        'p-4 transition-all active:scale-[0.99]',
        message.priority === 'critical' && !userAcknowledged && 'border-[#D32F2F]/30 bg-[#D32F2F]/5',
        className
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      {/* Header Row */}
      <div className="flex items-start gap-3 mb-2">
        {/* Avatar / Icon */}
        <div
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
            message.priority === 'critical'
              ? 'bg-[#D32F2F]/10'
              : message.type === 'announcement'
              ? 'bg-primary/10'
              : 'bg-slate-100'
          )}
        >
          {message.sender.avatar ? (
            <img
              src={message.sender.avatar}
              alt={message.sender.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <TypeIcon
              className={cn(
                'w-5 h-5',
                message.priority === 'critical'
                  ? 'text-[#D32F2F]'
                  : message.type === 'announcement'
                  ? 'text-primary'
                  : 'text-slate-600'
              )}
            />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Sender + Time */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-foreground truncate">
              {message.sender.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {message.sender.role}
            </span>
            <span className="text-xs text-muted-foreground ml-auto shrink-0">
              {formatMessageTime(message.sentAt)}
            </span>
          </div>

          {/* Title (if present) */}
          {message.title && (
            <h3 className="text-sm font-semibold text-foreground mb-1">
              {message.title}
            </h3>
          )}

          {/* Body */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {message.body}
          </p>
        </div>
      </div>

      {/* Footer Row - Badges and Acknowledgments */}
      <div className="flex items-center gap-2 mt-3">
        {/* Priority Badge */}
        {message.priority === 'critical' && (
          <Badge
            variant="outline"
            className={cn('text-[10px] uppercase tracking-wide', priorityInfo.className)}
          >
            {priorityInfo.label}
          </Badge>
        )}

        {/* Zone Badge */}
        {message.scope === 'zone' && message.targetZones && (
          <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200">
            <MapPin className="w-3 h-3 mr-1" />
            {message.targetZones[0]}
          </Badge>
        )}

        {/* Reply Count */}
        {message.replyCount && message.replyCount > 0 && (
          <span className="text-xs text-muted-foreground flex items-center gap-1 ml-auto">
            <MessageSquare className="w-3 h-3" />
            {message.replyCount} {message.replyCount === 1 ? 'reply' : 'replies'}
          </span>
        )}

        {/* Acknowledgment Progress */}
        {message.requiresAcknowledgment && (
          <div className="flex items-center gap-2 ml-auto">
            {userAcknowledged ? (
              <span className="text-xs text-[#388E3C] flex items-center gap-1">
                <Check className="w-3 h-3" />
                Confirmed
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">
                {acknowledgmentProgress.acknowledged}/{acknowledgmentProgress.total} confirmed
              </span>
            )}
          </div>
        )}
      </div>

      {/* Acknowledgment Progress Bar (for critical messages) */}
      {message.requiresAcknowledgment && message.priority === 'critical' && (
        <div className="mt-3">
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                acknowledgmentProgress.percentage === 100
                  ? 'bg-[#388E3C]'
                  : 'bg-primary'
              )}
              style={{ width: `${acknowledgmentProgress.percentage}%` }}
            />
          </div>
        </div>
      )}
    </Card>
  )
}
