import { MapPin, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ZoneLocation } from '@/types'

interface ZoneLocationDisplayProps {
  location: ZoneLocation
  compact?: boolean
  className?: string
}

export function ZoneLocationDisplay({
  location,
  compact = false,
  className,
}: ZoneLocationDisplayProps) {
  if (compact) {
    // Compact inline display: Zone A > Aisle 12 > Bay 3
    return (
      <div className={cn('flex items-center gap-1 text-xs text-primary', className)}>
        <MapPin className="w-3.5 h-3.5" />
        <span className="font-medium">Zone {location.zone}</span>
        <ChevronRight className="w-3 h-3 text-muted-foreground" />
        <span>Aisle {location.aisle}</span>
        <ChevronRight className="w-3 h-3 text-muted-foreground" />
        <span>Bay {location.bay}</span>
        {location.shelf && (
          <>
            <span className="text-muted-foreground/50">•</span>
            <span className="text-muted-foreground">{location.shelf}</span>
          </>
        )}
      </div>
    )
  }

  // Full card display
  return (
    <div className={cn('bg-primary/5 rounded-xl p-3', className)}>
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="w-4 h-4 text-primary" />
        <span className="text-xs font-medium text-foreground">Find on Floor</span>
      </div>

      {/* Breadcrumb path */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <span className="px-2.5 py-1 bg-primary text-white text-sm font-semibold rounded-lg">
            Zone {location.zone}
          </span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="flex items-center gap-1">
          <span className="px-2.5 py-1 bg-white text-foreground text-sm font-medium rounded-lg shadow-sm">
            Aisle {location.aisle}
          </span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
        <span className="px-2.5 py-1 bg-white text-foreground text-sm font-medium rounded-lg shadow-sm">
          Bay {location.bay}
        </span>
      </div>

      {/* Shelf indicator */}
      {location.shelf && (
        <p className="mt-2 text-xs text-muted-foreground">
          Shelf: <span className="font-medium text-foreground">{location.shelf}</span>
        </p>
      )}
    </div>
  )
}
