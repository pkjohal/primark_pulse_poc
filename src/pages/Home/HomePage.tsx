import { useNavigate } from 'react-router-dom'
import { Users, Briefcase, Package, ClipboardCheck, X, Clock, Calendar } from 'lucide-react'
import { useStoreMetrics } from '@/hooks/useStoreMetrics'
import { useAISuggestion, useDismissAISuggestion } from '@/hooks/useAISuggestion'
import { useCurrentShift, useNextShift } from '@/hooks/useCurrentShift'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { SkeletonCard } from '@/components/ui/skeleton'
import { MetricCard } from '@/components/composed/metric-card'
import { QuickActions } from '@/components/composed/quick-actions'
import { QueueSummaryCard } from '@/components/composed/queue-summary-card'
import { cn } from '@/lib/utils'

// ── Mini right-side graphics ─────────────────────────────────────────────────

function MiniRing({ value, className }: { value: number; className?: string }) {
  const r = 14
  const c = 2 * Math.PI * r
  const fill = Math.min(1, value / 100) * c
  return (
    <svg width="100%" height="100%" viewBox="0 0 36 36" fill="none" className={className}>
      <circle cx="18" cy="18" r={r} strokeWidth="3" stroke="currentColor" className="text-muted" />
      <circle
        cx="18" cy="18" r={r} strokeWidth="3" stroke="currentColor"
        strokeDasharray={`${fill} ${c}`} strokeLinecap="round"
        transform="rotate(-90 18 18)"
      />
    </svg>
  )
}

function MiniBars({ heights, className }: { heights: number[]; className?: string }) {
  const max = Math.max(...heights)
  return (
    <svg width="100%" height="100%" viewBox="0 0 22 36" fill="none" className={className}>
      {heights.map((h, i) => {
        const barH = max > 0 ? Math.round((h / max) * 30) + 2 : 2
        return (
          <rect
            key={i}
            x={i * 8} y={34 - barH} width="6" height={barH}
            rx="1.5" fill="currentColor"
          />
        )
      })}
    </svg>
  )
}

// ── Staff shift banner ────────────────────────────────────────────────────────

