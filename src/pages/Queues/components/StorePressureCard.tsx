import { Clock, Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PressureIndicator, StorePressure } from '@/types'

interface StorePressureCardProps {
  pressure: PressureIndicator
  className?: string
}

const pressureConfig: Record<
  StorePressure,
  { textColor: string; bgColor: string; label: string }
> = {
  low: {
    textColor: 'text-[#388E3C]',
    bgColor: 'bg-[#388E3C]/10',
    label: 'LOW',
  },
  medium: {
    textColor: 'text-[#F57C00]',
    bgColor: 'bg-[#F57C00]/10',
    label: 'MEDIUM',
  },
  high: {
    textColor: 'text-[#D32F2F]',
    bgColor: 'bg-[#D32F2F]/10',
    label: 'HIGH',
  },
}

export function StorePressureCard({ pressure, className }: StorePressureCardProps) {
  const config = pressureConfig[pressure.level]

  return (
    <div
      className={cn(
        'bg-white border border-slate-200 rounded p-3',
        className
      )}
    >
      <div className="space-y-2">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-900">Store Pressure</span>
          </div>
          <span
            className={cn(
              'text-xs font-bold px-1.5 py-0.5 rounded-sm',
              config.bgColor,
              config.textColor
            )}
          >
            {config.label}
          </span>
        </div>

        {/* Peak Forecast */}
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-600">
            {pressure.peakForecast}
          </span>
        </div>

        {/* Suggested Action */}
        {pressure.suggestedTask && (
          <div className="flex items-start gap-2 pt-2 border-t border-slate-100">
            <Lightbulb className="w-3.5 h-3.5 mt-0.5 text-slate-400" />
            <span className="text-xs text-slate-600">
              {pressure.suggestedTask}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
