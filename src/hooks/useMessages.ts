import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Message, MessageFilter, MessageType, MessageScope, MessagePriority } from '@/types'

// ============================================
// Fetch Messages
// ============================================
interface UseMessagesOptions {
  filter?: MessageFilter
  zone?: string
}

async function fetchMessages(options: UseMessagesOptions = {}): Promise<Message[]> {
  const params = new URLSearchParams()
  if (options.filter) params.set('filter', options.filter)
  if (options.zone) params.set('zone', options.zone)

  const response = await fetch(`/api/messages?${params}`)
  if (!response.ok) throw new Error('Failed to fetch messages')
  return response.json()
}

export function useMessages(options: UseMessagesOptions = {}) {
  return useQuery({
    queryKey: ['messages', options.filter, options.zone],
    queryFn: () => fetchMessages(options),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute for real-time feel
  })
}

// ============================================
// Fetch Single Message
// ============================================
async function fetchMessage(id: string): Promise<Message> {
  const response = await fetch(`/api/messages/${id}`)
  if (!response.ok) throw new Error('Message not found')
  return response.json()
}

export function useMessage(id: string | null) {
  return useQuery({
    queryKey: ['message', id],
    queryFn: () => fetchMessage(id!),
    enabled: !!id,
  })
}

// ============================================
// Acknowledge Message
// ============================================
interface AcknowledgePayload {
  messageId: string
  userId: string
  userName: string
}

interface AcknowledgeResponse {
  success: boolean
  acknowledgment: {
    userId: string
    userName: string
    acknowledgedAt: string
  }
  totalAcknowledgments: number
  totalRecipients: number
}

async function acknowledgeMessage(payload: AcknowledgePayload): Promise<AcknowledgeResponse> {
  const response = await fetch(`/api/messages/${payload.messageId}/acknowledge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: payload.userId,
      userName: payload.userName,
    }),
  })

  if (!response.ok) throw new Error('Failed to acknowledge message')
  return response.json()
}

export function useAcknowledgeMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: acknowledgeMessage,
    onSuccess: (_, variables) => {
      // Invalidate messages queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ['messages'] })
      // Invalidate specific message query
      queryClient.invalidateQueries({ queryKey: ['message', variables.messageId] })
    },
  })
}

// ============================================
// Send Message
// ============================================
interface SendMessagePayload {
  type: MessageType
  scope: MessageScope
  priority: MessagePriority
  title?: string
  body: string
  targetZones?: string[]
  targetRoles?: string[]
  requiresAcknowledgment: boolean
}

async function sendMessage(payload: SendMessagePayload): Promise<Message> {
  const response = await fetch('/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) throw new Error('Failed to send message')
  return response.json()
}

export function useSendMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      // Invalidate messages queries to show new message
      queryClient.invalidateQueries({ queryKey: ['messages'] })
    },
  })
}

// ============================================
// Helper: Check if user has acknowledged
// ============================================
export function hasUserAcknowledged(message: Message, userId: string): boolean {
  return message.acknowledgments.some((ack) => ack.userId === userId)
}

// ============================================
// Helper: Get acknowledgment progress
// ============================================
export function getAcknowledgmentProgress(message: Message): {
  acknowledged: number
  total: number
  percentage: number
} {
  const acknowledged = message.acknowledgments.length
  const total = message.totalRecipients || 0
  const percentage = total > 0 ? Math.round((acknowledged / total) * 100) : 0

  return { acknowledged, total, percentage }
}

// ============================================
// Helper: Format message time
// ============================================
export function formatMessageTime(sentAt: string): string {
  const now = new Date()
  const sent = new Date(sentAt)
  const diffMs = now.getTime() - sent.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'Yesterday'
  return sent.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

// ============================================
// Helper: Get priority badge info
// ============================================
export function getPriorityInfo(priority: MessagePriority): {
  label: string
  className: string
} {
  switch (priority) {
    case 'critical':
      return {
        label: 'URGENT',
        className: 'bg-[#D32F2F]/10 text-[#D32F2F] border-[#D32F2F]/30',
      }
    case 'normal':
      return {
        label: 'Normal',
        className: 'bg-slate-100 text-slate-600 border-slate-200',
      }
    case 'low':
      return {
        label: 'Low',
        className: 'bg-slate-50 text-slate-500 border-slate-200',
      }
  }
}
