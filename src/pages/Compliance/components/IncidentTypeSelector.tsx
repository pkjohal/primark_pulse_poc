import {
  AlertTriangle,
  Users,
  ShoppingBag,
  Wrench,
  Heart,
  HelpCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { IncidentType } from '@/types'

interface IncidentTypeSelectorProps {
  value: IncidentType | null
  onChange: (value: IncidentType) => void
  className?: string
}

const incidentTypes: { value: IncidentType; label: string; icon: typeof AlertTriangle }[] = [
  { value: 'slip-fall', label: 'Slip / Fall', icon: AlertTriangle },
  { value: 'customer-complaint', label: 'Complaint', icon: Users },
  { value: 'theft', label: 'Theft', icon: ShoppingBag },
  { value: 'equipment-failure', label: 'Equipment', icon: Wrench },
  { value: 'injury', label: 'Injury', icon: Heart },
  { value: 'other', label: 'Other', icon: HelpCircle },
]

export function IncidentTypeSelector({
  value,
  onChange,
  className,
}: IncidentTypeSelectorProps) {
  return (
    <div className={cn('grid grid-cols-3 gap-2', className)}>
      {incidentTypes.map((type) => {
        const Icon = type.icon
        const isSelected = value === type.value

        return (
          <button
            key={type.value}
            type="button"
            onClick={() => onChange(type.value)}
            className={cn(
              'flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all',
              'active:scale-[0.98]',
              isSelected
                ? 'bg-primary/10 border-primary text-primary'
                : 'bg-white border-slate-200 text-foreground hover:border-slate-300'
            )}
          >
            <Icon className={cn(
              'w-5 h-5',
              isSelected ? 'text-primary' : 'text-muted-foreground'
            )} />
            <span className="text-xs font-medium">{type.label}</span>
          </button>
        )
      })}
    </div>
  )
}
