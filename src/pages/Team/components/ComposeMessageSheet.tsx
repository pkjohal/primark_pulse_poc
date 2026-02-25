import { useState } from 'react'
import { Send, Loader2, Bell, AlertTriangle, MessageSquare, MapPin, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useSendMessage } from '@/hooks/useMessages'
import type { MessageType, MessageScope, MessagePriority } from '@/types'

interface ComposeMessageSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

const messageTypes: { value: MessageType; label: string; icon: typeof Bell }[] = [
  { value: 'announcement', label: 'Announcement', icon: Bell },
  { value: 'alert', label: 'Alert', icon: AlertTriangle },
  { value: 'update', label: 'Update', icon: MessageSquare },
]

const scopeOptions: { value: MessageScope; label: string; icon: typeof Users }[] = [
  { value: 'store', label: 'All Store', icon: Users },
  { value: 'zone', label: 'Specific Zones', icon: MapPin },
]

const priorityOptions: { value: MessagePriority; label: string; color: string }[] = [
  { value: 'critical', label: 'Urgent', color: 'text-[#D32F2F] bg-[#D32F2F]/10 border-[#D32F2F]/30' },
  { value: 'normal', label: 'Normal', color: 'text-foreground bg-white border-slate-200' },
  { value: 'low', label: 'Low', color: 'text-muted-foreground bg-slate-50 border-slate-200' },
]

const zoneOptions = ['Womenswear', 'Menswear', 'Fitting Rooms', 'Tills', 'Stockroom', 'Entrance']

export function ComposeMessageSheet({
  open,
  onOpenChange,
  onSuccess,
}: ComposeMessageSheetProps) {
  const [messageType, setMessageType] = useState<MessageType>('announcement')
  const [scope, setScope] = useState<MessageScope>('store')
  const [priority, setPriority] = useState<MessagePriority>('normal')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [selectedZones, setSelectedZones] = useState<string[]>([])
  const [requiresAck, setRequiresAck] = useState(false)

  const sendMessage = useSendMessage()

  const handleSubmit = async () => {
    if (!body.trim()) return

    await sendMessage.mutateAsync({
      type: messageType,
      scope,
      priority,
      title: title.trim() || undefined,
      body: body.trim(),
      targetZones: scope === 'zone' ? selectedZones : undefined,
      requiresAcknowledgment: requiresAck,
    })

    // Reset form
    resetForm()
    onOpenChange(false)
    onSuccess?.()
  }

  const resetForm = () => {
    setMessageType('announcement')
    setScope('store')
    setPriority('normal')
    setTitle('')
    setBody('')
    setSelectedZones([])
    setRequiresAck(false)
  }

  const handleClose = () => {
    resetForm()
    onOpenChange(false)
  }

  const toggleZone = (zone: string) => {
    setSelectedZones((prev) =>
      prev.includes(zone) ? prev.filter((z) => z !== zone) : [...prev, zone]
    )
  }

  const isValid =
    body.trim().length > 0 && (scope !== 'zone' || selectedZones.length > 0)

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent
        side="bottom"
        className="h-[90vh] rounded-t-2xl flex flex-col p-0"
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border shrink-0">
          <SheetHeader className="text-left">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Send className="w-4 h-4 text-primary" />
              </div>
              <SheetTitle>New Message</SheetTitle>
            </div>
            <SheetDescription>
              Send a message to your team.
            </SheetDescription>
          </SheetHeader>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Message Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Type</label>
            <div className="flex gap-2">
              {messageTypes.map((type) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setMessageType(type.value)}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border-2 text-sm font-medium transition-all',
                      'active:scale-[0.98]',
                      messageType === type.value
                        ? 'bg-primary/10 border-primary text-primary'
                        : 'bg-white border-slate-200 text-foreground hover:border-slate-300'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {type.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Scope */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Send to</label>
            <div className="flex gap-2">
              {scopeOptions.map((option) => {
                const Icon = option.icon
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setScope(option.value)}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border-2 text-sm font-medium transition-all',
                      'active:scale-[0.98]',
                      scope === option.value
                        ? 'bg-primary/10 border-primary text-primary'
                        : 'bg-white border-slate-200 text-foreground hover:border-slate-300'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {option.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Zone Selection (if scope is zone) */}
          {scope === 'zone' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Select zones <span className="text-[#D32F2F]">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {zoneOptions.map((zone) => (
                  <button
                    key={zone}
                    type="button"
                    onClick={() => toggleZone(zone)}
                    className={cn(
                      'px-3 py-2 text-sm rounded-lg border transition-all',
                      'active:scale-[0.98]',
                      selectedZones.includes(zone)
                        ? 'bg-primary/10 text-primary border-primary/30 font-medium'
                        : 'bg-white border-slate-200 text-foreground hover:border-slate-300'
                    )}
                  >
                    {zone}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Priority */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Priority</label>
            <div className="flex gap-2">
              {priorityOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPriority(option.value)}
                  className={cn(
                    'flex-1 py-2.5 px-4 rounded-lg border-2 text-sm font-medium transition-all',
                    'active:scale-[0.98]',
                    priority === option.value
                      ? option.color
                      : 'bg-white border-slate-200 text-foreground hover:border-slate-300'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Title <span className="text-muted-foreground">(optional)</span>
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief subject line..."
              className="h-11"
            />
          </div>

          {/* Body */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Message <span className="text-[#D32F2F]">*</span>
            </label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your message here..."
              className="min-h-[120px] resize-none"
            />
          </div>

          {/* Require Acknowledgment */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setRequiresAck(!requiresAck)}
              className={cn(
                'w-6 h-6 rounded border-2 flex items-center justify-center transition-all',
                requiresAck
                  ? 'bg-primary border-primary text-white'
                  : 'border-slate-300 hover:border-slate-400'
              )}
            >
              {requiresAck && (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
            <label className="text-sm text-foreground">
              Require staff to confirm receipt
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border shrink-0 bg-background">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={sendMessage.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isValid || sendMessage.isPending}
              className="flex-1"
            >
              {sendMessage.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
