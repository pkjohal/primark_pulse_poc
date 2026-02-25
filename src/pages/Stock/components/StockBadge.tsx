import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StockBadgeProps {
  quantity: number
  showLabel?: boolean
  size?: 'sm' | 'md'
  className?: string
}

type StockStatus = 'out' | 'low' | 'ok'

function getStockStatus(quantity: number): StockStatus {
  if (quantity === 0) return 'out'
  if (quantity <= 5) return 'low'
  return 'ok'
}

const statusConfig: Record<StockStatus, {
  bg: string
  text: string
  label: string
  Icon: typeof AlertTriangle
}> = {
  out: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    label: 'Out of Stock',
    Icon: AlertTriangle,
  },
  low: {
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    label: 'Low Stock',
    Icon: AlertCircle,
  },
  ok: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    label: 'In Stock',
    Icon: CheckCircle,
  },
}

export function StockBadge({
  quantity,
  showLabel = true,
  size = 'md',
  className,
}: StockBadgeProps) {
  const status = getStockStatus(quantity)
  const config = statusConfig[status]
  const { Icon } = config

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        config.bg,
        config.text,
        sizeClasses[size],
        className
      )}
    >
      <Icon className={iconSizes[size]} />
      {showLabel && <span>{config.label}</span>}
    </span>
  )
}
