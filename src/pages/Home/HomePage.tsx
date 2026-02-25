import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Briefcase, Package, ClipboardCheck, ChevronRight } from 'lucide-react'
import { useStoreMetrics } from '@/hooks/useStoreMetrics'
import { useAlerts, useDismissAlert } from '@/hooks/useAlerts'
import { useAISuggestion, useDismissAISuggestion } from '@/hooks/useAISuggestion'
import { useCurrentShift } from '@/hooks/useCurrentShift'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SkeletonMetricCard, SkeletonCard } from '@/components/ui/skeleton'
import { MetricCard } from '@/components/composed/metric-card'
import { AlertFeed } from '@/components/composed/alert-feed'
import { AIBanner } from '@/components/composed/ai-banner'
import { GreetingHeader } from '@/components/composed/greeting-header'
import { QuickActions } from '@/components/composed/quick-actions'
import { ShiftInfoCard } from '@/components/composed/shift-info-card'
import { QueueSummaryCard } from '@/components/composed/queue-summary-card'

export default function HomePage() {
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  const { data: metrics, isLoading: metricsLoading } = useStoreMetrics()
  const { data: alerts, isLoading: alertsLoading } = useAlerts()
  const { data: aiSuggestion, isLoading: suggestionLoading } = useAISuggestion()
  const { data: shift, isLoading: shiftLoading } = useCurrentShift()
  const dismissAlert = useDismissAlert()
  const dismissSuggestion = useDismissAISuggestion()

  return (
    <div className="p-4 pb-32 space-y-4">
      {/* Greeting Header */}
      <GreetingHeader />

      {/* AI Suggestion Banner */}
      {suggestionLoading ? (
        <SkeletonCard />
      ) : aiSuggestion ? (
        <AIBanner
          suggestion={aiSuggestion}
          onDismiss={() => dismissSuggestion.mutate(aiSuggestion.id)}
        />
      ) : null}

      {/* Quick Actions */}
      <QuickActions />

      {/* Quick Action Metrics */}
      <div className="grid grid-cols-2 gap-3">
        {metricsLoading ? (
          <>
            <SkeletonMetricCard />
            <SkeletonMetricCard />
            <SkeletonMetricCard />
            <SkeletonMetricCard />
          </>
        ) : metrics ? (
          <>
            <MetricCard
              title="Staff on Floor"
              value={`${metrics.staffActive} of ${metrics.staffTotal}`}
              subtitle="Active now"
              icon={Users}
              showProgress
              progressValue={Math.round((metrics.staffActive / metrics.staffTotal) * 100)}
              onClick={() => navigate('/staff')}
              className="animate-fade-in-up animation-delay-200"
            />
            <MetricCard
              title="Open Jobs"
              value={`${metrics.openTasks} jobs`}
              icon={Briefcase}
              subtitle={metrics.criticalTasks > 0 ? `${metrics.criticalTasks} critical` : 'All on track'}
              onClick={() => navigate('/jobs')}
              className="animate-fade-in-up animation-delay-250"
            />
            <MetricCard
              title="Stock Alerts"
              value="3 items"
              icon={Package}
              subtitle="Low stock"
              onClick={() => navigate('/stock')}
              className="animate-fade-in-up animation-delay-300"
            />
            <MetricCard
              title="Compliance"
              value={`${metrics.complianceProgress}%`}
              subtitle="Checklist done"
              icon={ClipboardCheck}
              showProgress
              progressValue={metrics.complianceProgress}
              onClick={() => navigate('/compliance')}
              className="animate-fade-in-up animation-delay-350"
            />
          </>
        ) : null}
      </div>

      {/* Queue Summary */}
      <QueueSummaryCard className="animate-fade-in-up animation-delay-375" />

      {/* Alerts Section */}
      <Card className="animate-fade-in-up animation-delay-400">
        <CardHeader className="flex-row items-center justify-between pb-2">
          <CardTitle className="text-base">Recent Alerts</CardTitle>
          <Button variant="ghost" size="sm" className="text-primary">
            View all
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </CardHeader>
        <CardContent>
          <AlertFeed
            alerts={alerts || []}
            isLoading={alertsLoading}
            onDismiss={(id) => dismissAlert.mutate(id)}
            maxItems={4}
          />
        </CardContent>
      </Card>

      {/* Shift Info Card - Fixed at bottom */}
      <ShiftInfoCard
        shiftStart={shift?.shiftStart || '08:00'}
        shiftEnd={shift?.shiftEnd || '16:30'}
        breakTime={shift?.breakTime}
        isLoading={shiftLoading}
        isScrolled={isScrolled}
      />
    </div>
  )
}
