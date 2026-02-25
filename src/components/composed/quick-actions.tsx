import { useNavigate } from 'react-router-dom'
import { Scan, Package, Plus, Calendar, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PulseRings } from '@/components/decorative'

export function QuickActions() {
  const navigate = useNavigate()

  const handleScanItem = () => {
    navigate('/stock', { state: { openScanner: true } })
  }

  const handleStockLookup = () => {
    navigate('/stock')
  }

  const handleLogIssue = () => {
    // Future: open incident form
    // For now, this is a placeholder
    console.log('Log issue - coming soon')
  }

  const handleSchedule = () => {
    navigate('/schedule')
  }

  return (
    <div className="space-y-2.5 mb-4">
      {/* Top row - Scan, Stock Lookup, Log Issue */}
      <div className="grid grid-cols-[1.5fr_1fr_1fr] gap-2.5">
        {/* Scan Item - Primary action */}
        <button
          onClick={handleScanItem}
          className={cn(
            'relative flex flex-col items-center justify-center gap-2',
            'py-5 px-3 rounded-2xl overflow-hidden',
            'bg-primary text-white',
            'shadow-[0_4px_12px_rgba(0,175,219,0.3)]',
            'active:scale-[0.97] hover:shadow-[0_6px_16px_rgba(0,175,219,0.4)] transition-all duration-200',
            'min-h-touch',
            'animate-fade-in-up animation-delay-150'
          )}
        >
          {/* Decorative pulse rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <PulseRings className="w-28 h-28 text-white/25" />
          </div>

          <Scan className="w-6 h-6 relative z-10" />
          <span className="text-sm font-semibold relative z-10">Scan Item</span>
        </button>

        {/* Stock Lookup - Secondary action */}
        <button
          onClick={handleStockLookup}
          className={cn(
            'flex flex-col items-center justify-center gap-1.5',
            'py-4 px-2 rounded-2xl',
            'bg-white text-foreground',
            'shadow-card hover:shadow-card-hover hover:-translate-y-0.5',
            'active:scale-[0.97] transition-all duration-200',
            'min-h-touch',
            'animate-fade-in-up animation-delay-200'
          )}
        >
          <Package className="w-5 h-5" />
          <span className="text-xs font-medium">Stock Lookup</span>
        </button>

        {/* Log Issue - Secondary action */}
        <button
          onClick={handleLogIssue}
          className={cn(
            'flex flex-col items-center justify-center gap-1.5',
            'py-4 px-2 rounded-2xl',
            'bg-white text-foreground',
            'shadow-card hover:shadow-card-hover hover:-translate-y-0.5',
            'active:scale-[0.97] transition-all duration-200',
            'min-h-touch',
            'animate-fade-in-up animation-delay-250'
          )}
        >
          <Plus className="w-5 h-5" />
          <span className="text-xs font-medium">Log Issue</span>
        </button>
      </div>

      {/* My Schedule - Full width row */}
      <button
        onClick={handleSchedule}
        className={cn(
          'flex items-center justify-between w-full',
          'py-3.5 px-4 rounded-2xl',
          'bg-white text-foreground',
          'shadow-card hover:shadow-card-hover hover:-translate-y-0.5',
          'active:scale-[0.99] transition-all duration-200',
          'animate-fade-in-up animation-delay-300'
        )}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <span className="text-sm font-semibold">My Schedule</span>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </button>
    </div>
  )
}
