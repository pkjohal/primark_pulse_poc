import { Clock, Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import type { PressureIndicator, StorePressure } from '@/types'

interface StorePressureCardProps {
  pressure: PressureIndicator
  className?: string
}

const pressureConfig: Record<StorePressure, { textColor: string; bgColor: string; dot: string; label: string }> = {
  low:    { textColor: 'text-success',  bgColor: 'bg-success/10',  dot: 'bg-success',  label: 'Low'    },
  medium: { textColor: 'text-warning',  bgColor: 'bg-warning/10',  dot: 'bg-warning',  label: 'Medium' },
  high:   { textColor: 'text-critical', bgColor: 'bg-critical/10', dot: 'bg-critical', label: 'High'   },
}

export function StorePressureCard({ pressure, className }: StorePressureCardProps) {
  const config = pressureConfig[pressure.level]

  return (
    <Card className={cn('p-4 space-y-3', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">Store Pressure</p>
        <div className="flex items-center gap-1.5">
          <span className={cn('w-2 h-2 rounded-full', config.dot)} />
          <span className={cn('text-xs font-semibold', config.textColor)}>{config.label}</span>
        </div>
      </div>

      {/* Peak Forecast */}
      <div className="flex items-center gap-2">
        <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        <span className="text-xs text-muted-foreground">{pressure.peakForecast}</span>
      </div>

      {/* Suggested Action */}
      {pressure.suggestedTask && (
        <div className="flex items-start gap-2 pt-2 border-t border-border">
          <Lightbulb className="w-3.5 h-3.5 mt-0.5 text-muted-foreground shrink-0" />
          <span className="text-xs text-muted-foreground">{pressure.suggestedTask}</span>
        </div>
      )}
    </Card>
  )
}
