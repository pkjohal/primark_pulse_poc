import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import type { Message, MessageFilter, MessageType, MessageScope, MessagePriority } from '@/types'

const MSG_SELECT = '*, message_acknowledgments(user_id, acknowledged_at)'

function rowToMessage(row: Record<string, unknown>): Message {
  const acks = (row.message_acknowledgments as Array<{ user_id: string; acknowledged_at: string }>) ?? []
  return {
    id: row.id as string,
    type: row.type as MessageType,
    scope: row.scope as MessageScope,
    priority: row.priority as MessagePriority,
    title: row.title as string | undefined,
    body: row.body as string,
    targetZones: row.target_zones as string[] | undefined,
    targetRoles: row.target_roles as string[] | undefined,
    linkedJobId: row.linked_job_id as string | undefined,
    sender: {
      id: row.sender_id as string ?? 'system',
      name: 'Staff Member',
      role: 'Sales Assistant',
    },
    sentAt: row.sent_at as string,
    requiresAcknowledgment: row.requires_acknowledgment as boolean,
    acknowledgments: acks.map(a => ({ userId: a.user_id, userName: '', acknowledgedAt: a.acknowledged_at })),
    totalRecipients: row.total_recipients as number | undefined,
    hasPhoto: row.has_photo as boolean,
    photoUrl: row.photo_url as string | undefined,
  }
}

// ── Fetch Messages ─────────────────────────────────────────────────────────

interface UseMessagesOptions {
  filter?: MessageFilter
  zone?: string
}

export function useMessages(options: UseMessagesOptions = {}) {
  const storeId = useAuthStore(s => s.user?.store_id)

  return useQuery({
    queryKey: ['messages', storeId, options.filter, options.zone],
    queryFn: async (): Promise<Message[]> => {
      let query = supabase
        .from('messages')
        .select(MSG_SELECT)
        .eq('store_id', storeId!)
        .order('sent_at', { ascending: false })

      if (options.filter === 'announcements') {
        query = query.in('type', ['announcement']).or('priority.eq.critical')
      } else if (options.filter === 'my-zone' && options.zone) {
        query = query.or(`scope.eq.store,and(scope.eq.zone,target_zones.cs.{"${options.zone}"})`)
      }

      const { data, error } = await query
      if (error) throw error
      return (data ?? []).map(row => rowToMessage(row as Record<string, unknown>))
    },
    enabled: !!storeId,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  })
}

// ── Fetch Single Message ───────────────────────────────────────────────────

export function useMessage(id: string | null) {
  const storeId = useAuthStore(s => s.user?.store_id)

  return useQuery({
    queryKey: ['message', id],
    queryFn: async (): Promise<Message> => {
      const { data, error } = await supabase
        .from('messages')
        .select(MSG_SELECT)
        .eq('id', id!)
        .single()
      if (error) throw error
      return rowToMessage(data as Record<string, unknown>)
    },
    enabled: !!id && !!storeId,
  })
}

// ── Acknowledge Message ────────────────────────────────────────────────────

interface AcknowledgePayload {
  messageId: string
  userId: string
  userName: string
}

export function useAcknowledgeMessage() {
  const queryClient = useQueryClient()
  const storeId = useAuthStore(s => s.user?.store_id)

  return useMutation({
    mutationFn: async ({ messageId, userId }: AcknowledgePayload) => {
      const { error } = await supabase
        .from('message_acknowledgments')
        .insert({ id: `ack-${messageId}-${userId}`, message_id: messageId, user_id: userId })
      if (error && !error.message.includes('duplicate')) throw error
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', storeId] })
      queryClient.invalidateQueries({ queryKey: ['message', variables.messageId] })
    },
  })
}

// ── Send Message ───────────────────────────────────────────────────────────

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

export function useSendMessage() {
  const queryClient = useQueryClient()
  const storeId = useAuthStore(s => s.user?.store_id)
  const userId = useAuthStore(s => s.user?.id)

  return useMutation({
    mutationFn: async (payload: SendMessagePayload): Promise<Message> => {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          id: `msg-${Date.now()}`,
          store_id: storeId!,
          sender_id: userId,
          ...payload,
          target_zones: payload.targetZones,
          target_roles: payload.targetRoles,
          requires_acknowledgment: payload.requiresAcknowledgment,
          has_photo: false,
        })
        .select(MSG_SELECT)
        .single()
      if (error) throw error
      return rowToMessage(data as Record<string, unknown>)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', storeId] })
    },
  })
}

// ── Helpers ────────────────────────────────────────────────────────────────

export function hasUserAcknowledged(message: Message, userId: string): boolean {
  return message.acknowledgments.some(a => a.userId === userId)
}

export function getAcknowledgmentProgress(message: Message) {
  const acknowledged = message.acknowledgments.length
  const total = message.totalRecipients ?? 0
  const percentage = total > 0 ? Math.round((acknowledged / total) * 100) : 0
  return { acknowledged, total, percentage }
}

export function formatMessageTime(sentAt: string): string {
  const diffMs = Date.now() - new Date(sentAt).getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'Yesterday'
  return new Date(sentAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export function getPriorityInfo(priority: MessagePriority) {
  switch (priority) {
    case 'critical': return { label: 'URGENT', className: 'bg-[#D32F2F]/10 text-[#D32F2F] border-[#D32F2F]/30' }
    case 'normal':   return { label: 'Normal', className: 'bg-slate-100 text-slate-600 border-slate-200' }
    case 'low':      return { label: 'Low',    className: 'bg-slate-50 text-slate-500 border-slate-200' }
  }
}
