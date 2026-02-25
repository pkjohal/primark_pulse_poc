import { Loader2, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MessageCard } from './MessageCard'
import type { Message } from '@/types'

interface MessageFeedProps {
  messages: Message[]
  currentUserId: string
  isLoading?: boolean
  onMessageClick?: (message: Message) => void
  className?: string
}

export function MessageFeed({
  messages,
  currentUserId,
  isLoading,
  onMessageClick,
  className,
}: MessageFeedProps) {
  if (isLoading) {
    return (
      <div className={cn('flex items-center justify-center py-12', className)}>
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
          <MessageSquare className="w-8 h-8 text-slate-400" />
        </div>
        <p className="text-sm text-muted-foreground">No messages to display</p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-3', className)}>
      {messages.map((message, index) => (
        <div
          key={message.id}
          className="animate-fade-in-up"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <MessageCard
            message={message}
            currentUserId={currentUserId}
            onClick={() => onMessageClick?.(message)}
          />
        </div>
      ))}
    </div>
  )
}
