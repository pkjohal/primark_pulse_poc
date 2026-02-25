import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface QuantityStepperProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  className?: string
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  className,
}: QuantityStepperProps) {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1)
    }
  }

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1)
    }
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        variant="outline"
        size="icon"
        onClick={handleDecrement}
        disabled={value <= min}
        className="h-10 w-10 shrink-0"
        aria-label="Decrease quantity"
      >
        <Minus className="w-4 h-4" />
      </Button>

      <div className="w-12 h-10 flex items-center justify-center font-semibold text-lg">
        {value}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={handleIncrement}
        disabled={value >= max}
        className="h-10 w-10 shrink-0"
        aria-label="Increase quantity"
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  )
}
