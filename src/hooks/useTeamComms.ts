import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import type { TeamMessage } from '@/types'

export function useTeamComms() {
  const storeId = useAuthStore(s => s.user?.store_id)

  return useQuery({
    queryKey: ['teamComms', storeId],
    queryFn: async (): Promise<TeamMessage[]> => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('store_id', storeId!)
        .order('sent_at', { ascending: false })
        .limit(20)
      if (error) throw error
      return (data ?? []).map(row => ({
        id: row.id as string,
        from: 'Staff Member',
        role: 'Sales Assistant',
        message: (row.body ?? row.title ?? '') as string,
        time: formatTime(row.sent_at as string),
        unread: false,
      }))
    },
    enabled: !!storeId,
    staleTime: 30 * 1000,
  })
}

function formatTime(sentAt: string): string {
  const diffMs = Date.now() - new Date(sentAt).getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  if (diffMins < 60) return `${diffMins} min ago`
  if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`
  return new Date(sentAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}
