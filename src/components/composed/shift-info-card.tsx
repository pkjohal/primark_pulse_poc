import { Clock, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { WavePattern } from '@/components/decorative'

interface ShiftInfoCardProps {
  shiftStart: string
  shiftEnd: string
  breakTime?: string
  isLoading?: boolean
  isScrolled?: boolean
}

export function ShiftInfoCard({
  shiftStart,
  shiftEnd,
  breakTime,
  isLoading = false,
  isScrolled = false,
}: ShiftInfoCardProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate('/schedule')
  }

  if (isLoading) {
    return (
      <div
        className={cn(
          'fixed bottom-nav-safe left-4 right-4 z-40',
          'rounded-2xl p-5 animate-pulse',
          'transition-all duration-300 ease-out',
          isScrolled
            ? 'bg-primary/70 backdrop-blur-md shadow-lg'
            : 'bg-gradient-to-r from-primary to-primary-600'
        )}
      >
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 bg-white/20 rounded-xl" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-20 bg-white/20 rounded" />
            <div className="h-5 w-28 bg-white/20 rounded" />
          </div>
          <div className="space-y-2 text-right">
            <div className="h-3 w-14 bg-white/20 rounded ml-auto" />
            <div className="h-4 w-12 bg-white/20 rounded ml-auto" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'fixed bottom-nav-safe left-4 right-4 z-40',
        'rounded-2xl p-5 overflow-hidden',
        'text-white text-left',
        'transition-all duration-300 ease-out',
        'animate-slide-in-bottom animation-delay-450',
        'hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]',
        isScrolled
          ? 'bg-primary/70 backdrop-blur-md shadow-lg'
          : 'bg-gradient-to-r from-primary to-primary-600'
      )}
    >
      {/* Decorative wave background */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <WavePattern className="text-white h-10" />
      </div>

      <div className="flex items-center gap-4 relative z-10">
        {/* Clock icon */}
        <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center">
          <Clock className="w-5 h-5" />
        </div>

        {/* Shift info */}
        <div className="flex-1">
          <p className="text-xs opacity-85">Today's Shift</p>
          <p className="text-lg font-bold mt-0.5">
            {shiftStart} - {shiftEnd}
          </p>
        </div>

        {/* Break time */}
        {breakTime && (
          <div className="text-right mr-2">
            <p className="text-[11px] opacity-85">Break at</p>
            <p className="text-base font-semibold mt-0.5">{breakTime}</p>
          </div>
        )}

        {/* Chevron */}
        <ChevronRight className="w-5 h-5 opacity-70" />
      </div>
    </button>
  )
}
