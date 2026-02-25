import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import type { PolicySearchResult } from '@/types'

interface PolicyResultProps {
  result: PolicySearchResult
  className?: string
}

const confidenceColors = {
  high: 'success',
  medium: 'warning',
  low: 'critical',
} as const

export function PolicyResult({ result, className }: PolicyResultProps) {
  return (
    <Card className={cn('p-4', className)}>
      {/* Query */}
      <div className="flex items-start gap-2 mb-3">
        <p className="text-sm font-medium text-foreground italic">
          "{result.query}"
        </p>
      </div>

      {/* Response */}
      <p className="text-sm text-foreground leading-relaxed mb-4">
        {result.response}
      </p>

      {/* Attribution */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <span className="text-xs text-muted-foreground">
          Source: {result.source}
        </span>
        <Badge variant={confidenceColors[result.confidence]} size="sm">
          {result.confidence.charAt(0).toUpperCase() + result.confidence.slice(1)} confidence
        </Badge>
      </div>
    </Card>
  )
}
