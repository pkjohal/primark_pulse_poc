import { Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PeerTip } from '@/types'

interface PeerTipCardProps {
  tip: PeerTip
  className?: string
  compact?: boolean
}

export function PeerTipCard({ tip, className, compact = false }: PeerTipCardProps) {
  if (compact) {
    return (
      <div className={cn('flex items-center gap-1.5 text-xs text-amber-600', className)}>
        <Lightbulb className="w-3.5 h-3.5 animate-tip-pulse" />
        <span>Tip available</span>
      </div>
    )
  }

  return (
    <div className={cn('p-3 rounded-lg bg-amber-50 border border-amber-100', className)}>
      <div className="flex items-start gap-2">
        <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-amber-700 mb-1">
            Tip from {tip.storeName}
          </p>
          <p className="text-sm text-amber-900 leading-relaxed">
            "{tip.tip}"
          </p>
        </div>
      </div>
    </div>
  )
}
