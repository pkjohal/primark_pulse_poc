import { cn } from '@/lib/utils'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

interface Zone {
  id: string
  name: string
}

interface ZoneFiltersProps {
  zones: Zone[]
  activeZone: string
  onZoneChange: (zoneId: string) => void
}

export function ZoneFilters({ zones, activeZone, onZoneChange }: ZoneFiltersProps) {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-2 pb-2">
        {zones.map((zone) => (
          <button
            key={zone.id}
            onClick={() => onZoneChange(zone.id)}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-full transition-colors shrink-0',
              'min-h-[44px]', // Touch target
              activeZone === zone.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            {zone.name}
          </button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
