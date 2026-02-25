import { AlertTriangle, Bell, MessageSquare, Users, MapPin, Check, Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AcknowledgmentProgress } from './AcknowledgmentProgress'
import {
  formatMessageTime,
  getPriorityInfo,
  hasUserAcknowledged,
  useAcknowledgeMessage,
} from '@/hooks/useMessages'
import type { Message } from '@/types'

interface MessageDetailSheetProps {
  message: Message | null
  open: boolean
  onOpenChange: (open: boolean) => void
  currentUserId: string
  currentUserName: string
}

export function MessageDetailSheet({
  message,
  open,
  onOpenChange,
  currentUserId,
  currentUserName,
}: MessageDetailSheetProps) {
  const acknowledgeMessage = useAcknowledgeMessage()
  const userAcknowledged = message ? hasUserAcknowledged(message, currentUserId) : false

  if (!message) return null

  const priorityInfo = getPriorityInfo(message.priority)

  const handleAcknowledge = async () => {
    if (userAcknowledged || !message.requiresAcknowledgment) return

    await acknowledgeMessage.mutateAsync({
      messageId: message.id,
      userId: currentUserId,
      userName: currentUserName,
    })
  }

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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[85vh] rounded-t-2xl flex flex-col p-0"
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border shrink-0">
          <SheetHeader className="text-left">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
                  message.priority === 'critical'
                    ? 'bg-[#D32F2F]/10'
                    : 'bg-primary/10'
                )}
              >
                <TypeIcon
                  className={cn(
                    'w-5 h-5',
                    message.priority === 'critical' ? 'text-[#D32F2F]' : 'text-primary'
                  )}
                />
              </div>
              <div className="flex-1">
                <SheetTitle className="text-lg">
                  {message.title || 'Message'}
                </SheetTitle>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-foreground">{message.sender.name}</span>
                  <span className="text-xs text-muted-foreground">
                    · {message.sender.role}
                  </span>
                </div>
              </div>
            </div>
          </SheetHeader>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {message.priority === 'critical' && (
              <Badge
                variant="outline"
                className={cn('text-xs uppercase tracking-wide', priorityInfo.className)}
              >
                {priorityInfo.label}
              </Badge>
            )}

            {message.scope === 'zone' && message.targetZones && (
              <Badge
                variant="outline"
                className="text-xs bg-blue-50 text-blue-700 border-blue-200"
              >
                <MapPin className="w-3 h-3 mr-1" />
                {message.targetZones.join(', ')}
              </Badge>
            )}

            {message.scope === 'store' && (
              <Badge variant="outline" className="text-xs">
                Store-wide
              </Badge>
            )}

            <span className="text-xs text-muted-foreground ml-auto">
              {formatMessageTime(message.sentAt)}
            </span>
          </div>

          {/* Message Body */}
          <div className="prose prose-sm max-w-none mb-6">
            <p className="text-foreground whitespace-pre-wrap">{message.body}</p>
          </div>

          {/* Photo (if present) */}
          {message.hasPhoto && message.photoUrl && (
            <div className="mb-6">
              <div className="rounded-lg overflow-hidden border border-border">
                <img
                  src={message.photoUrl}
                  alt="Attached photo"
                  className="w-full h-48 object-cover bg-slate-100"
                />
              </div>
            </div>
          )}

          {/* Acknowledgment Section */}
          {message.requiresAcknowledgment && (
            <div className="mb-6 p-4 bg-slate-50 rounded-xl">
              <h3 className="text-sm font-medium text-foreground mb-3">
                Acknowledgments
              </h3>
              <AcknowledgmentProgress message={message} showDetails />
            </div>
          )}

          {/* All Acknowledgments List */}
          {message.requiresAcknowledgment && message.acknowledgments.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-foreground mb-3">
                Who has confirmed ({message.acknowledgments.length})
              </h3>
              <div className="space-y-2">
                {message.acknowledgments.map((ack) => (
                  <div
                    key={ack.userId}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg border border-border"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#388E3C]/10 flex items-center justify-center">
                      <Check className="w-4 h-4 text-[#388E3C]" />
                    </div>
                    <span className="text-sm font-medium text-foreground flex-1">
                      {ack.userName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(ack.acknowledgedAt).toLocaleTimeString('en-GB', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pending - show how many haven't confirmed */}
              {message.totalRecipients &&
                message.totalRecipients > message.acknowledgments.length && (
                  <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <X className="w-4 h-4 text-slate-400" />
                      <span>
                        {message.totalRecipients - message.acknowledgments.length} staff
                        member{message.totalRecipients - message.acknowledgments.length !== 1 && 's'}{' '}
                        haven't confirmed yet
                      </span>
                    </div>
                  </div>
                )}
            </div>
          )}
        </div>

        {/* Footer */}
        {message.requiresAcknowledgment && (
          <div className="px-6 py-4 border-t border-border shrink-0 bg-background">
            {userAcknowledged ? (
              <Button
                variant="outline"
                className="w-full text-[#388E3C] border-[#388E3C]/30 bg-[#388E3C]/10"
                disabled
              >
                <Check className="w-4 h-4 mr-2" />
                You've confirmed this message
              </Button>
            ) : (
              <Button
                onClick={handleAcknowledge}
                disabled={acknowledgeMessage.isPending}
                className="w-full bg-[#D32F2F] hover:bg-[#B71C1C]"
              >
                {acknowledgeMessage.isPending ? (
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
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
