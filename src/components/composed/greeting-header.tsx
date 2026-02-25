import { MapPin } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

function getTimeBasedGreeting(): string {
  const hour = new Date().getHours()

  if (hour < 12) {
    return 'Good morning'
  } else if (hour < 17) {
    return 'Good afternoon'
  } else {
    return 'Good evening'
  }
}

export function GreetingHeader() {
  const { user } = useAuthStore()
  const greeting = getTimeBasedGreeting()
  const displayName = user?.name?.split(' ')[0] || 'there'
  const storeName = user?.store

  return (
    <div className="mb-4 animate-fade-in-scale">
      <p className="text-sm text-muted-foreground">{greeting},</p>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">{displayName}</h1>
        {storeName && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            <span>{storeName}</span>
          </div>
        )}
      </div>
    </div>
  )
}
