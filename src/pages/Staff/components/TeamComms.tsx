import { MessageSquare } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useTeamComms } from '@/hooks/useTeamComms'
import type { TeamMessage } from '@/types'

function MessageItem({ message }: { message: TeamMessage }) {
  return (
    <div
      className={cn(
        'p-3 rounded-lg border transition-colors',
        message.unread
          ? 'bg-primary/5 border-primary/20'
          : 'bg-background border-border'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-semibold text-primary">
            {message.from.charAt(0)}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-medium text-sm text-foreground truncate">
                {message.from}
              </span>
              {message.unread && (
                <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
              )}
            </div>
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {message.time}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{message.role}</p>
          <p className="text-sm text-foreground mt-1 line-clamp-2">
            {message.message}
          </p>
        </div>
      </div>
    </div>
  )
}

function MessageSkeleton() {
  return (
    <div className="p-3 rounded-lg border border-border">
      <div className="flex items-start gap-3">
        <Skeleton className="w-9 h-9 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </div>
  )
}

export function TeamComms() {
  const { data: messages, isLoading } = useTeamComms()

  const unreadCount = messages?.filter((m) => m.unread).length || 0

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" />
            <CardTitle className="text-base">Team Messages</CardTitle>
          </div>
          {unreadCount > 0 && (
            <Badge variant="default" className="text-xs">
              {unreadCount} new
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Scrollable container - max height for ~3 messages */}
        <div className="max-h-[200px] overflow-y-auto space-y-2 pr-1">
          {isLoading ? (
            <>
              <MessageSkeleton />
              <MessageSkeleton />
              <MessageSkeleton />
            </>
          ) : messages && messages.length > 0 ? (
            messages.map((message) => (
              <MessageItem key={message.id} message={message} />
            ))
          ) : (
            <div className="py-6 text-center">
              <MessageSquare className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No messages</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
