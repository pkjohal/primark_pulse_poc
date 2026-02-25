import { useState, useRef, type ReactNode } from 'react'
import { RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PullToRefreshProps {
  children: ReactNode
  onRefresh: () => Promise<void>
  className?: string
}

export function PullToRefresh({
  children,
  onRefresh,
  className,
}: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const startY = useRef(0)
  const isPulling = useRef(false)

  const threshold = 80
  const maxPull = 120

  const handleTouchStart = (e: React.TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      startY.current = e.touches[0].clientY
      isPulling.current = true
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling.current || isRefreshing) return

    const currentY = e.touches[0].clientY
    const diff = currentY - startY.current

    if (diff > 0 && containerRef.current?.scrollTop === 0) {
      const distance = Math.min(diff * 0.5, maxPull)
      setPullDistance(distance)
    }
  }

  const handleTouchEnd = async () => {
    if (!isPulling.current) return
    isPulling.current = false

    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
      }
    }
    setPullDistance(0)
  }

  const progress = Math.min(pullDistance / threshold, 1)

  return (
    <div
      ref={containerRef}
      className={cn('overflow-y-auto', className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <div
        className="flex items-center justify-center overflow-hidden transition-all duration-200"
        style={{
          height: isRefreshing ? 48 : pullDistance,
          opacity: progress,
        }}
      >
        <RefreshCw
          className={cn(
            'w-6 h-6 text-primary transition-transform',
            isRefreshing && 'animate-spin'
          )}
          style={{
            transform: `rotate(${progress * 180}deg)`,
          }}
        />
      </div>

      {/* Content */}
      {children}
    </div>
  )
}
