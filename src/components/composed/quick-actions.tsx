import { useNavigate } from 'react-router-dom'
import { Scan, Package, Plus, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCurrentShift } from '@/hooks/useCurrentShift'
import type { LucideIcon } from 'lucide-react'

interface Action {
  key: string
  icon: LucideIcon
  label: string
  delay: string
}

const actions: Action[] = [
  { key: 'schedule', icon: Calendar, label: 'My Schedule',  delay: 'animation-delay-150' },
  { key: 'scan',     icon: Scan,     label: 'Scan Item',    delay: 'animation-delay-200' },
  { key: 'lookup',   icon: Package,  label: 'Store Lookup', delay: 'animation-delay-250' },
  { key: 'issue',    icon: Plus,     label: 'Log Issue',    delay: 'animation-delay-300' },
]

export function QuickActions() {
  const navigate = useNavigate()
  const { data: shift } = useCurrentShift()

  const handleAction = (key: string) => {
    if (key === 'scan')     navigate('/stock', { state: { openScanner: true } })
    if (key === 'lookup')   navigate('/stock')
    if (key === 'schedule') navigate('/schedule')
    // Log Issue: placeholder — no navigation yet
  }

  return (
    <div className="grid grid-cols-4 gap-2">
      {actions.map(({ key, icon: Icon, label, delay }) => (
        <button
          key={key}
          onClick={() => handleAction(key)}
          className={cn(
            'flex flex-row items-center justify-start gap-3',
            'py-3 px-3 rounded-xl',
            'bg-white text-foreground',
            'border border-border',
            'shadow-card hover:shadow-card-hover hover:-translate-y-0.5',
            'active:scale-[0.97] transition-all duration-200',
            'min-h-touch animate-fade-in-up',
            delay
          )}
        >
          <div className="p-2 rounded-lg bg-primary/10 shrink-0">
            <Icon className="w-4.5 h-4.5 text-primary" />
          </div>
          <div className="flex flex-col items-start min-w-0">
            <span className="text-sm font-medium leading-tight truncate">{label}</span>
            {key === 'schedule' && shift && shift.shiftStart !== '--:--' && (
              <span className="text-xs text-muted-foreground leading-none mt-0.5">
                {shift.shiftStart}–{shift.shiftEnd}
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  )
}
