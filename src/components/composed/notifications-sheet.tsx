import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ClipboardList,
  Calendar,
  Package,
  MessageSquare,
  AlertTriangle,
  Bell,
  Check,
  Trash2,
} from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import type { Notification, NotificationType } from '@/types'

// Mock notifications data
const initialNotifications: Notification[] = [
  {
    id: '1',
    type: 'task',
    title: 'New Job Assigned',
    message: 'Restock Menswear display - Zone A urgent',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    read: false,
    actionPath: '/jobs',
  },
  {
    id: '2',
    type: 'schedule',
    title: 'Shift Swap Accepted',
    message: 'James K. accepted your shift swap for Thursday',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    read: false,
    actionPath: '/schedule',
  },
  {
    id: '3',
    type: 'message',
    title: 'Sarah M.',
    message: 'Can you cover fitting rooms for 10 mins?',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    read: false,
    avatarInitials: 'SM',
    actionPath: '/staff',
  },
  {
    id: '4',
    type: 'stock',
    title: 'Low Stock Alert',
    message: 'Black Skinny Jeans (Size 10) - Only 2 remaining',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: true,
    actionPath: '/stock',
  },
  {
    id: '5',
    type: 'alert',
    title: 'Queue Alert',
    message: 'Fitting rooms queue exceeded threshold',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    read: true,
    actionPath: '/queues',
  },
  {
    id: '6',
    type: 'system',
    title: 'Break Reminder',
    message: 'Your break starts in 15 minutes',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
]

// Icon config per notification type
const typeConfig: Record<NotificationType, { icon: typeof Bell; color: string; bg: string }> = {
  task: { icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-100' },
  schedule: { icon: Calendar, color: 'text-primary', bg: 'bg-primary/10' },
  stock: { icon: Package, color: 'text-amber-600', bg: 'bg-amber-100' },
  message: { icon: MessageSquare, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  alert: { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' },
  system: { icon: Bell, color: 'text-slate-600', bg: 'bg-slate-100' },
}

// Format relative time
function formatRelativeTime(timestamp: string): string {
  const now = new Date()
  const date = new Date(timestamp)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'Yesterday'
  return `${diffDays}d ago`
}

// Swipeable notification item
interface SwipeableNotificationProps {
  notification: Notification
  onDismiss: (id: string) => void
  onClick: (notification: Notification) => void
}

function SwipeableNotification({ notification, onDismiss, onClick }: SwipeableNotificationProps) {
  const [offset, setOffset] = useState(0)
  const [isDismissing, setIsDismissing] = useState(false)
  const startX = useRef(0)
  const currentX = useRef(0)
  const isDragging = useRef(false)

  const config = typeConfig[notification.type]
  const Icon = config.icon

  const DISMISS_THRESHOLD = 100

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
    currentX.current = e.touches[0].clientX
    isDragging.current = true
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return
    currentX.current = e.touches[0].clientX
    const diff = currentX.current - startX.current
    // Only allow swiping left (negative)
    if (diff < 0) {
      setOffset(Math.max(diff, -150))
    }
  }

  const handleTouchEnd = () => {
    isDragging.current = false
    if (offset < -DISMISS_THRESHOLD) {
      // Dismiss
      setIsDismissing(true)
      setOffset(-400)
      setTimeout(() => {
        onDismiss(notification.id)
      }, 200)
    } else {
      // Snap back
      setOffset(0)
    }
  }

  const handleClick = () => {
    if (Math.abs(offset) < 10) {
      onClick(notification)
    }
  }

  return (
    <div className="relative overflow-hidden">
      {/* Notification content */}
      <div
        className={cn(
          'relative bg-background transition-transform',
          isDragging.current ? '' : 'duration-200',
          isDismissing && 'opacity-0',
          !notification.read && 'bg-primary/5'
        )}
        style={{ transform: `translateX(${offset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
      >
        <div className="p-4 flex gap-3">
          {/* Icon or Avatar */}
          {notification.avatarInitials ? (
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
              <span className="text-white text-sm font-bold">
                {notification.avatarInitials}
              </span>
            </div>
          ) : (
            <div className={cn('w-10 h-10 rounded-full flex items-center justify-center shrink-0', config.bg)}>
              <Icon className={cn('w-5 h-5', config.color)} />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className={cn(
                'text-sm font-medium text-foreground',
                !notification.read && 'font-semibold'
              )}>
                {notification.title}
              </p>
              <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                {formatRelativeTime(notification.timestamp)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
              {notification.message}
            </p>
          </div>

          {/* Unread indicator */}
          {!notification.read && (
            <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
          )}
        </div>
      </div>
    </div>
  )
}

interface NotificationsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NotificationsSheet({ open, onOpenChange }: NotificationsSheetProps) {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState(initialNotifications)

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleNotificationClick = (notification: Notification) => {
    if (notification.actionPath) {
      navigate(notification.actionPath)
      onOpenChange(false)
    }
  }

  const handleDismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const handleClearAll = () => {
    setNotifications([])
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:w-96 p-0"
        closeClassName="text-white hover:text-white/80"
        onSwipeClose={() => onOpenChange(false)}
      >
        {/* Header */}
        <SheetHeader className="bg-primary text-white p-4 border-b-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-white text-lg font-bold">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-sm font-medium">
                  {unreadCount}
                </span>
              )}
            </SheetTitle>
          </div>
        </SheetHeader>

        {/* Action buttons */}
        <div className="flex items-center justify-between px-4 py-2 border-b bg-slate-50">
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            Mark all read
          </button>
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear all
          </button>
        </div>

        {/* Notifications list */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-12">
              <Bell className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <SwipeableNotification
                  key={notification.id}
                  notification={notification}
                  onDismiss={handleDismiss}
                  onClick={handleNotificationClick}
                />
              ))}
            </div>
          )}
        </div>

        {/* Swipe hint */}
        {notifications.length > 0 && (
          <div className="px-4 py-2 text-center border-t bg-slate-50">
            <p className="text-[11px] text-muted-foreground">Swipe left to dismiss</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