function StaffShiftBanner() {
  const { data: current, isLoading: currentLoading } = useCurrentShift()
  const { data: next, isLoading: nextLoading } = useNextShift()

  if (currentLoading || nextLoading) return null

  const isWorkingToday = current?.shiftStart && current.shiftStart !== '--:--'

  if (isWorkingToday && current) {
    return (
      <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl px-3 py-3 animate-slide-in-top">
        <div className="p-2 rounded-lg bg-primary/10 shrink-0">
          <Clock className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-primary">Today's Shift</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {current.shiftStart}–{current.shiftEnd} · {current.zone}
            {current.breakTime && current.breakTime !== '--:--' && ` · Break at ${current.breakTime}`}
          </p>
        </div>
      </div>
    )
  }

  if (next) {
    const date = new Date(next.date)
    const formatted = date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
    return (
      <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl px-3 py-3 animate-slide-in-top">
        <div className="p-2 rounded-lg bg-primary/10 shrink-0">
          <Calendar className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-primary">Next Shift</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {formatted} · {next.shiftStart}–{next.shiftEnd} · {next.zone}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl px-3 py-3 animate-slide-in-top">
      <div className="p-2 rounded-lg bg-primary/10 shrink-0">
        <Calendar className="w-4 h-4 text-primary" />
      </div>
      <p className="text-sm font-bold text-primary">No upcoming shifts scheduled</p>
    </div>
  )
}

// ── Store status badge ───────────────────────────────────────────────────────

const statusConfig = {
  green: { label: 'All good',   dot: 'bg-success',  text: 'text-success'  },
  amber: { label: 'Needs attention', dot: 'bg-warning', text: 'text-warning'  },
  red:   { label: 'Action required', dot: 'bg-critical', text: 'text-critical' },
}

// ── Greeting ─────────────────────────────────────────────────────────────────

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

// ── HomePage ─────────────────────────────────────────────────────────────────

export default function HomePage() {
  const navigate = useNavigate()
  const user = useAuthStore(s => s.user)

  const { data: metrics, isLoading: metricsLoading } = useStoreMetrics()
  const { data: aiSuggestion, isLoading: suggestionLoading } = useAISuggestion()
  const dismissSuggestion = useDismissAISuggestion()

  const storeStatus = metrics?.storeStatus ?? 'green'
  const statusCfg = statusConfig[storeStatus]

  return (
    <>
    <div className="p-4 pb-36 space-y-3">

      {/* ── Greeting + status ── */}
      <div className="flex items-start justify-between animate-fade-in-scale">
        <div>
          <p className="text-xs text-muted-foreground mb-1">{getGreeting()},</p>
          <h1 className="text-xl font-bold text-foreground leading-tight">{user?.name}</h1>
          
        </div>
        <div >
        {metrics && (
          <div className="flex items-center gap-1.5 mt-1 px-2.5 py-1.5 rounded-full bg-muted">
            <span className={cn('w-1.5 h-1.5 rounded-full', statusCfg.dot)} />
            <span className={cn('text-xs font-medium', statusCfg.text)}>{statusCfg.label}</span>
          </div>
        )}
        </div>
      </div>

      {/* ── Suggestion / shift banner ── */}
      {user?.role === 'staff' ? (
        <StaffShiftBanner />
      ) : (
        !suggestionLoading && aiSuggestion && (
          <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl px-3 py-2.5 animate-slide-in-top">
            <div className="flex-1 min-w-0">
              <p className="text-s text-navy/80 font-bold mb-0.5">AI Suggestion</p>
              <p className="text-xs font-semibold text-primary truncate">{aiSuggestion.suggestionText}</p>
              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{aiSuggestion.explanation}</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="text-xs h-7 px-2.5 border-primary/30 text-primary shrink-0"
              onClick={() => aiSuggestion.actionPath && navigate(aiSuggestion.actionPath)}
            >
              {aiSuggestion.primaryAction}
            </Button>
            {aiSuggestion.dismissible && (
              <button
                onClick={() => dismissSuggestion.mutate(aiSuggestion.id)}
                className="text-muted-foreground hover:text-foreground shrink-0"
                aria-label="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )
      )}

      {/* ── Metrics row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {metricsLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : metrics ? (
          <>
            <MetricCard
              title="On the Floor"
              value={`${metrics.staffActive}/${metrics.staffTotal}`}
              icon={Users}
              subtitle={`${metrics.staffTotal - metrics.staffActive} away`}
              tooltip="Active staff currently on the shop floor vs total scheduled today"
              graphic={
                <MiniRing
                  value={metrics.staffTotal > 0 ? Math.round((metrics.staffActive / metrics.staffTotal) * 100) : 0}
                  className="text-primary"
                />
              }
              onClick={() => navigate('/staff')}
              className="animate-fade-in-up animation-delay-200"
            />
            <MetricCard
              title="Open Jobs"
              value={metrics.openTasks}
              icon={Briefcase}
              subtitle={metrics.criticalTasks > 0 ? `${metrics.criticalTasks} critical` : 'On track'}
              status={metrics.criticalTasks > 0 ? 'red' : undefined}
              tooltip="Total open job tasks — tap to see critical items requiring immediate action"
              graphic={
                <MiniBars
                  heights={[
                    metrics.openTasks,
                    Math.max(0, metrics.openTasks - metrics.criticalTasks),
                    metrics.criticalTasks,
                  ]}
                  className={metrics.criticalTasks > 0 ? 'text-critical' : 'text-primary'}
                />
              }
              onClick={() => navigate('/jobs')}
              className="animate-fade-in-up animation-delay-250"
            />
            <MetricCard
              title="Stock Level"
              value={metrics.stockAlerts > 0 ? `${metrics.stockAlerts} item${metrics.stockAlerts !== 1 ? 's' : ''}` : 'All good'}
              icon={Package}
              subtitle={metrics.stockAlerts >= 3 ? 'Critical — restock now' : metrics.stockAlerts > 0 ? 'Some items low' : 'All levels ok'}
              status={metrics.stockAlerts >= 3 ? 'red' : metrics.stockAlerts > 0 ? 'amber' : undefined}
              tooltip="Products flagged below minimum stock level — blue = fine, amber = some low, red = critical"
              graphic={
                <MiniBars
                  heights={metrics.stockAlerts >= 3 ? [8, 4, 2] : metrics.stockAlerts > 0 ? [8, 6, 4] : [8, 8, 8]}
                  className={metrics.stockAlerts >= 3 ? 'text-critical' : metrics.stockAlerts > 0 ? 'text-warning' : 'text-primary'}
                />
              }
              onClick={() => navigate('/stock')}
              className="animate-fade-in-up animation-delay-300"
            />
            <MetricCard
              title="Compliance"
              value={`${metrics.complianceProgress}%`}
              icon={ClipboardCheck}
              subtitle="Checklists done"
              status={metrics.complianceProgress < 50 ? 'red' : metrics.complianceProgress < 80 ? 'amber' : 'green'}
              tooltip="Percentage of today's compliance checklists completed across all sections"
              graphic={
                <MiniRing
                  value={metrics.complianceProgress}
                  className={metrics.complianceProgress < 50 ? 'text-critical' : metrics.complianceProgress < 80 ? 'text-warning' : 'text-success'}
                />
              }
              onClick={() => navigate('/compliance')}
              className="animate-fade-in-up animation-delay-350"
            />
          </>
        ) : null}
      </div>

      {/* ── Queue fill bars ── */}
      <QueueSummaryCard className="animate-fade-in-up animation-delay-375" />

    </div>

    {/* ── Quick Actions — sticky bottom bar ── */}
    <div className="fixed bottom-0 left-0 lg:left-64 right-0 z-40 bg-background border-t border-border px-4 py-3">
      <QuickActions />
    </div>
    </>
  )
}
