import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingScreenProps {
  message?: string
  className?: string
}

export function LoadingScreen({ message = 'Loading...', className }: LoadingScreenProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center min-h-[50vh] gap-4',
        className
      )}
    >
      {/* Pulsing Primark logo */}
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-primary/20 animate-ping absolute" />
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center relative">
          <Loader2 className="w-8 h-8 text-primary-foreground animate-spin" />
        </div>
      </div>
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  )
}
