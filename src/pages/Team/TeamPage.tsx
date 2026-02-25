import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MessageFilters } from './components/MessageFilters'
import { MessageFeed } from './components/MessageFeed'
import { AcknowledgmentCard } from './components/AcknowledgmentCard'
import { MessageDetailSheet } from './components/MessageDetailSheet'
import { ComposeMessageSheet } from './components/ComposeMessageSheet'
import { useMessages, hasUserAcknowledged } from '@/hooks/useMessages'
import { useAuthStore } from '@/stores/authStore'
import type { Message, MessageFilter } from '@/types'

export default function TeamPage() {
  const [activeFilter, setActiveFilter] = useState<MessageFilter>('all')
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [composeOpen, setComposeOpen] = useState(false)

  const { user } = useAuthStore()
  const currentUserId = 'current-user'
  const currentUserName = user?.name || 'Floor Lead'
  const userZone = 'Womenswear'

  const { data: messages = [], isLoading } = useMessages({
    filter: activeFilter,
    zone: userZone,
  })

  // Separate urgent unacknowledged messages
  const urgentMessages = messages.filter(
    (m) =>
      m.priority === 'critical' &&
      m.requiresAcknowledgment &&
      !hasUserAcknowledged(m, currentUserId)
  )
  const regularMessages = messages.filter(
    (m) =>
      !(
        m.priority === 'critical' &&
        m.requiresAcknowledgment &&
        !hasUserAcknowledged(m, currentUserId)
      )
  )

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message)
    setDetailOpen(true)
  }

  const isManager = user?.role === 'manager' || user?.role === 'floor-lead'

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between animate-fade-in-up">
          <h1 className="text-xl font-semibold text-foreground">Team</h1>
          {isManager && (
            <Button
              size="sm"
              onClick={() => setComposeOpen(true)}
              className="h-9"
            >
              <Plus className="w-4 h-4 mr-1" />
              New
            </Button>
          )}
        </div>

        {/* Filters */}
        <MessageFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          className="animate-fade-in-up animation-delay-100"
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
        {/* Urgent Messages - Action Required */}
        {urgentMessages.length > 0 && (
          <div className="space-y-3 animate-fade-in-up animation-delay-200">
            <h2 className="text-sm font-medium text-[#D32F2F] uppercase tracking-wide">
              Action Required
            </h2>
            {urgentMessages.map((message) => (
              <AcknowledgmentCard
                key={message.id}
                message={message}
                currentUserId={currentUserId}
                currentUserName={currentUserName}
                onViewDetails={() => handleMessageClick(message)}
              />
            ))}
          </div>
        )}

        {/* Regular Messages */}
        <div className="animate-fade-in-up animation-delay-300">
          {urgentMessages.length > 0 && regularMessages.length > 0 && (
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
              All Messages
            </h2>
          )}
          <MessageFeed
            messages={regularMessages}
            currentUserId={currentUserId}
            isLoading={isLoading}
            onMessageClick={handleMessageClick}
          />
        </div>
      </div>

      {/* Message Detail Sheet */}
      <MessageDetailSheet
        message={selectedMessage}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        currentUserId={currentUserId}
        currentUserName={currentUserName}
      />

      {/* Compose Message Sheet */}
      <ComposeMessageSheet
        open={composeOpen}
        onOpenChange={setComposeOpen}
      />
    </div>
  )
}
