import { X, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { WavePattern } from '@/components/decorative'
import type { AISuggestion } from '@/types'

interface AIBannerProps {
  suggestion: AISuggestion
  onDismiss: () => void
  className?: string
}

export function AIBanner({
  suggestion,
  onDismiss,
  className,
}: AIBannerProps) {
  const navigate = useNavigate()

  const handleAction = () => {
    if (suggestion.actionPath) {
      navigate(suggestion.actionPath)
    }
  }

  return (
    <Card
      variant="ai"
      className={cn('relative p-4 animate-slide-in-top animation-delay-100 overflow-hidden', className)}
    >
      {/* Decorative wave pattern */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <WavePattern className="text-white h-14" />
      </div>

      {/* Dismiss button */}
      {suggestion.dismissible && (
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation()
            onDismiss()
          }}
          className="absolute top-2 right-2 h-10 w-10 text-white/80 hover:text-white hover:bg-white/20 z-10"
          aria-label="Dismiss suggestion"
        >
          <X className="w-5 h-5" />
        </Button>
      )}

      {/* Header */}
      <div className="flex items-center gap-2 mb-2 relative z-10">
        <span className="text-sm font-medium opacity-90">Suggestion</span>
      </div>

      {/* Suggestion text - bolder for readability in bright lighting */}
      <h3 className="text-lg font-bold mb-2 pr-8 relative z-10">
        {suggestion.suggestionText}
      </h3>

      {/* Explanation - truncated to 2 lines */}
      <p className="text-sm opacity-80 mb-4 leading-relaxed line-clamp-2 relative z-10">
        {suggestion.explanation}
      </p>

      {/* Action button - bolder CTA with cyan glow */}
      <Button
        onClick={handleAction}
        variant="secondary"
        className="bg-white text-primary-700 font-semibold shadow-[0_4px_14px_rgba(0,175,219,0.25)] hover:bg-white/95 hover:shadow-[0_6px_20px_rgba(0,175,219,0.35)] transition-all relative z-10"
      >
        {suggestion.primaryAction}
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </Card>
  )
}
