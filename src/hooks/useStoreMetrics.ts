import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import type { StoreMetrics } from '@/types'

export function useStoreMetrics() {
  const storeId = useAuthStore(s => s.user?.store_id)

  return useQuery({
    queryKey: ['storeMetrics', storeId],
    queryFn: async (): Promise<StoreMetrics> => {
      const [staffResult, jobsResult, checklistsResult, stockResult] = await Promise.all([
        // Staff on floor
        supabase
          .from('staff_members')
          .select('id, status')
          .eq('store_id', storeId!),

        // Open jobs (anything not completed)
        supabase
          .from('jobs')
          .select('id, priority')
          .eq('store_id', storeId!)
          .neq('status', 'complete'),

        // Checklists for compliance score
        supabase
          .from('checklists')
          .select('id, status')
          .eq('store_id', storeId!),

        // Open stock issues
        supabase
          .from('stock_issues')
          .select('id', { count: 'exact', head: true })
          .eq('store_id', storeId!)
          .eq('status', 'open'),
      ])

      if (staffResult.error) throw staffResult.error
      if (jobsResult.error) throw jobsResult.error
      if (checklistsResult.error) throw checklistsResult.error
      if (stockResult.error) throw stockResult.error

      // Staff
      const staffTotal = staffResult.data?.length ?? 0
      const staffActive = staffResult.data?.filter(s => s.status === 'active').length ?? 0

      // Jobs
      const openTasks = jobsResult.data?.length ?? 0
      const criticalTasks = jobsResult.data?.filter(j => j.priority === 'CRITICAL').length ?? 0

      // Compliance: completed=100%, in-progress=50%, not-started=0% — averaged
      const checklists = checklistsResult.data ?? []
      const complianceProgress = checklists.length > 0
        ? Math.round(
            checklists.reduce((sum, c) => {
              if (c.status === 'completed')   return sum + 100
              if (c.status === 'in-progress') return sum + 50
              return sum
            }, 0) / checklists.length
          )
        : 0

      // Stock alerts
      const stockAlerts = stockResult.count ?? 0

      // Overall store status
      const storeStatus: StoreMetrics['storeStatus'] =
        criticalTasks > 0 || complianceProgress < 50
          ? 'red'
          : openTasks > 8 || complianceProgress < 80 || stockAlerts > 0
          ? 'amber'
          : 'green'

      return {
        storeStatus,
        staffActive,
        staffTotal,
        tillsOpen: 0,
        tillsTotal: 0,
        openTasks,
        criticalTasks,
        complianceProgress,
        stockAlerts,
      }
    },
    enabled: !!storeId,
    refetchInterval: 30000,
  })
}
